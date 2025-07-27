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
            <main className="flex-1 px-4 py-6 md:px-10 md:py-8 lg:px-16 space-y-6 w-full">
              <div className="max-w-screen-2xl mx-auto w-full space-y-6">
                {/* 2. General Health */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>2. General Health</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Temperature (°F)" />
                    <Input placeholder="Pulse (bpm)" />
                    <Input placeholder="Respiration (rpm)" />
                    <Input placeholder="Blood Pressure" />
                    <Input placeholder="Weight (lbs)" />

                    <div className="col-span-2">
                      <p className="mb-2 font-medium">Diet/Nutrition:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                            <Checkbox id={label} />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2 flex flex-wrap items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <Checkbox id="fluid-restrictions" />
                        <span>Fluid Restrictions?</span>
                      </label>
                      <Input
                        placeholder="If yes, amount in mL"
                        className="w-48"
                      />
                    </div>

                    <Textarea
                      placeholder="Recent Health Changes"
                      className="col-span-2"
                    />
                  </CardContent>
                </Card>

                {/* 3. Diagnosis & Health Status */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>3. Diagnosis & Health Status</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <Input placeholder="Primary Diagnosis" />
                    <Input placeholder="Secondary Diagnoses" />

                    <div className="space-y-1">
                      <p className="font-medium">Recent Changes:</p>
                      {[
                        "Medications",
                        "Hospitalizations",
                        "Falls",
                        "ER Visits",
                        "New Symptoms",
                      ].map((label) => (
                        <label key={label} className="flex items-center space-x-2">
                          <Checkbox id={label} />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>

                    <Textarea placeholder="Details" />
                  </CardContent>
                </Card>

                {/* 10. Signatures */}
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>10. Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Disclaimers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <strong>MANDATED REPORTING:</strong> Any suspicion of abuse,
                      neglect, or exploitation must be reported to Adult Protective
                      Services.
                    </p>
                    <p>
                      <strong>Case Manager Contact:</strong> For questions about your care
                      plan, contact your Case Manager.
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
