import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  ArrowRight,
  Bot,
  Calendar,
  MessageSquare,
  FileText,
  ShoppingCart,
  Settings
} from 'lucide-react';

interface LandingPageProps {
  onShowAuth: () => void;
}

export const LandingPage = ({ onShowAuth }: LandingPageProps) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and comprehensive reporting for data-driven decisions"
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Intelligent business insights powered by advanced AI technology"
    },
    {
      icon: DollarSign,
      title: "Financial Management",
      description: "Complete accounting, invoicing, and financial tracking solutions"
    },
    {
      icon: Users,
      title: "CRM & Sales",
      description: "Manage customer relationships and streamline your sales pipeline"
    },
    {
      icon: ShoppingCart,
      title: "Inventory & POS",
      description: "Comprehensive inventory management with integrated point-of-sale"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with role-based access control"
    }
  ];

  const benefits = [
    "Streamline all business operations in one platform",
    "Reduce operational costs by up to 40%",
    "AI-powered insights for smarter decisions",
    "99.9% uptime with enterprise-grade reliability",
    "Seamless integration with existing tools",
    "24/7 expert support and onboarding"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ea58bab1-d210-4405-b1bc-714fe1e31509.png" 
              alt="Areion" 
              className="h-10 w-auto"
            />
          </div>
          <Button 
            onClick={onShowAuth}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            Login or Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-60"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            ✨ All-in-One Business Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-dark mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Business</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Streamline operations, boost productivity, and accelerate growth with our comprehensive 
            business management platform powered by AI intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              onClick={onShowAuth}
              size="lg"
              className="text-lg px-8 py-4 shadow-brand hover:shadow-brand-hover"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/10"
            >
              View Demo
            </Button>
          </div>

          {/* Feature Cards Preview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {[
              { icon: BarChart3, label: "Analytics" },
              { icon: Bot, label: "AI Assistant" },
              { icon: DollarSign, label: "Finance" },
              { icon: Users, label: "CRM" },
              { icon: Calendar, label: "Calendar" },
              { icon: Settings, label: "Settings" }
            ].map((item, index) => (
              <Card key={index} className="group hover:shadow-soft transition-all duration-300 border-border/50">
                <CardContent className="p-4 text-center">
                  <item.icon className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium text-dark">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">
              Everything Your Business Needs
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and intelligent insights to help you grow faster and work smarter
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 border-border/50 ${
                    activeFeature === index 
                      ? 'border-primary/30 bg-primary/5 shadow-soft' 
                      : 'hover:border-primary/20 hover:shadow-soft'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        activeFeature === index 
                          ? 'bg-primary text-white' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-dark mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 border border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-soft">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        {features[activeFeature] && React.createElement(features[activeFeature].icon, { className: "h-5 w-5 text-white" })}
                      </div>
                      <div>
                        <h4 className="font-semibold text-dark">{features[activeFeature]?.title}</h4>
                        <p className="text-sm text-muted-foreground">Active Feature</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">Live</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-soft">
                      <div className="text-2xl font-bold text-primary mb-1">98.5%</div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-soft">
                      <div className="text-2xl font-bold text-secondary mb-1">24/7</div>
                      <div className="text-sm text-muted-foreground">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark mb-6">
                Why Choose Areion?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of businesses that have transformed their operations with our platform.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-dark">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={onShowAuth}
                size="lg"
                className="shadow-brand hover:shadow-brand-hover"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-border/50 hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-2xl font-bold text-dark mb-2">150+</div>
                    <p className="text-muted-foreground">Countries</p>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50 hover:shadow-soft transition-all duration-300 mt-8">
                  <CardContent className="p-6 text-center">
                    <Zap className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <div className="text-2xl font-bold text-dark mb-2">99.9%</div>
                    <p className="text-muted-foreground">Uptime</p>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50 hover:shadow-soft transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Users className="h-12 w-12 text-warning mx-auto mb-4" />
                    <div className="text-2xl font-bold text-dark mb-2">50K+</div>
                    <p className="text-muted-foreground">Businesses</p>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50 hover:shadow-soft transition-all duration-300 -mt-8">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-success mx-auto mb-4" />
                    <div className="text-2xl font-bold text-dark mb-2">SOC 2</div>
                    <p className="text-muted-foreground">Certified</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of successful businesses already using Areion to streamline operations and drive growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onShowAuth}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
            >
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-white/70 text-sm mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-dark">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img 
              src="/lovable-uploads/ea58bab1-d210-4405-b1bc-714fe1e31509.png" 
              alt="Areion" 
              className="h-8 w-auto"
            />
          </div>
          <p className="text-muted-foreground">
            © 2024 Areion. All rights reserved. Built with ❤️ for business success.
          </p>
        </div>
      </footer>
    </div>
  );
};