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

export default function PatientAssessment() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-6 md:p-10">
              <div className="w-full max-w-6xl mx-auto space-y-8">
                {/* Header with Print Button */}
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold">Patient Assessment Form</h1>
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Form
                  </Button>
                </div>

                {/* General Health Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>General Health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Temperature (°F)</Label>
                      <Input placeholder="98.6" />
                    </div>
                    <div className="space-y-2">
                      <Label>Pulse (bpm)</Label>
                      <Input placeholder="72" />
                    </div>
                    <div className="space-y-2">
                      <Label>Respiration (rpm)</Label>
                      <Input placeholder="16" />
                    </div>
                    <div className="space-y-2">
                      <Label>Blood Pressure</Label>
                      <Input placeholder="120/80" />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (lbs)</Label>
                      <Input placeholder="150" />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Weight (lbs)</Label>
                      <Input placeholder="155" />
                    </div>

                    <div className="col-span-3 space-y-4">
                      <div>
                        <Label>Diet/Nutrition</Label>
                        <ToggleGroup type="multiple" className="flex-wrap justify-start">
                          <ToggleGroupItem value="regular">Regular</ToggleGroupItem>
                          <ToggleGroupItem value="low-salt">Low Salt</ToggleGroupItem>
                          <ToggleGroupItem value="diabetic">Diabetic</ToggleGroupItem>
                          <ToggleGroupItem value="renal">Renal</ToggleGroupItem>
                          <ToggleGroupItem value="soft">Soft</ToggleGroupItem>
                          <ToggleGroupItem value="npo">NPO</ToggleGroupItem>
                        </ToggleGroup>
                      </div>

                      <div className="flex items-center gap-4">
                        <Label>Fluid Restrictions:</Label>
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

                      <div className="space-y-2">
                        <Label>Recent Health Changes</Label>
                        <Textarea placeholder="Describe any changes..." />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnosis Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnosis & Health Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Primary Diagnosis</Label>
                        <Input placeholder="Enter primary diagnosis" />
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Diagnoses</Label>
                        <Input placeholder="Enter secondary diagnoses" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Recent Changes</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Medications", "Hospitalizations", "Falls", "ER Visits", "New Symptoms", "Other"].map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={item.toLowerCase()} />
                            <Label htmlFor={item.toLowerCase()}>{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Details</Label>
                      <Textarea placeholder="Provide additional details..." className="min-h-32" />
                    </div>
                  </CardContent>
                </Card>

                {/* Signatures Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>RN Name</Label>
                        <Input placeholder="Registered Nurse Name" />
                      </div>
                      <div className="space-y-2">
                        <Label>RN Signature</Label>
                        <Input placeholder="Nurse signature" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Participant/Guardian Name</Label>
                        <Input placeholder="Patient or guardian name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Signature</Label>
                        <Input placeholder="Patient/guardian signature" />
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimers Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Disclaimers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
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
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
