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
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Patient Assessment Form</h1>
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Form
              </Button>
            </div>

            {/* Patient Details - Wide Card */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
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

                <div className="space-y-1">
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

                <div className="space-y-1">
                  <Label>Assessment Date</Label>
                  <Input type="date" className="w-full" />
                </div>

                <div className="space-y-1">
                  <Label>Assessor Name</Label>
                  <Input className="w-full" placeholder="Your name" />
                </div>
              </CardContent>
            </Card>

            {/* General Health - Full Width */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>General Health</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <Label>Temp (°F)</Label>
                    <Input className="w-full" />
                  </div>
                  <div className="space-y-1">
                    <Label>Pulse (bpm)</Label>
                    <Input className="w-full" />
                  </div>
                  <div className="space-y-1">
                    <Label>Respiration (rpm)</Label>
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

                  <div className="col-span-2 md:col-span-3 lg:col-span-5 space-y-1">
                    <Label>Diet/Nutrition</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {["Regular", "Low Salt", "Diabetic", "Renal", "Soft", "NPO"].map((option) => (
                        <label key={option} className="flex items-center space-x-2">
                          <Checkbox id={option} />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-3 lg:col-span-5 space-y-1">
                    <Label>Fluid Restrictions</Label>
                    <RadioGroup defaultValue="no" className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-restriction" />
                        <Label htmlFor="no-restriction">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes-restriction" />
                        <Label htmlFor="yes-restriction">Yes</Label>
                      </div>
                      <Input placeholder="Amount (mL)" className="w-32" />
                    </RadioGroup>
                  </div>

                  <div className="col-span-2 md:col-span-3 lg:col-span-5 space-y-1">
                    <Label>Recent Health Changes</Label>
                    <Textarea className="w-full" rows={3} />
                  </div>
                </CardContent>
              </Card>

              {/* Diagnosis - Full Width */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Diagnosis & Health Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label>Primary Diagnosis</Label>
                      <Input className="w-full" />
                    </div>
                    <div className="space-y-1">
                      <Label>Secondary Diagnoses</Label>
                      <Input className="w-full" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Recent Changes</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                      {["Medications", "Hospitalizations", "Falls", "ER Visits", "New Symptoms", "Other"].map((item) => (
                        <label key={item} className="flex items-center space-x-2">
                          <Checkbox id={item} />
                          <span>{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>Details</Label>
                    <Textarea className="w-full" rows={4} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Respiratory & Pain Assessment - Full Width */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Respiratory Status</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Shortness of Breath</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Never", "Walking >20ft", "Moderate exertion", "Minimal exertion", "At rest"].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Respiratory Treatments</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Oxygen", "Nebulizer", "Ventilator", "CPAP/BIPAP"].map((treatment) => (
                        <label key={treatment} className="flex items-center space-x-2">
                          <Checkbox id={treatment} />
                          <span>{treatment}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Pain Assessment</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Pain Frequency</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {["No pain", "Less than daily", "Daily", "Constant"].map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label>Pain Location</Label>
                    <Input className="w-full" placeholder="Where is the pain?" />
                  </div>

                  <div className="space-y-1">
                    <Label>Pain Intensity</Label>
                    <RadioGroup defaultValue="mild" className="flex gap-4">
                      {["Mild", "Moderate", "Severe"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={level.toLowerCase()} 
                            id={`pain-${level.toLowerCase()}`} 
                          />
                          <Label htmlFor={`pain-${level.toLowerCase()}`}>
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-1">
                    <Label>Current Treatment</Label>
                    <Input className="w-full" placeholder="Current pain management" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Signatures - Full Width */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Signatures</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>RN Name</Label>
                  <Input className="w-full" />
                  <Label>RN Signature</Label>
                  <Input className="w-full" />
                  <Label>Date</Label>
                  <Input type="date" className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label>Patient/Guardian Name</Label>
                  <Input className="w-full" />
                  <Label>Signature</Label>
                  <Input className="w-full" />
                  <Label>Date</Label>
                  <Input type="date" className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers - Full Width */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Disclaimers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>MANDATED REPORTING:</strong> Any suspicion of abuse,
                  neglect, or exploitation must be immediately reported to Adult Protective
                  Services at 1-800-XXX-XXXX.
                </p>
                <p>
                  <strong>Case Manager Contact:</strong> Immediately contact your Case Manager 
                  to report any health and safety concerns. This form must be submitted within 
                  10 days of assessment completion.
                </p>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
