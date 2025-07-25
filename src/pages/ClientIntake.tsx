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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Enter first name" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Enter last name" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea id="address" placeholder="Enter full address" rows={3} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="Enter phone number" />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" placeholder="Enter email" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* All other tabs already have fields */}
                <TabsContent value="insurance">...</TabsContent>
                <TabsContent value="health-history">...</TabsContent>
                <TabsContent value="emergency">...</TabsContent>
                <TabsContent value="physician">...</TabsContent>
              </Tabs>

              {/* Form Buttons */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  size="lg"
                  className="min-w-40"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      className="min-w-40 bg-gradient-primary text-white hover:opacity-90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSaveDraft}>Save as Draft</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSubmit}>Submit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
