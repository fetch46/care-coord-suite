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

                {/* General Health Section */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>General Health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label>Temperature (°F)</Label>
                      <Input className="w-full" placeholder="98.6" />
                    </div>
                    <div className="space-y-1">
                      <Label>Pulse (bpm)</Label>
                      <Input className="w-full" placeholder="72" />
                    </div>
                    <div className="space-y-1">
                      <Label>Respiration (rpm)</Label>
                      <Input className="w-full" placeholder="16" />
                    </div>
                    <div className="space-y-1">
                      <Label>Blood Pressure</Label>
                      <Input className="w-full" placeholder="120/80" />
                    </div>
                    <div className="space-y-1">
                      <Label>Weight (lbs)</Label>
                      <Input className="w-full" placeholder="150" />
                    </div>
                    <div className="space-y-1">
                      <Label>Target Weight (lbs)</Label>
                      <Input className="w-full" placeholder="155" />
                    </div>

                    <div className="col-span-full space-y-4">
                      <div>
                        <Label>Diet/Nutrition</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Regular", "Low Salt", "Diabetic", "Renal", "Soft", "NPO"].map((diet) => (
                            <div key={diet} className="flex items-center space-x-2">
                              <Checkbox id={diet.toLowerCase()} />
                              <Label htmlFor={diet.toLowerCase()}>{diet}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <Label>Fluid Restrictions:</Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no-restriction" />
                            <Label htmlFor="no-restriction">No</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes-restriction" />
                            <Label htmlFor="yes-restriction">Yes</Label>
                          </div>
                        </div>
                        <Input placeholder="Amount (mL)" className="w-32" />
                      </div>

                      <div className="space-y-1">
                        <Label>Recent Health Changes</Label>
                        <Textarea className="w-full" placeholder="Describe any changes..." rows={3} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnosis Section */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Diagnosis & Health Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label>Primary Diagnosis</Label>
                        <Input className="w-full" placeholder="Enter primary diagnosis" />
                      </div>
                      <div className="space-y-1">
                        <Label>Secondary Diagnoses</Label>
                        <Input className="w-full" placeholder="Enter secondary diagnoses" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Recent Changes</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["Medications", "Hospitalizations", "Falls", "ER Visits", "New Symptoms", "Other"].map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox id={item.toLowerCase()} />
                            <Label htmlFor={item.toLowerCase()}>{item}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label>Details</Label>
                      <Textarea className="w-full" placeholder="Provide additional details..." rows={4} />
                    </div>
                  </CardContent>
                </Card>

                {/* Signatures Section */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>RN Name</Label>
                        <Input className="w-full" placeholder="Registered Nurse Name" />
                      </div>
                      <div className="space-y-1">
                        <Label>RN Signature</Label>
                        <Input className="w-full" placeholder="Nurse signature" />
                      </div>
                      <div className="space-y-1">
                        <Label>Date</Label>
                        <Input className="w-full" type="date" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>Participant/Guardian Name</Label>
                        <Input className="w-full" placeholder="Patient or guardian name" />
                      </div>
                      <div className="space-y-1">
                        <Label>Signature</Label>
                        <Input className="w-full" placeholder="Patient/guardian signature" />
                      </div>
                      <div className="space-y-1">
                        <Label>Date</Label>
                        <Input className="w-full" type="date" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimers Section */}
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
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
