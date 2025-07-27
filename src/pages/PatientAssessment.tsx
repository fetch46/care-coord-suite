"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock patient data - replace with your actual data source
const patients = [
  { id: "1", name: "John Doe", mrn: "MRN12345" },
  { id: "2", name: "Jane Smith", mrn: "MRN67890" },
  { id: "3", name: "Robert Johnson", mrn: "MRN54321" },
  { id: "4", name: "Emily Davis", mrn: "MRN09876" },
];

const assessmentTypes = [
  "Initial Assessment",
  "45 Day Assessment",
  "90 Day Assessment",
  "Annual Assessment",
  "Change of Condition",
];

export default function PatientAssessment() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              <div className="w-full space-y-6">
                {/* Header with Print Button */}
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Patient Assessment Form</h1>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Form
                  </Button>
                </div>

                {/* Patient Details Card */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Patient Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Select Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.name} ({patient.mrn})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Assessment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assessment type" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessmentTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Assessment Date</Label>
                      <Input type="date" className="w-full" />
                    </div>

                    <div className="space-y-2">
                      <Label>Assessor Name</Label>
                      <Input placeholder="Enter assessor's name" className="w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* General Health Section */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>General Health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* ... rest of your existing General Health content ... */}
                  </CardContent>
                </Card>

                {/* ... rest of your existing form sections ... */}
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
