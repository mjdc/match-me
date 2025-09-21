import { verifyEmail } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { MdOutlineMailOutline } from "react-icons/md";

interface PageProps {
  searchParams: Promise<{ token: string }>; 
}

export default async function VerifyEmailPage({searchParams}: PageProps) {

  const {token} = await searchParams;
  const result = await verifyEmail(token ?? "");

  return (
    <CardWrapper
      headerText="Verify your email address"
      headerIcon={MdOutlineMailOutline}
      footer={<ResultMessage result={result} />}
    />
  );
}