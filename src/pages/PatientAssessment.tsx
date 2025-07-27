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
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <div className="w-full max-w-[1800px] mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Patient Assessment Form</h1>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Form
                  </Button>
                </div>

                {/* Patient Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label>Select Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name} ({p.mrn})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Assessment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {assessmentTypes.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Assessment Date</Label>
                      <Input type="date" />
                    </div>

                    <div>
                      <Label>Assessor Name</Label>
                      <Input placeholder="Your name" />
                    </div>
                  </CardContent>
                </Card>

                {/* Combined General Health and Diagnosis & Health Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle>General Health</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div><Label>Temp (°F)</Label><Input /></div>
                      <div><Label>Pulse (bpm)</Label><Input /></div>
                      <div><Label>Respiration (rpm)</Label><Input /></div>
                      <div><Label>Blood Pressure</Label><Input /></div>
                      <div><Label>Weight (lbs)</Label><Input /></div>

                      <div className="col-span-2 md:col-span-3 lg:col-span-5">
                        <Label>Diet/Nutrition</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-1">
                          {["Regular","Low Salt","Diabetic","Renal","Soft","NPO"].map((opt) => (
                            <label key={opt} className="flex items-center space-x-2">
                              <Checkbox id={opt} />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-2 md:col-span-3 lg:col-span-5">
                        <Label>Fluid Restrictions</Label>
                        <RadioGroup defaultValue="no" className="flex items-center gap-4 mt-1">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no-res" />
                            <Label htmlFor="no-res">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes-res" />
                            <Label htmlFor="yes-res">Yes</Label>
                          </div>
                          <Input placeholder="Amount (mL)" className="w-32" />
                        </RadioGroup>
                      </div>

                      <div className="col-span-2 md:col-span-3 lg:col-span-5">
                        <Label>Recent Health Changes</Label>
                        <Textarea rows={3} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Diagnosis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Diagnosis & Health Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><Label>Primary Diagnosis</Label><Input /></div>
                        <div><Label>Secondary Diagnoses</Label><Input /></div>
                      </div>
                      <div>
                        <Label>Recent Changes</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-1">
                          {["Medications","Hospitalizations","Falls","ER Visits","New Symptoms","Other"].map((c) => (
                            <label key={c} className="flex items-center space-x-2">
                              <Checkbox id={c} />
                              <span>{c}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div><Label>Details</Label><Textarea rows={4} /></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Combined Respiratory and Pain Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Respiratory */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Respiratory Status</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Shortness of Breath</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Never","Walking >20ft","Moderate exertion","Minimal exertion","At rest"].map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Respiratory Treatments</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          {["Oxygen","Nebulizer","Ventilator","CPAP/BIPAP"].map((t) => (
                            <label key={t} className="flex items-center space-x-2">
                              <Checkbox id={t} />
                              <span>{t}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pain Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pain Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Pain Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {["No pain","Less than daily","Daily","Constant"].map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Pain Location</Label>
                        <Input placeholder="Where is the pain?" />
                      </div>
                      <div>
                        <Label>Pain Intensity</Label>
                        <RadioGroup defaultValue="mild" className="flex gap-4 mt-1">
                          {["Mild","Moderate","Severe"].map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <RadioGroupItem value={level.toLowerCase()} id={`pain-${level.toLowerCase()}`} />
                              <Label htmlFor={`pain-${level.toLowerCase()}`}>{level}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div>
                        <Label>Current Treatment</Label>
                        <Input placeholder="Current pain management" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Signatures */}
                <Card>
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>RN Name</Label><Input />
                      <Label>RN Signature</Label><Input />
                      <Label>Date</Label><Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>Patient/Guardian Name</Label><Input />
                      <Label>Signature</Label><Input />
                      <Label>Date</Label><Input type="date" />
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Disclaimers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>MANDATED REPORTING:</strong> Any suspicion of abuse, neglect, or exploitation must be immediately reported to Adult Protective Services at 1-800-XXX-XXXX.
                    </p>
                    <p>
                      <strong>Case Manager Contact:</strong> Immediately contact your Case Manager to report any health and safety concerns. This form must be submitted within 10 days of assessment completion.
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
