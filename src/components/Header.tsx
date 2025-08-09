import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Menu, Search, User, Bell, Briefcase, Users, ChevronDown, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserAuth } from "@/hooks/useUserAuth";

const navigation = [
  { name: "All Jobs", href: "/" },
  { name: "Latest Jobs", href: "/latest" },
  { name: "Freshers", href: "/freshers" },
  { name: "Experienced", href: "/experienced" },
];

const freelancingNavigation = [
  { name: "Find Freelancers", href: "/freelancers" },
  { name: "Browse Projects", href: "/projects" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated: isAdminAuthenticated, currentUser: adminUser, logout: adminLogout } = useAuth();
  const { 
    isAuthenticated: isUserAuthenticated, 
    userProfile, 
    logout: userLogout,
    userType 
  } = useUserAuth();

  const handleSignOut = async () => {
    try {
      if (isAdminAuthenticated) {
        await adminLogout();
      } else if (isUserAuthenticated) {
        await userLogout();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Autern
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Jobs Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <Briefcase className="h-4 w-4" />
                <span>Jobs</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {navigation.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link
                    to={item.href}
                    className={`w-full ${
                      location.pathname === item.href ? "text-primary font-medium" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Freelancing Navigation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Freelancing</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/freelancers">Find Freelancers</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/client">Post a Project</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/freelancer">Freelancer Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/client">Client Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          
          {isUserAuthenticated ? (
            <>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{userProfile?.displayName || userProfile?.email?.split('@')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userType === 'freelancer' && (
                    <DropdownMenuItem asChild>
                      <Link to="/freelancer">Freelancer Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  {userType === 'client' && (
                    <DropdownMenuItem asChild>
                      <Link to="/client">Client Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : isAdminAuthenticated ? (
            <>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>{adminUser?.email?.split('@')[0]}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/freelancer/login">Freelancer Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/client/login">Client Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin/login">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Login
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="glass" size="sm" asChild>
                <Link to="/freelancer/register">
                  Join Now
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4 mt-6">
              {/* Jobs Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Jobs</h3>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block text-sm font-medium transition-colors hover:text-primary pl-4 ${
                      location.pathname === item.href 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Freelancing Section */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Freelancing</h3>
                <Link
                  to="/freelancers"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium transition-colors hover:text-primary pl-4 text-muted-foreground"
                >
                  Find Freelancers
                </Link>
                <Link
                  to="/client"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium transition-colors hover:text-primary pl-4 text-muted-foreground"
                >
                  Post a Project
                </Link>
                <Link
                  to="/freelancer"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium transition-colors hover:text-primary pl-4 text-muted-foreground"
                >
                  Freelancer Dashboard
                </Link>
              </div>

              <div className="border-t pt-4 space-y-3">
                <Button variant="glass" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {isUserAuthenticated ? (
                  <>
                    <div className="text-sm text-muted-foreground px-4">
                      Signed in as {userProfile?.displayName || userProfile?.email}
                    </div>
                    <Button variant="hero" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : isAdminAuthenticated ? (
                  <>
                    <div className="text-sm text-muted-foreground px-4">
                      Admin: {adminUser?.email}
                    </div>
                    <Button variant="hero" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="hero" className="w-full" asChild>
                      <Link to="/freelancer/login" onClick={() => setIsOpen(false)}>
                        <User className="h-4 w-4 mr-2" />
                        Freelancer Login
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/client/login" onClick={() => setIsOpen(false)}>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Client Login
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Login
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};