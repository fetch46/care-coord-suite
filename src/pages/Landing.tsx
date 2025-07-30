import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Calendar, FileText, Activity, Heart, Clock, CheckCircle, Building2, Star, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TenantSignupForm } from "@/components/forms/TenantSignupForm";
import { useCMSContent } from "@/hooks/useCMSContent";

export default function Landing() {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const { getContent, loading: cmsLoading } = useCMSContent();

  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description: "Comprehensive patient records, registration, and care tracking in one secure platform."
    },
    {
      icon: Calendar,
      title: "Schedule Management",
      description: "Efficient staff scheduling and appointment management to optimize care delivery."
    },
    {
      icon: FileText,
      title: "Medical Records",
      description: "Digital medical records with secure access and complete patient history tracking."
    },
    {
      icon: Activity,
      title: "Assessment Tools",
      description: "Built-in assessment forms and evaluation tools for comprehensive patient care."
    },
    {
      icon: Clock,
      title: "Timesheet Management",
      description: "Digital timesheets and reporting for accurate staff time tracking and payroll."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "HIPAA-compliant security with role-based access control and data protection."
    }
  ];

  const benefits = [
    "Streamlined patient care workflows",
    "Reduced administrative overhead",
    "Improved care coordination",
    "Real-time reporting and analytics",
    "Mobile-friendly interface",
    "24/7 secure access"
  ];

  if (cmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elevated">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {getContent('company_name', 'CareSync')}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Sign In</Link>
            </Button>
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-white hover:opacity-90 shadow-elevated">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Start Your Healthcare Platform Journey</DialogTitle>
                </DialogHeader>
                <TenantSignupForm 
                  onSuccess={() => setIsSignupOpen(false)}
                  onCancel={() => setIsSignupOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-teal opacity-10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center max-w-5xl relative">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
            <Sparkles className="w-4 h-4 mr-2" />
            {getContent('hero_badge', 'Healthcare Management System')}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            {getContent('hero_title', 'Streamline Healthcare Management & Care').split('&').map((part: string, index: number) => (
              <span key={index}>
                {index === 0 ? part : (
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    & {part}
                  </span>
                )}
              </span>
            ))}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {getContent('hero_subtitle', 'Comprehensive healthcare management platform designed for care teams to deliver exceptional patient care while reducing administrative burden.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90 shadow-elevated px-8 py-6 text-lg">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Start Your Healthcare Platform Journey</DialogTitle>
                </DialogHeader>
                <TenantSignupForm 
                  onSuccess={() => setIsSignupOpen(false)}
                  onCancel={() => setIsSignupOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
              <Link to="/auth">
                Existing User? Sign In
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>500+ Healthcare Organizations</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {getContent('features_title', 'Everything You Need for Complete Care')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {getContent('features_subtitle', 'Our integrated platform provides all the tools your healthcare team needs to deliver exceptional patient care efficiently.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 shadow-elevated">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {getContent('benefits_title', 'Transform Your Healthcare Operations')}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {getContent('benefits_subtitle', 'Join hundreds of healthcare facilities that have improved their operations and patient outcomes with our comprehensive management platform.')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <CheckCircle className="w-5 h-5 text-healthcare-success flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-foreground leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90 shadow-elevated">
                      Get Started Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Start Your Healthcare Platform Journey</DialogTitle>
                    </DialogHeader>
                    <TenantSignupForm 
                      onSuccess={() => setIsSignupOpen(false)}
                      onCancel={() => setIsSignupOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
                <Button size="lg" variant="outline">
                  Schedule Demo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 backdrop-blur border border-primary/10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-6 bg-background/80 rounded-xl shadow-card backdrop-blur border border-primary/5">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-elevated">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Active Patients</h4>
                      <p className="text-muted-foreground">247 patients under care</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-6 bg-background/80 rounded-xl shadow-card backdrop-blur border border-primary/5">
                    <div className="w-12 h-12 bg-gradient-teal rounded-xl flex items-center justify-center shadow-elevated">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Scheduled Today</h4>
                      <p className="text-muted-foreground">12 appointments scheduled</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-6 bg-background/80 rounded-xl shadow-card backdrop-blur border border-primary/5">
                    <div className="w-12 h-12 bg-gradient-coral rounded-xl flex items-center justify-center shadow-elevated">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Care Quality</h4>
                      <p className="text-muted-foreground">98% patient satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10"></div>
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-gradient-teal opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto text-center relative">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            {getContent('cta_title', 'Ready to Transform Your Healthcare Operations?')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            {getContent('cta_subtitle', 'Join our platform and experience the difference comprehensive healthcare management can make for your organization.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90 shadow-elevated px-8 py-6 text-lg">
                  Get Started Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Start Your Healthcare Platform Journey</DialogTitle>
                </DialogHeader>
                <TenantSignupForm 
                  onSuccess={() => setIsSignupOpen(false)}
                  onCancel={() => setIsSignupOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elevated">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground text-xl">
              {getContent('company_name', 'CareSync')}
            </span>
          </div>
          <p className="text-muted-foreground text-lg mb-6">
            {getContent('footer_text', 'Healthcare Management System - Empowering Care Teams Since 2024')}
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              HIPAA Compliant
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              Made with care
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}