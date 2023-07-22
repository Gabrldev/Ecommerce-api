"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const parms = useParams();
  const routes = [
    {
      href: `${parms.storeId}/`,
      label: "Overview",
      active: pathname === `/${parms.storeId}`,
    },

    {
      href: `${parms.storeId}/billboards`,
      label: "Billboards",
      active: pathname === `/${parms.storeId}/billboards`,
    },
    {
      href: `${parms.storeId}/categories`,
      label: "Categories",
      active: pathname === `/${parms.storeId}/categories`,
    },

    {
      href: `${parms.storeId}/sizes`,
      label: "Sizes",
      active: pathname === `/${parms.storeId}/sizes`,
    },
    {
      href: `${parms.storeId}/colors`,
      label: "Colors",
      active: pathname === `/${parms.storeId}/colors`,
    },
    {
      href: `${parms.storeId}/products`,
      label: "Products",
      active: pathname === `/${parms.storeId}/products`,
    },
    {
      href: `${parms.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${parms.storeId}/settings`,
    },
  ];
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => {
        return (
          <Link
            key={route.href}
            href={`/${route.href}`}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              route.active
                ? "text-black  dark:text-white"
                : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        );
      })}
    </nav>
  );
}
export default MainNav;
