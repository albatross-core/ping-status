import { Link, useLocation } from "@tanstack/react-router";
import { AlertCircle, ChartSpline, HouseIcon, Logs } from "lucide-react";
import BurgerMenuIcon from "@/components/burger-menu-icon";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SECRET_PATH } from "@/lib/utils";

const navigationLinks = [
  { to: SECRET_PATH, label: "Status", icon: HouseIcon },
  { to: `${SECRET_PATH}/incidents`, label: "Incidents", icon: AlertCircle },
  { to: `${SECRET_PATH}/monitors`, label: "Monitors", icon: ChartSpline },
  { to: `${SECRET_PATH}/requests`, label: "Requests", icon: Logs },
];

export function Nav() {
  const location = useLocation({
    select: ({ pathname }) => `/${pathname.split("/").slice(1, 3).join("/")}`,
  });

  return (
    <div className="sticky top-0 right-0 left-0 z-50 bg-background/20 backdrop-blur-sm">
      <header className="mx-auto max-w-screen-lg px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex flex-1 items-center gap-2">
            {/* Mobile menu trigger */}
            {location.startsWith(SECRET_PATH) && (
              <MobileMenu location={location} />
            )}
            {/* Logo */}
            <div className="flex items-center gap-4">
              <svg
                className="size-8 dark:invert"
                fill="none"
                height="81"
                viewBox="0 0 98 81"
                width="98"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Albatross Logo</title>
                <path
                  d="M53.4012 8.8568C57.1074 3.8566 63.001 0.902344 69.2697 0.902344H97.9999L79.7941 25.3141C75.8864 30.5538 69.6964 33.646 63.1155 33.646H58.0252C50.4351 33.646 44.2773 39.7132 44.2346 47.2133H63.6729L44.5981 72.9478C40.8919 77.948 34.9983 80.9023 28.7296 80.9023H0L53.4012 8.8568Z"
                  fill="#030302"
                />
                <path
                  d="M63.9308 80.9023V47.2134H74.8028C87.6142 47.2134 98 57.5393 98 70.2771V80.9023H63.9308Z"
                  fill="#030302"
                />
              </svg>
              <h1 className="whitespace-nowrap font-semibold text-xl">
                Albatross Status
              </h1>
            </div>
          </div>
          {/* Middle area */}
          {location.startsWith(SECRET_PATH) && (
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavigationMenuItem key={link.label}>
                      <NavigationMenuLink
                        active={location === link.to}
                        asChild
                        className="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:text-primary"
                      >
                        <Link to={link.to}>
                          <Icon
                            aria-hidden="true"
                            className="text-muted-foreground/80"
                            size={16}
                          />
                          <span>{link.label}</span>
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {/* Right side */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </div>
  );
}

function MobileMenu({ location }: { location: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="group size-8 md:hidden" size="icon" variant="ghost">
          <BurgerMenuIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-36 p-1 md:hidden">
        <NavigationMenu className="max-w-none *:w-full">
          <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavigationMenuItem className="w-full" key={link.label}>
                  <NavigationMenuLink
                    active={location === link.to}
                    asChild
                    className="flex-row items-center gap-2 py-1.5"
                  >
                    <Link to={link.to}>
                      <Icon
                        aria-hidden="true"
                        className="text-muted-foreground/80"
                        size={16}
                      />
                      <span>{link.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </PopoverContent>
    </Popover>
  );
}

export default Nav;
