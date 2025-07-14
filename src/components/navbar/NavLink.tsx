// components/NavLink.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils"; // Optional className utility

type NavLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export default function NavLink({
  href,
  label,
  className = "",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <NavigationMenuItem key={href}>
      <NavigationMenuLink asChild
                      className={cn(
            "transition-colors",
            isActive ? "text-yellow-200 font-semibold" : "text-white",
            className
          )}
                    >
                      <Link href={href}>
                        {label}
                      </Link>
                   </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
