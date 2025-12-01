import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

type AuthMode = 'signin' | 'signup' | 'forgot';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/restaurants');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setMode('signin');
      toast({
        title: 'Password reset link sent',
        description: 'Check your email to reset your password.',
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        navigate('/restaurants');
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: 'Account created!',
          description: 'You can now start ordering.',
        });
        navigate('/restaurants');
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) throw error;
        toast({
          title: 'Reset link sent',
          description: 'Check your email for the password reset link.',
        });
        setMode('signin');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background gradient-hero">
      <div className="container flex min-h-screen flex-col items-center justify-center py-8">
        <Link to="/" className="mb-8 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        
        <Card className="w-full max-w-md border-0 shadow-elevated">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-soft">
              <span className="text-2xl">🍽️</span>
            </div>
            <CardTitle className="text-2xl">
              {mode === 'signin' && 'Welcome back'}
              {mode === 'signup' && 'Create an account'}
              {mode === 'forgot' && 'Reset password'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' && 'Sign in to your OfficeBite account'}
              {mode === 'signup' && 'Start pre-ordering your lunch today'}
              {mode === 'forgot' && "We'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              
              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Please wait...' : (
                  <>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              {mode === 'signin' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </button>
                  <div className="mt-4">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}
              {mode === 'signup' && (
                <div>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-primary hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
