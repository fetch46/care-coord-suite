import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, Mail, User, Phone, Users } from "lucide-react";

// Validation schema
const tenantSignupSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters"),
  admin_email: z.string().email("Please enter a valid email address"),
  admin_first_name: z.string().min(2, "First name must be at least 2 characters"),
  admin_last_name: z.string().min(2, "Last name must be at least 2 characters"),
  admin_phone: z.string().optional(),
  company_size: z.string().min(1, "Please select company size"),
  industry: z.string().min(1, "Please select industry")
});

type TenantSignupFormData = z.infer<typeof tenantSignupSchema>;

interface TenantSignupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TenantSignupForm({ onSuccess, onCancel }: TenantSignupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TenantSignupFormData>({
    resolver: zodResolver(tenantSignupSchema),
    defaultValues: {
      company_name: "",
      admin_email: "",
      admin_first_name: "",
      admin_last_name: "",
      admin_phone: "",
      company_size: "",
      industry: ""
    }
  });

  const onSubmit = async (data: TenantSignupFormData) => {
    setIsSubmitting(true);

    try {
      const insertData = {
        company_name: data.company_name,
        admin_email: data.admin_email,
        admin_first_name: data.admin_first_name,
        admin_last_name: data.admin_last_name,
        admin_phone: data.admin_phone || null,
        company_size: data.company_size,
        industry: data.industry
      };

      const { error } = await supabase
        .from("tenant_signups")
        .insert(insertData);

      if (error) throw error;

      toast({
        title: "Registration Successful!",
        description: "Thank you for your interest. We'll contact you soon to set up your account."
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting tenant signup:", error);
      toast({
        title: "Registration Failed",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-100 p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">
              Get Started with Your Healthcare Platform
            </CardTitle>
          </div>
          <CardDescription>
            Join hundreds of healthcare organizations already using our platform to streamline
            operations and improve patient care.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="company_name">Company Name *</Label>
                  <Input
                    id="company_name"
                    {...form.register("company_name")}
                    placeholder="Healthcare Organization Name"
                  />
                  {form.formState.errors.company_name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.company_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="company_size">Company Size *</Label>
                  <Select onValueChange={(value) => form.setValue("company_size", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="500+">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.company_size && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.company_size.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select onValueChange={(value) => form.setValue("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="long-term-care">Long-term Care</SelectItem>
                      <SelectItem value="assisted-living">Assisted Living</SelectItem>
                      <SelectItem value="home-health">Home Health</SelectItem>
                      <SelectItem value="other">Other Healthcare</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.industry && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.industry.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Admin Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Administrator Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin_first_name">First Name *</Label>
                  <Input
                    id="admin_first_name"
                    {...form.register("admin_first_name")}
                    placeholder="John"
                  />
                  {form.formState.errors.admin_first_name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.admin_first_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="admin_last_name">Last Name *</Label>
                  <Input
                    id="admin_last_name"
                    {...form.register("admin_last_name")}
                    placeholder="Doe"
                  />
                  {form.formState.errors.admin_last_name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.admin_last_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="admin_email">Email Address *</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    {...form.register("admin_email")}
                    placeholder="john.doe@healthcare.com"
                  />
                  {form.formState.errors.admin_email && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.admin_email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="admin_phone">Phone Number</Label>
                  <Input
                    id="admin_phone"
                    {...form.register("admin_phone")}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Registration
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
