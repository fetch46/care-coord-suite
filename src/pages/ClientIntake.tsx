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
  <Card className="shadow-card">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Client Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" placeholder="Enter last name" required />
        </div>
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" placeholder="Enter first name" required />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input id="middleName" placeholder="Enter middle name" />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Current Address *</Label>
        <Textarea
          id="address"
          placeholder="Enter complete address including street, city, state, and ZIP code"
          rows={3}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input id="dateOfBirth" type="date" required />
        </div>
        <div>
          <Label htmlFor="sex">Sex *</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="race">Race</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select race" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="american-indian">American Indian or Alaska Native</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="black">Black or African American</SelectItem>
              <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
              <SelectItem value="pacific-islander">Native Hawaiian or Other Pacific Islander</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ssn">Social Security Number</Label>
          <Input id="ssn" placeholder="XXX-XX-XXXX" maxLength={11} />
        </div>
        <div>
          <Label htmlFor="referralSource">Referral Source</Label>
          <Input id="referralSource" placeholder="Enter referral source" />
        </div>
      </div>
      <div>
        <Label htmlFor="dischargeDate">Date of Discharge from Facility</Label>
        <Input id="dischargeDate" type="date" />
      </div>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
            <Input id="primaryDiagnosis" placeholder="Enter primary diagnosis" />
          </div>
          <div>
            <Label htmlFor="secondaryDiagnosis">Secondary Diagnosis</Label>
            <Input id="secondaryDiagnosis" placeholder="Enter secondary diagnosis" />
          </div>
        </div>
        <div>
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea
            id="allergies"
            placeholder="List all known allergies and reactions"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="planOfCare">Plan of Care (POC)</Label>
          <Textarea
            id="planOfCare"
            placeholder="Enter plan of care details"
            rows={4}
          />
        </div>
      </div>
    </CardContent>
  </Card>
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
