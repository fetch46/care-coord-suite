import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/sections/PricingSection";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elevated">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CareSync</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Pricing Content */}
      <PricingSection />

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Can I change plans at any time?</h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any charges accordingly.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Is there a setup fee?</h3>
              <p className="text-muted-foreground">
                No, there are no setup fees for any of our plans. We also provide free data migration 
                assistance to help you get started quickly.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">How does the 14-day free trial work?</h3>
              <p className="text-muted-foreground">
                Your free trial gives you full access to all features of your selected plan for 14 days. 
                No credit card required. You can cancel anytime during the trial with no charges.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Is my data secure and HIPAA compliant?</h3>
              <p className="text-muted-foreground">
                Absolutely. We are fully HIPAA compliant with enterprise-grade security, encryption, 
                and 24/7 monitoring. All data is backed up and stored securely.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">What kind of support do you provide?</h3>
              <p className="text-muted-foreground">
                Support varies by plan: Basic includes email support, Professional adds priority phone support, 
                and Enterprise includes 24/7 dedicated support with a dedicated account manager.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your access will continue until the 
                end of your current billing period, and you can export your data anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-muted/30">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-elevated">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-foreground text-xl">CareSync</span>
          </div>
          <p className="text-muted-foreground">
            Healthcare Management System - Empowering Care Teams Since 2024
          </p>
        </div>
      </footer>
    </div>
  );
}