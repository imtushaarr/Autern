import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, AlertCircle, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Client-side validation
    if (!email.includes('@') || email.length < 5) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // Clear form for security
      setEmail("");
      setPassword("");
      setLoginAttempts(0);
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      setLoginAttempts(prev => prev + 1);
      
      // Clear password on failed attempt for security
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  // Security feature: disable form after too many attempts
  const isLocked = loginAttempts >= 5;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-md border-border/50 shadow-elegant relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div>
            <div className="flex items-center justify-center space-x-3 mb-2">
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Autern
              </span>
            </div>
            <CardTitle className="text-xl">Admin Portal</CardTitle>
            <CardDescription>
              Secure administrator access
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {isLocked && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Access temporarily restricted. Please try again later.
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && !isLocked && (
              <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading || isLocked}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors"
                  disabled={loading || isLocked}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:scale-105 transition-all duration-200 shadow-glow-primary"
              disabled={loading || isLocked}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          
          {loginAttempts > 0 && loginAttempts < 5 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {5 - loginAttempts} attempts remaining
              </p>
            </div>
          )}
          
          {/* Simplified setup info */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-sm mb-2 text-blue-800 dark:text-blue-200">
              📋 Setup Instructions:
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              1. Create a user account in Firebase Console<br/>
              2. Use any valid email and password<br/>
              3. Login with those credentials here
            </p>
            <p className="text-xs text-primary mt-2 font-medium">
              Any Firebase user can access the admin panel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Autern
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
