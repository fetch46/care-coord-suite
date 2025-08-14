"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TenantSignupForm } from "@/components/forms/TenantSignupForm";
import { useUserRole } from "@/hooks/useUserRole";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [checkingRole, setCheckingRole] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check user role and redirect accordingly
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (roleData?.role === 'administrator') {
          navigate("/super-admin");
        } else {
          navigate("/dashboard");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message.includes("Invalid login credentials")
            ? "Invalid email or password."
            : error.message,
          variant: "destructive",
        });
        return;
      }

      // Check user role and redirect accordingly
      setCheckingRole(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();
        
        toast({ title: "Success", description: "Logged in successfully." });
        
        if (roleData?.role === 'administrator') {
          navigate("/super-admin");
        } else {
          navigate("/dashboard");
        }
      }
      setCheckingRole(false);
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordMode) {
      setForgotPasswordMode(true);
      setForgotEmail(loginData.email);
      return;
    }

    if (!forgotEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('password-reset', {
        body: {
          action: 'forgot-password',
          email: forgotEmail
        }
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });
      setForgotPasswordMode(false);
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showSignupForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <TenantSignupForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">CareSync</h1>
          <p className="text-muted-foreground">Healthcare Management System</p>
        </div>

        <Card className="shadow-lg border-0 bg-background/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="w-full">Login</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                {forgotPasswordMode ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">Reset Password</h3>
                      <p className="text-sm text-muted-foreground">Enter your email to receive reset instructions</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setForgotPasswordMode(false)}
                        className="flex-1"
                        disabled={loading}
                      >
                        Back to Login
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="flex-1 bg-gradient-primary text-white hover:opacity-90"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send Reset Email"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={loginData.email}
                            onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                            className="pl-10 pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <Button 
                          type="button" 
                          variant="link" 
                          onClick={() => handleForgotPassword()}
                          className="text-primary text-sm"
                          disabled={loading}
                        >
                          Forgot password?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full bg-gradient-primary text-white hover:opacity-90" disabled={loading || checkingRole}>
                        {loading || checkingRole ? "Signing in..." : "Sign In"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mt-2">Don't have an account?</p>
                      <Button variant="link" onClick={() => setShowSignupForm(true)} className="text-primary font-semibold text-sm">
                        Get Started
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Healthcare Management System by CareSync
        </p>
      </div>
    </div>
  );
}
