"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function PatientAssessment() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 p-6 md:p-10">
              {/* Increased max-width and removed space-y-6 to control spacing individually */}
              <div className="w-full max-w-6xl mx-auto space-y-8"> {/* Increased max-width */}
                
                {/* General Health - Wider Card */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>General Health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Increased columns */}
                    <Input placeholder="Temperature (°F)" className="col-span-1" />
                    <Input placeholder="Pulse (bpm)" className="col-span-1" />
                    <Input placeholder="Respiration (rpm)" className="col-span-1" />
                    <Input placeholder="Blood Pressure" className="col-span-1" />
                    <Input placeholder="Weight (lbs)" className="col-span-1" />
                    <div className="col-span-1" /> {/* Spacer */}

                    <div className="col-span-3"> {/* Full width section */}
                      <p className="mb-3 font-medium">Diet/Nutrition:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> {/* More columns for options */}
                        {[
                          "Regular",
                          "Low Salt",
                          "Diabetic",
                          "Renal",
                          "Soft",
                          "NPO",
                          "Other",
                        ].map((label) => (
                          <label key={label} className="flex items-center space-x-3"> {/* Increased spacing */}
                            <Checkbox id={label} />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-3 flex items-center gap-6"> {/* Wider fluid restrictions */}
                      <label className="flex items-center space-x-3">
                        <Checkbox id="fluid-restrictions" />
                        <span>Fluid Restrictions?</span>
                      </label>
                      <Input
                        placeholder="If yes, amount in mL"
                        className="w-64" {/* Wider input */}
                      />
                    </div>

                    <Textarea
                      placeholder="Recent Health Changes"
                      className="col-span-3 h-24" {/* Wider and taller */}
                    />
                  </CardContent>
                </Card>

                {/* Diagnosis & Health Status - Wider */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Diagnosis & Health Status</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6"> {/* Increased gap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input placeholder="Primary Diagnosis" />
                      <Input placeholder="Secondary Diagnoses" />
                    </div>

                    <div className="space-y-3">
                      <p className="font-medium text-lg">Recent Changes:</p> {/* Larger text */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4"> {/* Multi-column layout */}
                        {[
                          "Medications",
                          "Hospitalizations",
                          "Falls",
                          "ER Visits",
                          "New Symptoms",
                          "Other",
                        ].map((label) => (
                          <label key={label} className="flex items-center space-x-3">
                            <Checkbox id={label} />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Textarea 
                      placeholder="Details" 
                      className="min-h-32" {/* Taller textarea */}
                    />
                  </CardContent>
                </Card>

                {/* Signatures - Wider layout */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Increased gap */}
                    <div className="space-y-4">
                      <Input placeholder="RN Name (Print)" className="w-full" />
                      <Input placeholder="RN Signature" className="w-full" />
                      <Input type="date" className="w-full" />
                    </div>
                    <div className="space-y-4">
                      <Input placeholder="Participant/Guardian Name" className="w-full" />
                      <Input placeholder="Participant/Guardian Signature" className="w-full" />
                      <Input type="date" className="w-full" />
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimers - Full width */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Disclaimers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-base"> {/* Larger text */}
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
