'use server';

import { MessageSchema, messageSchema } from '@/lib/schemas/MessageSchema';
import { ActionResult, MessageDto } from '@/types';
import { getAuthUserId } from './authActions';
import { prisma } from '@/lib/prisma';
import { mapMessageToMessageDto } from '@/lib/mappings';
import { pusherServer } from '@/lib/pusher';
import { createChatId } from '@/lib/utils';
import { Prisma } from '@prisma/client';

type ThreadDto = {
  id: string;
  text: string;
  created: string; 
  dateRead: string | null; 
  senderId: string; 
  senderName: string;
  senderImage: string | null;
  recipientId: string; 
  recipientName: string;
  recipientImage: string | null;
  unreadCount: bigint; 
}

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<MessageDto>> {
    try {
        const userId = await getAuthUserId();

        const validated = messageSchema.safeParse(data);

        if (!validated.success) return { status: 'error', error: validated.error.issues }

        const { text } = validated.data;

        const message = await prisma.message.create({
            data: {
                text,
                recipientId: recipientUserId,
                senderId: userId
            },
            select: messageSelect
        });
        const messageDto = mapMessageToMessageDto(message);

        const chatId = createChatId(userId, recipientUserId);
        await pusherServer.trigger(chatId, 'message:new', messageDto);
        await pusherServer.trigger(`private-${recipientUserId}`, 'message:new', messageDto);

        return { status: 'success', data: messageDto };
    } catch (error) {
        console.log(error);
        return { status: 'error', error: 'Something went wrong' }
    }
}

export async function getMessageThread(recipientId: string, limit = 10, cursor?: string) {
    try {
        console.log('called getMessageThread')
        const userId = await getAuthUserId();

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        recipientId,
                        senderDeleted: false
                    },
                    {
                        senderId: recipientId,
                        recipientId: userId,
                        recipientDeleted: false
                    }
                ]
            },
            orderBy: {
                created: 'desc' // Corrected: Order by descending to get most recent messages first
            },
            select: messageSelect,
            take: limit,
            ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
        });
        let nextCursor: string | undefined = undefined;
        if (messages.length === limit) {
            nextCursor = messages[messages.length - 1].id;
        }
        
        // Corrected: The rest of the logic remains mostly the same
        let readCount = 0;
        if (messages.length > 0) {
            const unreadMessageIds = messages
                .filter(m => m.dateRead === null
                    && m.recipient?.userId === userId
                    && m.sender?.userId === recipientId)
                .map(m => m.id);

            await prisma.message.updateMany({
                where: {
                    senderId: recipientId,
                    recipientId: userId,
                    dateRead: null
                },
                data: { dateRead: new Date() }
            })

            readCount = unreadMessageIds.length;

            await pusherServer.trigger(createChatId(recipientId, userId), 'messages:read', unreadMessageIds);
        }

        return { messages: messages.map(message => mapMessageToMessageDto(message)), readCount , nextCursor}

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getMessagesByContainer(container?: string | null, cursor?: string, limit = 10) {
  try {
    const isOutbox = container === 'outbox';
    const userId = await getAuthUserId();

    console.log(`Getting messages for userId: ${userId} in container: ${container}`);

    if (!userId) {
      console.error('Authentication Error: User ID not found.');
      return { threads: [], nextCursor: undefined };
    }

    const distinctColumn = isOutbox ? '"recipientId"' : '"senderId"';
    const otherColumn = isOutbox ? '"senderId"' : '"recipientId"';
    const deleteColumn = isOutbox ? '"senderDeleted"' : '"recipientDeleted"';

    const rawQuery = Prisma.sql`
      SELECT DISTINCT ON (${Prisma.raw(distinctColumn)})
       m.id,
        m.text,
        m.created,
        m."dateRead",
        s."userId" as "senderUserId",
        s.name as "senderName",
        s.image as "senderImage",
        r."userId" as "recipientUserId",
        r.name as "recipientName",
        r.image as "recipientImage",
        (
          SELECT COUNT(*)
          FROM "Message" um
          WHERE um.${Prisma.raw(distinctColumn)} = m.${Prisma.raw(distinctColumn)}
            AND um.${Prisma.raw(otherColumn)} = ${userId}
            AND um."dateRead" IS NULL
            ${isOutbox ? Prisma.empty : Prisma.sql`AND um."recipientDeleted" = false`}
        ) as "unreadCount"
      FROM "Message" m
      LEFT JOIN "Member" s ON m."senderId" = s."userId"
      LEFT JOIN "Member" r ON m."recipientId" = r."userId"
      WHERE m.${Prisma.raw(isOutbox ? '"senderId"' : '"recipientId"')} = ${userId}
        AND m.${Prisma.raw(deleteColumn)} = false
        ${cursor ? Prisma.sql`AND m."created" <= ${cursor}::timestamp` : Prisma.empty}
      ORDER BY ${Prisma.raw(distinctColumn)}, m."created" DESC
      LIMIT ${limit + 1};
    `;

    const rawThreads:ThreadDto[] = await prisma.$queryRaw(rawQuery);

    const threads = rawThreads.slice(0, limit).map(row => {
      const lastMessage: MessageDto = {
        id: row.id,
        text: row.text,
        created: row.created,
        dateRead: row.dateRead,
        senderId: row.senderId,
        senderName: row.senderName,
        senderImage: row.senderImage,
        recipientId: row.recipientId,
        recipientName: row.recipientName,
        recipientImage: row.recipientImage,
      };
      
      return {
        lastMessage,
        unreadCount: Number(row.unreadCount) || 0,
      };
    });

    let nextCursor: string | undefined;
    if (rawThreads.length > limit) {
      nextCursor = rawThreads[rawThreads.length - 1].created;
    }

    return { threads, nextCursor };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
    const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted';

    try {
        const userId = await getAuthUserId();

        await prisma.message.update({
            where: { id: messageId },
            data: {
                [selector]: true
            }
        })

        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        })

        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({ id: m.id }))
                }
            })
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUnreadMessageCount() {
    try {
        const userId = await getAuthUserId();

        return prisma.message.count({
            where: {
                recipientId: userId,
                dateRead: null,
                recipientDeleted: false
            }
        })
    } catch (error) {
        console.log(error);
        throw error;
    }
}

const messageSelect = {
    id: true,
    text: true,
    created: true,
    dateRead: true,
    sender: {
        select: {
            userId: true,
            name: true,
            image: true
        }
    },
    recipient: {
        select: {
            userId: true,
            name: true,
            image: true
        }
    }
}