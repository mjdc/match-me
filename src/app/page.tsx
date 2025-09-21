import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col justify-center items-center mt-20 gap-6 text-foreground">
      <h1 className="text-4xl font-bold">Welcome to MatchMe App</h1>

      {session ? (
        <Button asChild size="lg" variant="outline">
          <Link href="/members">Continue</Link>
        </Button>
      ) : (
        <div className="flex flex-row gap-4">
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
