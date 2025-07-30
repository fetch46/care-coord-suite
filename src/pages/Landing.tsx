import { Link } from "react-router-dom";
import { ArrowRight, Shield, Users, Calendar, FileText, Activity, Heart, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Landing() {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CareSync</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
            <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
              <Link to="/auth">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6">
            Healthcare Management System
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Streamline Healthcare
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Management & Care
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Comprehensive healthcare management platform designed for care teams to deliver 
            exceptional patient care while reducing administrative burden.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90" asChild>
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Complete Care
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our integrated platform provides all the tools your healthcare team needs 
              to deliver exceptional patient care efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transform Your Healthcare Operations
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join hundreds of healthcare facilities that have improved their operations 
                and patient outcomes with CareSync's comprehensive management platform.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Active Patients</h4>
                      <p className="text-sm text-muted-foreground">247 patients under care</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Scheduled Today</h4>
                      <p className="text-sm text-muted-foreground">12 appointments scheduled</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Care Quality</h4>
                      <p className="text-sm text-muted-foreground">98% patient satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Healthcare Operations?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the CareSync platform and experience the difference comprehensive 
            healthcare management can make for your organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90" asChild>
              <Link to="/auth">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">CareSync</span>
          </div>
          <p className="text-muted-foreground">
            Healthcare Management System - Empowering Care Teams Since 2024
          </p>
        </div>
      </footer>
    </div>
  );
}