// components/NavLink.tsx
"use client";
import useMessageStore from "@/hooks/useMessageStore";
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
  const unreadCount = useMessageStore(
    (state) => (state.unreadCount)
  );

  return (
    <NavigationMenuItem key={href}>
      <NavigationMenuLink asChild
                      className={cn(
            "transition-colors",
            isActive ? "text-yellow-200 font-semibold" : "text-white",
            className
          )}
                    >
                      <Link href={href} className="relative flex flex-row">
                        <span>{label}</span>
                        {href === "/messages" &&
                        unreadCount > 0 && (
                          <span
                            className="
                              bg-pink-400 text-white text-xs 
                              rounded-full px-1.5 py-0.5 
                              min-w-[20px] flex items-center justify-center
                              shadow-md
                            "
                          >
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                   </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
