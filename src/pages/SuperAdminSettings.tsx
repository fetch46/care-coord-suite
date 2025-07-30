import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Save,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  Mail,
  MessageSquare,
  Settings as SettingsIcon
} from "lucide-react";

interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  is_active: boolean;
  configuration: any;
}

interface CommunicationGateway {
  id: string;
  name: string;
  type: 'email' | 'sms';
  provider: string;
  is_active: boolean;
  configuration: any;
}

export default function SuperAdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([]);
  const [communicationGateways, setCommunicationGateways] = useState<CommunicationGateway[]>([]);

  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      const [paymentRes, communicationRes] = await Promise.all([
        supabase.from("payment_gateways").select("*").order("name"),
        supabase.from("communication_gateways").select("*").order("name")
      ]);

      if (paymentRes.data) setPaymentGateways(paymentRes.data);
      if (communicationRes.data) setCommunicationGateways(communicationRes.data as CommunicationGateway[]);
    } catch (error) {
      console.error("Error fetching gateways:", error);
      toast({
        title: "Error",
        description: "Failed to load gateway settings",
        variant: "destructive"
      });
    }
  };

  const updatePaymentGateway = async (id: string, updates: Partial<PaymentGateway>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("payment_gateways")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setPaymentGateways(prev => 
        prev.map(gateway => 
          gateway.id === id ? { ...gateway, ...updates } : gateway
        )
      );

      toast({
        title: "Success",
        description: "Payment gateway updated successfully"
      });
    } catch (error) {
      console.error("Error updating payment gateway:", error);
      toast({
        title: "Error",
        description: "Failed to update payment gateway",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCommunicationGateway = async (id: string, updates: Partial<CommunicationGateway>) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("communication_gateways")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      setCommunicationGateways(prev => 
        prev.map(gateway => 
          gateway.id === id ? { ...gateway, ...updates } : gateway
        )
      );

      toast({
        title: "Success",
        description: "Communication gateway updated successfully"
      });
    } catch (error) {
      console.error("Error updating communication gateway:", error);
      toast({
        title: "Error",
        description: "Failed to update communication gateway",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Manage system-wide settings, payment gateways, and communication providers
          </p>
        </div>

      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="payment">
            <CreditCard className="w-4 h-4 mr-2" />
            Payment Gateways
          </TabsTrigger>
          <TabsTrigger value="communication">
            <Mail className="w-4 h-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="system">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* Payment Gateways */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Management</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure payment processors for tenant subscriptions
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{gateway.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Provider: {gateway.provider}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={gateway.is_active ? "default" : "secondary"}>
                          {gateway.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Switch
                          checked={gateway.is_active}
                          onCheckedChange={(checked) => 
                            updatePaymentGateway(gateway.id, { is_active: checked })
                          }
                        />
                      </div>
                    </div>

                    {gateway.provider === 'stripe' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Publishable Key</Label>
                          <Input
                            value={gateway.configuration?.publishable_key || ""}
                            onChange={(e) => {
                              const newConfig = {
                                ...gateway.configuration,
                                publishable_key: e.target.value
                              };
                              updatePaymentGateway(gateway.id, { configuration: newConfig });
                            }}
                            placeholder="pk_..."
                          />
                        </div>
                        <div>
                          <Label>Secret Key</Label>
                          <Input
                            type="password"
                            value={gateway.configuration?.secret_key || ""}
                            onChange={(e) => {
                              const newConfig = {
                                ...gateway.configuration,
                                secret_key: e.target.value
                              };
                              updatePaymentGateway(gateway.id, { configuration: newConfig });
                            }}
                            placeholder="sk_..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Webhook Secret</Label>
                          <Input
                            type="password"
                            value={gateway.configuration?.webhook_secret || ""}
                            onChange={(e) => {
                              const newConfig = {
                                ...gateway.configuration,
                                webhook_secret: e.target.value
                              };
                              updatePaymentGateway(gateway.id, { configuration: newConfig });
                            }}
                            placeholder="whsec_..."
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Gateways */}
        <TabsContent value="communication" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Email Providers */}
            <Card>
              <CardHeader>
                <CardTitle>Email Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communicationGateways
                  .filter(gateway => gateway.type === 'email')
                  .map((gateway) => (
                    <div key={gateway.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{gateway.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {gateway.provider}
                          </p>
                        </div>
                        <Switch
                          checked={gateway.is_active}
                          onCheckedChange={(checked) => 
                            updateCommunicationGateway(gateway.id, { is_active: checked })
                          }
                        />
                      </div>

                      {gateway.provider === 'sendgrid' && (
                        <div className="space-y-3">
                          <div>
                            <Label>API Key</Label>
                            <Input
                              type="password"
                              value={gateway.configuration?.api_key || ""}
                              placeholder="SG...."
                            />
                          </div>
                          <div>
                            <Label>From Email</Label>
                            <Input
                              value={gateway.configuration?.from_email || ""}
                              placeholder="noreply@yourapp.com"
                            />
                          </div>
                          <div>
                            <Label>From Name</Label>
                            <Input
                              value={gateway.configuration?.from_name || ""}
                              placeholder="Your App Name"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </CardContent>
            </Card>

            {/* SMS Providers */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Providers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {communicationGateways
                  .filter(gateway => gateway.type === 'sms')
                  .map((gateway) => (
                    <div key={gateway.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{gateway.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {gateway.provider}
                          </p>
                        </div>
                        <Switch
                          checked={gateway.is_active}
                          onCheckedChange={(checked) => 
                            updateCommunicationGateway(gateway.id, { is_active: checked })
                          }
                        />
                      </div>

                      {gateway.provider === 'twilio' && (
                        <div className="space-y-3">
                          <div>
                            <Label>Account SID</Label>
                            <Input
                              value={gateway.configuration?.account_sid || ""}
                              placeholder="AC..."
                            />
                          </div>
                          <div>
                            <Label>Auth Token</Label>
                            <Input
                              type="password"
                              value={gateway.configuration?.auth_token || ""}
                              placeholder="Auth token"
                            />
                          </div>
                          <div>
                            <Label>From Number</Label>
                            <Input
                              value={gateway.configuration?.from_number || ""}
                              placeholder="+1234567890"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global System Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure system-wide settings that affect all tenants
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Application Name</Label>
                  <Input defaultValue="Healthcare Management System" />
                </div>
                <div>
                  <Label>Support Email</Label>
                  <Input defaultValue="support@yourapp.com" />
                </div>
                <div>
                  <Label>Default Trial Period (days)</Label>
                  <Input type="number" defaultValue="14" />
                </div>
                <div>
                  <Label>Max Users Per Basic Plan</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the entire system in maintenance mode
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow new tenant companies to register
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">
                      Require email verification for new accounts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button className="w-full md:w-auto">
                <Save className="w-4 h-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </SuperAdminLayout>
  );
}