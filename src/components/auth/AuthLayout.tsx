import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, Building } from 'lucide-react';

interface AuthLayoutProps {
  onBackToLanding?: () => void;
}

export const AuthLayout = ({ onBackToLanding }: AuthLayoutProps) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', fullName: '', businessName: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const { login, signup } = useAuthStore();

  const fillDemoCredentials = () => {
    setLoginData({ email: 'demo@yourapp.com', password: 'demo123' });
    setIsLogin(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const result = await login(loginData.email, loginData.password);
      if (!result.success) {
        setMessage({ type: 'error', text: result.error || 'Login failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 bg-secondary/15 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-warning/20 rounded-full blur-xl animate-pulse"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rotate-45 animate-spin"></div>
        <div className="absolute top-3/4 right-1/3 w-6 h-6 bg-secondary/40 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-warning/50 animate-pulse"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Logo and Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
          <div className="relative z-10 text-center max-w-md">
            <img 
              src="/lovable-uploads/ea58bab1-d210-4405-b1bc-714fe1e31509.png" 
              alt="Areion" 
              className="h-16 w-auto mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-dark mb-3">
              Welcome to Areion
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              Transform your business with our comprehensive management platform powered by AI intelligence.
            </p>
            <div className="space-y-2 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Advanced Analytics & Insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span className="text-sm text-muted-foreground">AI-Powered Business Intelligence</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-muted-foreground">Complete Financial Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Back Button */}
            {onBackToLanding && (
              <Button
                variant="ghost"
                onClick={onBackToLanding}
                className="mb-4 p-2 hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            )}
            
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-4">
              <img 
                src="/lovable-uploads/ea58bab1-d210-4405-b1bc-714fe1e31509.png" 
                alt="Areion" 
                className="h-10 w-auto mx-auto mb-3"
              />
            </div>

            <Card className="shadow-brand border-border/50 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-2 pb-3">
                <CardTitle className="text-xl font-bold text-dark text-center">
                  Get Started
                </CardTitle>
                <CardDescription className="text-muted-foreground text-center text-sm">
                  Access your business management platform
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {message && (
                  <Alert className={`${
                    message.type === 'error' ? 'border-destructive bg-destructive/10' :
                    message.type === 'success' ? 'border-success bg-success/10' :
                    'border-primary bg-primary/10'
                  }`}>
                    <AlertDescription className={`${
                      message.type === 'error' ? 'text-destructive' :
                      message.type === 'success' ? 'text-success' :
                      'text-primary'
                    }`}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <Tabs value={isLogin ? "login" : "signup"} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100/70 h-9">
                    <TabsTrigger 
                      value="login" 
                      onClick={() => setIsLogin(true)}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
                    >
                      Login
                    </TabsTrigger>
                    <TabsTrigger 
                      value="signup" 
                      onClick={() => setIsLogin(false)}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm"
                    >
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4 mt-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-sm font-medium text-dark">
                            Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              value={loginData.email}
                              onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-10 border-border/50 bg-white/70 focus:bg-white h-9"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="password" className="text-sm font-medium text-dark">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="password"
                              type="password"
                              placeholder="Enter your password"
                              value={loginData.password}
                              onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                              className="pl-10 border-border/50 bg-white/70 focus:bg-white h-9"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full shadow-brand hover:shadow-brand-hover h-9"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-4 mt-4">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor="fullName" className="text-sm font-medium text-dark">
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Enter your full name"
                              value={signupData.fullName}
                              onChange={(e) => setSignupData(prev => ({ ...prev, fullName: e.target.value }))}
                              className="pl-10 border-border/50 bg-white/70 focus:bg-white h-9"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="signupEmail" className="text-sm font-medium text-dark">
                            Email
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="signupEmail"
                              type="email"
                              placeholder="Enter your email"
                              value={signupData.email}
                              onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                              className="pl-10 border-border/50 bg-white/70 focus:bg-white h-9"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="signupPassword" className="text-sm font-medium text-dark">
                            Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="signupPassword"
                              type="password"
                              placeholder="Create a password"
                              value={signupData.password}
                              onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                              className="pl-10 border-border/50 bg-white/70 focus:bg-white h-9"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="businessName" className="text-sm font-medium text-dark">
                            Business Name (Optional)
                          </Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              id="businessName"
                              type="text"
                              placeholder="Enter your business name"
                              value={signupData.businessName}
                              onChange={(e) => setSignupData(prev => ({ ...prev, businessName: e.target.value }))}
                              className="pl-10 border-border/50 bg-white/70 focus:bg-white h-9"
                            />
                          </div>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full shadow-brand hover:shadow-brand-hover h-9"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Demo Account Section */}
                <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl border border-border/50">
                  <div className="text-center mb-3">
                    <h3 className="text-base font-semibold text-dark mb-1">Try Demo Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Experience the platform with pre-loaded demo data
                    </p>
                  </div>
                  <Button 
                    onClick={fillDemoCredentials}
                    variant="outline" 
                    className="w-full border-primary/30 hover:bg-primary/10 h-9"
                  >
                    Use Demo Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};