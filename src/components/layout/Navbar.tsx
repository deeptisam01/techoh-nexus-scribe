
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Search, 
  Menu, 
  Bell, 
  PenSquare, 
  LayoutDashboard, 
  Bookmark, 
  User, 
  Settings, 
  LogOut 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    Home
                  </Link>
                  <Link to="/explore" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    Explore
                  </Link>
                  <Link to="/tags" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    Tags
                  </Link>
                  <Link to="/bookmarks" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                    Bookmarks
                  </Link>
                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Login
                      </Link>
                      <Link to="/register" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Dashboard
                      </Link>
                      <Link to="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground">
                        Profile
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-2 px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground"
                        onClick={() => signOut()}
                      >
                        Logout
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          )}
          
          <Link to="/" className="flex items-center gap-2">
            <span className="hidden md:inline-block text-2xl font-bold text-primary">Tech-OH</span>
            <span className="inline-block md:hidden text-2xl font-bold text-primary">T-OH</span>
          </Link>
          
          {!isMobile && (
            <nav className="hidden md:flex items-center gap-4 mx-4">
              <Link to="/" className="text-foreground/60 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/explore" className="text-foreground/60 hover:text-foreground transition-colors">
                Explore
              </Link>
              <Link to="/tags" className="text-foreground/60 hover:text-foreground transition-colors">
                Tags
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isMobile && (
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] lg:w-[300px] pl-8 rounded-full bg-background"
              />
            </div>
          )}

          <ThemeToggle />
          
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative animate-slide-in">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <Link to="/dashboard/articles/new">
                <Button variant="default" size={isMobile ? "icon" : "default"} className="animate-slide-in">
                  {isMobile ? <PenSquare className="h-5 w-5" /> : (
                    <>
                      <PenSquare className="mr-2 h-4 w-4" />
                      Write
                    </>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || "User"} />
                      <AvatarFallback>{profile?.username?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookmarks" className="flex items-center cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Bookmarks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {isMobile ? (
                <Button variant="ghost" size="icon">
                  <Search className="h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Register</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
