
import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  PenSquare, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  const { pathname } = useLocation();

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
              pathname === item.href
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
    {
      title: "My Articles",
      href: "/dashboard/articles",
      icon: FileText,
    },
    {
      title: "New Article",
      href: "/dashboard/articles/new",
      icon: PenSquare,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        {/* Mobile sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed left-4 top-4 z-40"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[240px] pr-0">
            <div className="px-2 py-6 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                  <span className="text-xl font-bold text-primary">Tech-OH</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="mb-4">
                  {profile && (
                    <div className="flex items-center gap-2 px-2 py-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
                        <AvatarFallback>
                          {profile.username?.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{profile.full_name || profile.username}</p>
                        <p className="text-xs text-muted-foreground">@{profile.username}</p>
                      </div>
                    </div>
                  )}
                </div>
                <SidebarNav items={sidebarItems} />
              </ScrollArea>
              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop sidebar */}
        <aside className="fixed top-0 left-0 z-30 hidden h-screen w-[240px] border-r bg-background px-4 py-8 md:block">
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <Link to="/" className="flex items-center gap-2 font-semibold">
                <span className="text-xl font-bold text-primary">Tech-OH</span>
              </Link>
            </div>
            <ScrollArea className="flex-1">
              <div className="mb-4">
                {profile && (
                  <div className="flex items-center gap-2 px-2 py-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || ""} alt={profile.username} />
                      <AvatarFallback>
                        {profile.username?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{profile.full_name || profile.username}</p>
                      <p className="text-xs text-muted-foreground">@{profile.username}</p>
                    </div>
                  </div>
                )}
              </div>
              <SidebarNav items={sidebarItems} />
            </ScrollArea>
            <div className="mt-auto pt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex w-full flex-col overflow-hidden md:pl-[240px]">
          <div className="container py-8 md:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
