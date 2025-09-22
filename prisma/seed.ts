import { PrismaClient } from '@prisma/client';
import { membersData } from './membersData.js';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function seedMembers() {
  await Promise.all(
    membersData.map(async (member) => {
      await prisma.user.upsert({
        where: { email: member.email },
        update: {
          name: member.name,
          image: member.image,
          profileComplete: true,
          passwordHash: await hash('password', 10),
          member: {
            update: {
              dateOfBirth: new Date(member.dateOfBirth),
              gender: member.gender,
              name: member.name,
              updated: new Date(member.lastActive),
              description: member.description,
              city: member.city,
              country: member.country,
              image: member.image,
              photos: {
                upsert: {
                  where: { url: member.image },
                  update: { isApproved: true },
                  create: { url: member.image, isApproved: true },
                },
              },
            },
          },
        },
        create: {
          email: member.email,
          emailVerified: new Date(),
          name: member.name,
          image: member.image,
          profileComplete: true,
          passwordHash: await hash('password', 10),
          member: {
            create: {
              dateOfBirth: new Date(member.dateOfBirth),
              gender: member.gender,
              name: member.name,
              created: new Date(member.created),
              updated: new Date(member.lastActive),
              description: member.description,
              city: member.city,
              country: member.country,
              image: member.image,
              photos: {
                create: {
                  url: member.image,
                  isApproved: true,
                },
              },
            },
          },
        },
      });
    })
  );
}

async function seedAdmin() {
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: await hash('password', 10),
      emailVerified: new Date(),
    },
    create: {
      email: 'admin@test.com',
      emailVerified: new Date(),
      name: 'Admin',
      passwordHash: await hash('password', 10),
      role: 'ADMIN',
    },
  });
}

async function main() {
  await seedMembers();
  await seedAdmin();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
