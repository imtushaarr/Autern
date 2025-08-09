import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Users,
  LogOut,
  Home,
  Menu,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
    { name: "Applications", href: "/admin/applications", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
                <span className="text-primary-foreground font-bold text-xl">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Autern
                </span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
            </Button>
            
            <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-gradient-accent flex items-center justify-center">
                <span className="text-accent-foreground font-medium text-sm">
                  {currentUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {currentUser?.email?.split('@')[0]}
              </span>
            </div>
            
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Site
              </Link>
            </Button>
            
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 md:w-16'} transition-all duration-300 bg-card/30 backdrop-blur-sm border-r border-border/50 min-h-[calc(100vh-73px)] relative`}>
          <div className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity duration-200`}>
            <nav className="p-4 space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <IconComponent className={`h-5 w-5 ${active ? 'text-primary-foreground' : 'group-hover:text-primary'} transition-colors`} />
                    <span className={`${sidebarOpen ? 'block' : 'hidden md:hidden'} transition-all`}>
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                <h4 className="font-semibold text-sm mb-2">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Check our documentation for guidance
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  Get Support
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default AdminLayout;
