import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function SocialLogin() {
  const providers = [
    {
      name: "google",
      icon: <FcGoogle size={20} />,
      text: "Google",
    },
    {
      name: "github",
      icon: <FaGithub size={20} />,
      text: "GitHub",
    },
  ];

  const onClick = (
    provider: "google" | "github"
  ) => {
    signIn(provider, {
      callbackUrl: "/members",
    });
  };

  return (
    <div className="flex items-center w-full gap-2">
      {providers.map((provider) => (
        <Button
          key={provider.name}
          className="flex-grow"
          size="lg"
          variant="outline"
          onClick={() =>
            onClick(
              provider.name as "google" | "github"
            )
          }
        >
          {provider.icon}
        </Button>
      ))}
    </div>
  );
}