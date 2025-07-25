"use client";

import { useState } from "react";
import {
  Plus, Trash2, Save, Send, User, Shield, History, Phone, Stethoscope
} from "lucide-react";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Surgery {
  id: string;
  name: string;
  date: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneHome: string;
  phoneWork: string;
  phoneCell: string;
  address: string;
}

export default function ClientIntake() {
  const { toast } = useToast();

  // State declarations
  const [clientInfo, setClientInfo] = useState({
    lastName: "", firstName: "", middleName: "", address: "", dateOfBirth: "",
    sex: "", race: "", ssn: "", referralSource: "", dischargeDate: "",
    primaryDiagnosis: "", secondaryDiagnosis: "", allergies: "", planOfCare: ""
  });

  const [insurance, setInsurance] = useState({
    company: "", memberNumber: "", groupNumber: "", phone: "", medicaidNumber: ""
  });

  const [surgeries, setSurgeries] = useState<Surgery[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", relationship: "", phoneHome: "", phoneWork: "", phoneCell: "", address: "" },
    { name: "", relationship: "", phoneHome: "", phoneWork: "", phoneCell: "", address: "" }
  ]);

  const [physician, setPhysician] = useState({
    name: "", phone: "", npi: "", address: ""
  });

  const addSurgery = () => {
    setSurgeries([...surgeries, { id: Date.now().toString(), name: "", date: "" }]);
  };

  const removeSurgery = (id: string) => {
    setSurgeries(surgeries.filter(surgery => surgery.id !== id));
  };

  const updateSurgery = (id: string, field: string, value: string) => {
    setSurgeries(surgeries.map(surgery =>
      surgery.id === id ? { ...surgery, [field]: value } : surgery
    ));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

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

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 bg-background">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Client Intake Form</h1>
                <p className="text-muted-foreground">Complete all sections to register a new client</p>
              </div>

              {/* Tabs Navigation */}
              <Tabs defaultValue="client-info" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="client-info">Client Info</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="history">Health History</TabsTrigger>
                  <TabsTrigger value="contacts">Contacts</TabsTrigger>
                  <TabsTrigger value="physician">Physician</TabsTrigger>
                </TabsList>

                {/* Client Info Tab */}
                <TabsContent value="client-info">
                  {/* Place your existing Client Info Card here */}
                  {/* (same code from your original file under "Client Information") */}
                </TabsContent>

                {/* Insurance Tab */}
                <TabsContent value="insurance">
                  {/* Place your Insurance Details Card here */}
                </TabsContent>

                {/* Past Health History Tab */}
                <TabsContent value="history">
                  {/* Surgeries Card here */}
                </TabsContent>

                {/* Emergency Contacts Tab */}
                <TabsContent value="contacts">
                  {/* Emergency Contacts Card here */}
                </TabsContent>

                {/* Physician Tab */}
                <TabsContent value="physician">
                  {/* Physician Information Card here */}
                </TabsContent>
              </Tabs>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button onClick={handleSaveDraft} variant="outline" size="lg" className="min-w-40">
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button onClick={handleSubmit} size="lg" className="min-w-40 bg-gradient-primary text-white hover:opacity-90">
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
