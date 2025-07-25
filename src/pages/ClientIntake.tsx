import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Send,
  User,
  Shield,
  History,
  Phone,
  Stethoscope,
} from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function ClientIntake() {
  const { toast } = useToast();

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Client intake form has been submitted successfully.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Client intake form has been saved as draft.",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full max-w-screen-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Client Intake Form
                </h1>
                <p className="text-muted-foreground">
                  Complete all sections to register a new client
                </p>
              </div>

              <Tabs defaultValue="client-info" className="w-full">
                <TabsList className="mb-6 flex flex-wrap gap-2">
                  <TabsTrigger value="client-info">Client Info</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="health-history">Health History</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                  <TabsTrigger value="physician">Physician Info</TabsTrigger>
                </TabsList>

                <TabsContent value="client-info">
                  {/* [Client Info Card — already included above] */}
                </TabsContent>

                <TabsContent value="insurance">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Insurance Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                          <Input id="insuranceProvider" placeholder="Enter provider name" />
                        </div>
                        <div>
                          <Label htmlFor="policyNumber">Policy Number</Label>
                          <Input id="policyNumber" placeholder="Enter policy number" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="groupNumber">Group Number</Label>
                        <Input id="groupNumber" placeholder="Enter group number" />
                      </div>
                      <div>
                        <Label htmlFor="insurancePhone">Insurance Phone Number</Label>
                        <Input id="insurancePhone" placeholder="Enter phone number" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="health-history">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Health History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Label htmlFor="pastIllnesses">Past Illnesses</Label>
                      <Textarea
                        id="pastIllnesses"
                        placeholder="List previous illnesses, surgeries, and hospitalizations"
                        rows={4}
                      />
                      <Label htmlFor="currentMedications">Current Medications</Label>
                      <Textarea
                        id="currentMedications"
                        placeholder="List medications currently being taken"
                        rows={4}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emergency">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Emergency Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergencyName">Contact Name</Label>
                          <Input id="emergencyName" placeholder="Full name" />
                        </div>
                        <div>
                          <Label htmlFor="emergencyPhone">Phone Number</Label>
                          <Input id="emergencyPhone" placeholder="Phone number" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="emergencyRelation">Relation to Client</Label>
                        <Input id="emergencyRelation" placeholder="e.g. Spouse, Parent" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="physician">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        Physician Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="physicianName">Physician Name</Label>
                          <Input id="physicianName" placeholder="Full name" />
                        </div>
                        <div>
                          <Label htmlFor="physicianPhone">Phone Number</Label>
                          <Input id="physicianPhone" placeholder="Phone number" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="physicianAddress">Office Address</Label>
                        <Textarea id="physicianAddress" rows={3} placeholder="Complete address" />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  size="lg"
                  className="min-w-40"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="min-w-40 bg-gradient-primary text-white hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Form
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
