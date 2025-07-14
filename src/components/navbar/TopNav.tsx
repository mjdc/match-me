import React from "react";
import Link from "next/link";
import { GiSelfLove } from "react-icons/gi";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
// import { getUserInfoForNav } from "@/app/actions/userActions";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavLink from "./NavLink";

export default async function TopNav() {
  const session = await auth();
  // const userInfo =
  //   session?.user && (await getUserInfoForNav());

  const memberLinks = [
    { href: "/members", label: "Matches" },
    { href: "/lists", label: "Lists" },
    { href: "/messages", label: "Messages" },
  ];

  const adminLinks = [
    {
      href: "/admin/moderation",
      label: "Photo Moderation",
    },
  ];

  const links = memberLinks
    // session?.user.role === "ADMIN"
    //   ? adminLinks
    //   : memberLinks;

  return (
    <>
      <header className="w-full bg-gradient-to-r from-pink-400 via-red-400 to-pink-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GiSelfLove size={36} className="text-gray-200" />
            <span className="font-bold text-2xl text-gray-200">
              MatchMe
            </span>
          </Link>

          {/* NavigationMenu (centered) */}
          <NavigationMenu>
            <NavigationMenuList className="gap-4 text-xl uppercase">
              {/* session && */
                links.map((item) => (
                  <NavLink href={item.href} label={item.label} key={item.href} />
                ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side - Auth buttons or user menu */}
          <div className="flex gap-2 items-center">
            {
            session?.user ? (
              <UserMenu user={session.user} />
            ) : 
            (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-red-500"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-red-500"
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* <FiltersWrapper /> */}
    </>
  );
}
