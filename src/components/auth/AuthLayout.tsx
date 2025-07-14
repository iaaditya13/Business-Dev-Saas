import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Building2, Sparkles, Shield, Zap } from 'lucide-react';

export const AuthLayout = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '', businessName: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const { login, signup } = useAuthStore();

  // Pre-fill demo credentials
  const fillDemoCredentials = () => {
    setLoginData({ email: 'demo@yourapp.com', password: 'demo123' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    // Show info message for demo account
    if (loginData.email === 'demo@yourapp.com') {
      setMessage({ type: 'info', text: 'Setting up demo account with sample data...' });
    }
    
    try {
      const result = await login(loginData.email, loginData.password);
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Login failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await signup(
        signupData.email, 
        signupData.password, 
        signupData.fullName,
        signupData.businessName
      );
      
      if (result.success) {
        if (result.error) {
          setMessage({ type: 'success', text: result.error });
        } else {
          setMessage({ type: 'success', text: 'Account created successfully!' });
        }
      } else {
        setMessage({ type: 'error', text: result.error || 'Signup failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Elements - Reduced sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating shapes - smaller */}
        <div className="absolute top-10 left-8 w-12 h-12 bg-primary/10 rounded-full animate-float opacity-60" />
        <div className="absolute top-20 right-16 w-6 h-6 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-accent/15 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/4 right-1/3 w-4 h-4 bg-primary/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        
        {/* Geometric shapes - smaller */}
        <div className="absolute top-12 right-12 w-16 h-16 border border-primary/20 rotate-45 animate-pulse opacity-40" />
        <div className="absolute bottom-16 right-8 w-10 h-10 border border-secondary/20 rounded-lg rotate-12 animate-pulse opacity-30" style={{ animationDelay: '1.5s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(192,74,226,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,74,226,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-50" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-md">
          {/* Logo Section - Reduced margins */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <img 
                src="/lovable-uploads/ea58bab1-d210-4405-b1bc-714fe1e31509.png" 
                alt="Areion" 
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-2">
              <Shield className="w-3 h-3" />
              Complete Business Management Platform
              <Sparkles className="w-3 h-3" />
            </p>
          </div>

          <Card className="card-elevated-lg backdrop-blur-sm bg-card/80 border-border/50 shadow-brand">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-gradient">Welcome Back</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Access your business dashboard</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {message && (
                <Alert className={`border-l-4 ${
                  message.type === 'error' ? 'border-destructive bg-destructive/5' : 
                  message.type === 'success' ? 'border-success bg-success/5' : 
                  'border-primary bg-primary/5'
                }`}>
                  <AlertDescription className={`text-xs ${
                    message.type === 'error' ? 'text-destructive' : 
                    message.type === 'success' ? 'text-success' : 
                    'text-primary'
                  }`}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login" className="text-xs sm:text-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="text-xs sm:text-sm">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  {/* Demo Account Section - More compact */}
                  <div className="p-3 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-3 h-3 text-primary" />
                      <p className="text-xs font-medium text-primary">Quick Demo Access</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fillDemoCredentials}
                      className="w-full mb-1 hover:bg-primary/10 h-8 text-xs"
                    >
                      Use Demo Credentials
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Email: demo@yourapp.com | Password: demo123
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs font-medium">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          className="pl-9 input-focus h-9 text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          className="pl-9 input-focus h-9 text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full btn-brand h-9" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          <span className="text-sm">
                            {loginData.email === 'demo@yourapp.com' ? 'Setting up demo...' : 'Signing in...'}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm">Sign In</span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="signup-name" className="text-xs font-medium">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                          className="pl-9 input-focus h-9 text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="signup-business" className="text-xs font-medium">Business Name <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          id="signup-business"
                          type="text"
                          placeholder="Enter your business name"
                          value={signupData.businessName}
                          onChange={(e) => setSignupData({ ...signupData, businessName: e.target.value })}
                          className="pl-9 input-focus h-9 text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="signup-email" className="text-xs font-medium">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signupData.email}
                          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                          className="pl-9 input-focus h-9 text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="signup-password" className="text-xs font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password (min. 6 characters)"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          className="pl-9 input-focus h-9 text-sm"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                    
                    <Button type="submit" className="w-full btn-brand h-9" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          <span className="text-sm">Creating account...</span>
                        </>
                      ) : (
                        <span className="text-sm">Create Account</span>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
