"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function HCBSAssessmentForm() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
              {/* Page 1 */}
              <h1 className="text-2xl font-bold">HCBS Assessment Form</h1>

              {/* Section 2: General Health */}
              <Card>
                <CardHeader>
                  <CardTitle>2. General Health</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Input placeholder="Temperature (°F)" />
                  <Input placeholder="Pulse (bpm)" />
                  <Input placeholder="Respiration (rpm)" />
                  <Input placeholder="Blood Pressure" />
                  <Input placeholder="Weight (lbs)" />

                  <div className="col-span-2">
                    <p className="font-semibold mb-2">Diet/Nutrition:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        "Regular",
                        "Low Salt",
                        "Diabetic",
                        "Renal",
                        "Soft",
                        "NPO",
                        "Other",
                      ].map((label) => (
                        <label key={label} className="flex items-center space-x-2">
                          <Checkbox /> <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center space-x-2">
                    <Checkbox />
                    <span>Fluid Restrictions?</span>
                    <Input placeholder="If yes, amount in mL" className="w-32" />
                  </div>

                  <Textarea placeholder="Recent Health Changes" className="col-span-2" />
                </CardContent>
              </Card>

              {/* Section 3: Diagnosis & Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle>3. Diagnosis & Health Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Primary Diagnosis" />
                  <Input placeholder="Secondary Diagnoses" />

                  <div className="space-y-1">
                    <p className="font-semibold">Recent Changes:</p>
                    {[
                      "Medications",
                      "Hospitalizations",
                      "Falls",
                      "ER Visits",
                      "New Symptoms",
                    ].map((label) => (
                      <label key={label} className="flex items-center space-x-2">
                        <Checkbox /> <span>{label}</span>
                      </label>
                    ))}
                  </div>

                  <Textarea placeholder="Details" />
                </CardContent>
              </Card>

              {/* Section 10: Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle>10. Signatures</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Input placeholder="RN Signature" />
                    <Input type="date" placeholder="Date" />
                  </div>
                  <div>
                    <Input placeholder="Participant/Guardian Signature" />
                    <Input type="date" placeholder="Date" />
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimers */}
              <Card>
                <CardHeader>
                  <CardTitle>Disclaimers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>MANDATED REPORTING:</strong> Any suspicion of abuse, neglect, or
                    exploitation must be reported to Adult Protective Services.
                  </p>
                  <p>
                    <strong>Case Manager Contact:</strong> For questions about your care
                    plan, contact your Case Manager.
                  </p>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
