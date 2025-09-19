import Link from "next/link";
import React from "react";
import { GiSelfLove } from "react-icons/gi";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import NavLink from "./NavLink";
import { auth } from "@/auth";
import UserMenu from "./UserMenu";
import { getUserInfoForNav } from "@/app/actions/userActions";
import FiltersWrapper from "./FiltersWrapper";
import { Button } from "@/components/ui/button";

export default async function TopNav() {
  const session = await auth();
  const userInfo = session?.user && (await getUserInfoForNav());


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

  const links =
    session?.user.role === "ADMIN"
      ? adminLinks
      : memberLinks;

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-pink-400 via-red-400 to-pink-600 px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <GiSelfLove size={40} className="text-gray-200" />
          <span className="font-bold text-3xl text-gray-200">MatchMe</span>
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {links.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Auth / User */}
        <div className="flex items-center gap-3">
         {
          userInfo ? (
            <UserMenu userInfo={userInfo} />
          ) : (
            <>
              <Button asChild variant="outline" className="border-white text-pink-600 hover:bg-white hover:text-pink-600">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-pink-600 hover:bg-white hover:text-pink-600">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Filters below Navbar */}
      <FiltersWrapper />
    </>
  );
}
