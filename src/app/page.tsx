import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div>
      <h1 className="text-3xl text-red-400">Hello</h1>
      {session ? (
        <div>
          <p>Welcome, {session.user?.name || "User"}!</p>
          <pre>
            {JSON.stringify(session, null, 2)}
          </pre>
          <form action ={async () => {
            "use server";
            await signOut();}}
          >
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      ) : (
        <div> Mot logged it</div>
      )
     }
     </div>
  );
}
