import { getUnapprovedPhotos } from "@/app/actions/adminActions";
import MemberPhotos from "@/components/MemberPhotos";
import { Separator } from "@/components/ui/separator"; 

export const dynamic = "force-dynamic";

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();

  return (
    <div className="flex flex-col mt-10 gap-4">
      <h3 className="text-2xl font-semibold">Photos awaiting moderation</h3>
      <Separator />
      <MemberPhotos photos={photos} />
    </div>
  );
}
