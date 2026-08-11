"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type NavigationMenuContextValue = {
  activeMenu: string | null;
};

const NavigationMenuContext =
  React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenuContext(): NavigationMenuContextValue {
  const ctx = React.useContext(NavigationMenuContext);
  if (!ctx) {
    throw new Error(
      "NavigationMenu components must be used within NavigationMenu",
    );
  }
  return ctx;
}

type NavigationMenuItemContextValue = {
  menuId: string;
};

const NavigationMenuItemContext =
  React.createContext<NavigationMenuItemContextValue | null>(null);

function useNavigationMenuItemContext(): NavigationMenuItemContextValue {
  const ctx = React.useContext(NavigationMenuItemContext);
  if (!ctx) {
    throw new Error(
      "NavigationMenuTrigger and NavigationMenuContent must be used within NavigationMenuItem",
    );
  }
  return ctx;
}

type NavigationMenuProps = React.ComponentPropsWithoutRef<"nav"> & {
  activeMenu?: string | null;
};

export const NavigationMenu = React.forwardRef<
  React.ElementRef<"nav">,
  NavigationMenuProps
>(({ className, children, activeMenu = null, ...props }, ref) => {
  return (
    <NavigationMenuContext.Provider value={{ activeMenu }}>
      <nav ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
});

NavigationMenu.displayName = "NavigationMenu";

export function NavigationMenuList({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"ul">): React.ReactElement {
  return (
    <ul
      className={cn("flex w-full flex-wrap items-center gap-3", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function NavigationMenuItem({
  menuId,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { menuId: string }): React.ReactElement {
  return (
    <NavigationMenuItemContext.Provider value={{ menuId }}>
      <li className={cn("relative", className)} {...props}>
        {children}
      </li>
    </NavigationMenuItemContext.Provider>
  );
}

export function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button">): React.ReactElement {
  const { activeMenu } = useNavigationMenuContext();
  const { menuId } = useNavigationMenuItemContext();
  const isOpen = activeMenu === menuId;

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      className={cn(
        "select-none rounded-md border border-[#252b3b] bg-[#13161f] px-3 py-2 text-[9px] font-bold uppercase text-[#4a5070] transition-all duration-75",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="ms-2 text-[#6e7590]">▼</span>
    </button>
  );
}

export function NavigationMenuContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"div">): React.ReactElement | null {
  const { activeMenu } = useNavigationMenuContext();
  const { menuId } = useNavigationMenuItemContext();

  if (activeMenu !== menuId) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute mt-2 min-w-[220px] rounded-md border border-[#252b3b] bg-[#0b0d12] p-2 shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

