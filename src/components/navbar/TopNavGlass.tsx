import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GiSelfLove } from "react-icons/gi";
import NavLink from "./NavLink";
import UserMenu from "./UserMenu";
import { getUserInfoForNav } from "@/app/actions/userActions";
import FiltersWrapper from "./FiltersWrapper";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default async function TopNavGlass() {
  const session = await auth();
  const userInfo =
    session?.user && (await getUserInfoForNav());

  const memberLinks = [
    { href: "/members", label: "Matches" },
    { href: "/lists", label: "Lists" },
    { href: "/messages", label: "Messages" },
  ];

  const adminLinks = [
    { href: "/admin/moderation", label: "Photo Moderation" },
  ];

  const links =
    session?.user.role === "ADMIN"
      ? adminLinks
      : memberLinks;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/60 shadow-sm relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/80 before:to-gray-50/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 relative z-10">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <GiSelfLove
              size={36}
              className="text-pink-500 drop-shadow-sm"
            />
            <span className="font-bold text-2xl text-slate-800 tracking-tight">
              MatchMe
            </span>
          </Link>

          {/* Desktop Nav */}
          {session && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-6">
                {links.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    className="text-lg text-slate-800 font-medium tracking-wide transition-colors hover:text-slate-900 data-[active=true]:text-pink-600 data-[active=true]:font-semibold"
                  />
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {userInfo ? (
              <UserMenu user={userInfo} />
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-gray-300/80 text-slate-700 bg-white/60 backdrop-blur-md hover:bg-white/80 hover:border-gray-400/80 transition-all duration-200 font-medium shadow-sm rounded-lg"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="bg-pink-500/90 backdrop-blur-md text-white border-0 hover:bg-pink-600 transition-all duration-200 font-medium shadow-md rounded-lg hover:shadow-lg"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px] sm:w-[300px] p-5">
                <div className="flex flex-col gap-4 mt-8">
                  {session &&
                    links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-lg text-slate-800 font-medium hover:text-pink-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  {!userInfo && (
                    <>
                      <Button asChild variant="outline" className="mt-4">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild className="bg-pink-500 hover:bg-pink-600">
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                  {userInfo && <UserMenu user={userInfo} />}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <FiltersWrapper />
    </>
  );
}
