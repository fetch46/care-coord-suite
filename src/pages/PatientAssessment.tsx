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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <main className="flex-1 p-4 md:p-6">
              <div className="w-full mx-auto space-y-6" style={{ maxWidth: '95%' }}>
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Patient Assessment Form</h1>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Form
                  </Button>
                </div>

                {/* Patient Details - Wider Card */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Patient Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label>Select Patient</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select patient" />
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
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
                      <Input className="w-full" placeholder="Your name" />
                    </div>
                  </CardContent>
                </Card>

                {/* General Health - Wider Layout */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>General Health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="space-y-1">
                      <Label>Temp (°F)</Label>
                      <Input className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <Label>Pulse</Label>
                      <Input className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <Label>Respiration</Label>
                      <Input className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <Label>Blood Pressure</Label>
                      <Input className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <Label>Weight (lbs)</Label>
                      <Input className="w-full" />
                    </div>

                    {/* Diet Options - Full Width */}
                    <div className="md:col-span-3 lg:col-span-5 space-y-2">
                      <Label>Diet/Nutrition</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                        {["Regular", "Low Salt", "Diabetic", "Renal", "Soft", "NPO"].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox id={option} />
                            <Label htmlFor={option}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Fluid Restrictions - Full Width */}
                    <div className="md:col-span-3 lg:col-span-5 space-y-2">
                      <Label>Fluid Restrictions</Label>
                      <div className="flex items-center gap-4">
                        <RadioGroup defaultValue="no" className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no-restriction" />
                            <Label htmlFor="no-restriction">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes-restriction" />
                            <Label htmlFor="yes-restriction">Yes</Label>
                          </div>
                        </RadioGroup>
                        <Input placeholder="Amount (mL)" className="w-32" />
                      </div>
                    </div>

                    {/* Notes - Full Width */}
                    <div className="md:col-span-3 lg:col-span-5 space-y-1">
                      <Label>Recent Health Changes</Label>
                      <Textarea className="w-full" rows={3} />
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnosis Section - Wider */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Diagnosis & Health Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <Label>Primary Diagnosis</Label>
                        <Input className="w-full" />
                      </div>
                      <div className="space-y-1">
                        <Label>Secondary Diagnoses</Label>
                        <Input className="w-full" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Recent Changes</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {["Medications", "Hospitalizations", "Falls", "ER Visits", "New Symptoms", "Other"].map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={item} />
                            <Label htmlFor={item}>{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Details</Label>
                      <Textarea className="w-full" rows={4} />
                    </div>
                  </CardContent>
                </Card>

                {/* Signatures - Wider Layout */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label>RN Name</Label>
                        <Input className="w-full" />
                      </div>
                      <div className="space-y-1">
                        <Label>RN Signature</Label>
                        <Input className="w-full" />
                      </div>
                      <div className="space-y-1">
                        <Label>Date</Label>
                        <Input type="date" className="w-full" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label>Patient/Guardian Name</Label>
                        <Input className="w-full" />
                      </div>
                      <div className="space-y-1">
                        <Label>Signature</Label>
                        <Input className="w-full" />
                      </div>
                      <div className="space-y-1">
                        <Label>Date</Label>
                        <Input type="date" className="w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimers */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Disclaimers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>MANDATED REPORTING:</strong> Any suspicion of abuse,
                      neglect, or exploitation must be immediately reported.
                    </p>
                    <p>
                      <strong>Case Manager Contact:</strong> Immediately contact your Case Manager 
                      to report any health and safety concerns.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
