import { useState } from "react";
import { Check, Star, Building2, Users, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TenantSignupForm } from "@/components/forms/TenantSignupForm";

interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  icon: React.ComponentType<{ className?: string }>;
  maxUsers: string;
  maxPatients: string;
  support: string;
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Perfect for small clinics",
    monthlyPrice: 99,
    yearlyPrice: 990,
    icon: Heart,
    maxUsers: "Up to 5 users",
    maxPatients: "Up to 100 patients",
    support: "Email support",
    features: [
      "Patient management",
      "Basic scheduling",
      "Medical records",
      "Staff management",
      "Basic reporting",
      "Mobile access",
      "Data backup",
      "HIPAA compliance"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Most popular for growing practices",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    popular: true,
    icon: Building2,
    maxUsers: "Up to 25 users",
    maxPatients: "Up to 500 patients",
    support: "Priority email & phone",
    features: [
      "Everything in Basic",
      "Advanced scheduling",
      "Assessment tools",
      "Timesheet management",
      "Advanced reporting",
      "API access",
      "Custom workflows",
      "Staff training",
      "Priority support"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large healthcare organizations",
    monthlyPrice: 399,
    yearlyPrice: 3990,
    icon: Users,
    maxUsers: "Unlimited users",
    maxPatients: "Unlimited patients",
    support: "24/7 dedicated support",
    features: [
      "Everything in Professional",
      "Multi-location support",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
      "Custom training",
      "SLA guarantee",
      "White-label options",
      "Advanced security",
      "Custom development"
    ]
  }
];

interface PricingSectionProps {
  onPlanSelect?: (planId: string) => void;
}

export function PricingSection({ onPlanSelect }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setIsSignupOpen(true);
    onPlanSelect?.(planId);
  };

  const getPrice = (plan: PricingPlan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    if (!isYearly) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    return monthlyTotal - plan.yearlyPrice;
  };

  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
            <Zap className="w-4 h-4 mr-2" />
            Transparent Pricing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Healthcare Management Plan
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Select the perfect plan for your healthcare organization. All plans include our core features with no hidden fees.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`text-sm font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 border-green-200">
              Save up to 17%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const price = getPrice(plan);
            const savings = getSavings(plan);
            
            return (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-primary shadow-elevated bg-gradient-to-b from-primary/5 to-background'
                    : 'border-border bg-background/50 backdrop-blur hover:border-primary/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-primary text-white shadow-elevated px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4 shadow-elevated ${
                    plan.popular
                      ? 'bg-gradient-primary'
                      : 'bg-gradient-to-br from-muted to-muted/50'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-primary'}`} />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-muted-foreground">{plan.tagline}</p>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        ${price.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && savings > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-2">
                        Save ${savings} per year
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Plan Limits */}
                  <div className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="font-medium">{plan.maxUsers}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Patients:</span>
                      <span className="font-medium">{plan.maxPatients}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Support:</span>
                      <span className="font-medium">{plan.support}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-healthcare-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePlanSelect(plan.id)}
                    className={`w-full py-6 text-base font-semibold ${
                      plan.popular
                        ? 'bg-gradient-primary text-white hover:opacity-90 shadow-elevated'
                        : 'bg-background border-2 border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    Start with {plan.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16 space-y-4">
          <p className="text-muted-foreground">
            All plans include 14-day free trial • No setup fees • Cancel anytime
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-healthcare-success" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-healthcare-success" />
              <span>99.9% Uptime SLA</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-healthcare-success" />
              <span>Data Migration Included</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-healthcare-success" />
              <span>24/7 Security Monitoring</span>
            </div>
          </div>
        </div>

        {/* Signup Dialog */}
        <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Complete Your Registration - {plans.find(p => p.id === selectedPlan)?.name} Plan
              </DialogTitle>
            </DialogHeader>
            <TenantSignupForm
              selectedPlan={selectedPlan}
              onSuccess={() => setIsSignupOpen(false)}
              onCancel={() => setIsSignupOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}