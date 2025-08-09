import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useUserAuth } from '@/hooks/useUserAuth';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const { resetPassword } = useUserAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox for instructions.');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Autern
            </Link>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive password reset instructions
            </p>
          </div>
        </div>

        {/* Reset Form */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Forgot your password?</CardTitle>
            <CardDescription>
              No worries! We'll send you reset instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Email'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                {message && (
                  <Alert>
                    <Mail className="h-4 w-4" />
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSent(false);
                      setMessage('');
                      setError('');
                    }}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Link
                to="/freelancer/login"
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Need help?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
