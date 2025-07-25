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

// [Interfaces for Surgery and EmergencyContact same as before]

export default function ClientIntake() {
  const { toast } = useToast();

  // [State definitions for clientInfo, insurance, surgeries, etc. same as before]

  // [Helper functions: addSurgery, removeSurgery, etc. same as before]

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
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Client Intake Form
                </h1>
                <p className="text-muted-foreground">
                  Complete all sections to register a new client
                </p>
              </div>

              {/* Tabs Layout */}
              <Tabs defaultValue="client-info" className="w-full">
                <TabsList className="mb-6 flex flex-wrap gap-2">
                  <TabsTrigger value="client-info">Client Info</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="health-history">Health History</TabsTrigger>
                  <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                  <TabsTrigger value="physician">Physician Info</TabsTrigger>
                </TabsList>

                <TabsContent value="client-info">
                  {/* Insert Client Information Card Here */}
                </TabsContent>

                <TabsContent value="insurance">
                  {/* Insert Insurance Details Card Here */}
                </TabsContent>

                <TabsContent value="health-history">
                  {/* Insert Past Health History Card Here */}
                </TabsContent>

                <TabsContent value="emergency">
                  {/* Insert Emergency Contacts Card Here */}
                </TabsContent>

                <TabsContent value="physician">
                  {/* Insert Physician Information Card Here */}
                </TabsContent>
              </Tabs>

              {/* Form Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
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
