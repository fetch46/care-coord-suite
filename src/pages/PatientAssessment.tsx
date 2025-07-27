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
        <div className="flex flex-col w-full">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 overflow-auto p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                  DHMH 4658 A (N-PA) – Waiver Participant Assessment
                </h1>
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
                  <div className="space-y-1">
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

                  <div className="space-y-1">
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

                  <div className="space-y-1">
                    <Label>Assessment Date</Label>
                    <Input type="date" />
                  </div>

                  <div className="space-y-1">
                    <Label>Assessor Name</Label>
                    <Input placeholder="Your name" />
                  </div>
                </CardContent>
              </Card>

              {/* GENERAL HEALTH */}
              <Card>
                <CardHeader>
                  <CardTitle>General Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Temp (°F)</Label>
                      <Input />
                    </div>
                    <div>
                      <Label>Pulse (bpm)</Label>
                      <Input />
                    </div>
                    <div>
                      <Label>Respiration (rpm)</Label>
                      <Input />
                    </div>
                    <div>
                      <Label>Blood Pressure</Label>
                      <Input />
                    </div>
                    <div>
                      <Label>Weight (lbs)</Label>
                      <Input />
                    </div>
                  </div>

                  <div>
                    <Label>Diet / Nutrition</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                      {[
                        "Regular",
                        "Low Salt",
                        "Puree/Chopped",
                        "Diabetic/No Concentrated Sweets",
                        "Renal",
                        "Other",
                      ].map((d) => (
                        <label key={d} className="flex items-center space-x-2">
                          <Checkbox id={`diet-${d}`} />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                    <Input placeholder="Other diet details" className="mt-2" />
                  </div>

                  <div>
                    <Label>Fluid</Label>
                    <div className="flex items-center gap-4 mt-1">
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="unlimited" />
                        <span>Unlimited</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="restricted" />
                        <span>Restricted</span>
                      </label>
                      <Input placeholder="Amount (mL)" className="w-32" />
                    </div>
                  </div>

                  <div>
                    <Label>
                      Identify any changes over the past month (Diagnosis,
                      Medications, Health Status, Hospitalization, Falls,
                      Incidents, Other)
                    </Label>
                    <Textarea rows={3} />
                  </div>
                </CardContent>
              </Card>

              {/* RESPIRATORY */}
              <Card>
                <CardHeader>
                  <CardTitle>Respiratory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Findings</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Within Normal Limits",
                        "Cough",
                        "Wheezing",
                        "Other",
                      ].map((f) => (
                        <label key={f} className="flex items-center space-x-2">
                          <Checkbox id={`resp-${f}`} />
                          <span>{f}</span>
                        </label>
                      ))}
                    </div>
                    <Input placeholder="Other findings" className="mt-2" />
                  </div>

                  <div>
                    <Label>Shortness of Breath</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Never short of breath",
                          "When walking >20 ft or climbing stairs",
                          "With moderate exertion (dressing, commode, walking <20 ft)",
                          "With minimal exertion (eating, talking)",
                          "At rest",
                        ].map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Respiratory treatments at home</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Oxygen (intermittent or continuous)",
                        "Aerosol or nebulizer treatments",
                        "Ventilator (intermittent or continuous)",
                        "CPAP or BIPAP",
                        "None",
                      ].map((t) => (
                        <label key={t} className="flex items-center space-x-2">
                          <Checkbox id={`resp-tx-${t}`} />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PAIN */}
              <Card>
                <CardHeader>
                  <CardTitle>Pain / Discomfort</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Pain Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "No pain or pain does not interfere with movement",
                          "Less often than daily",
                          "Daily, but not constant",
                          "All the time",
                        ].map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pain Sites</Label>
                    <Textarea rows={2} />
                  </div>
                  <div>
                    <Label>Pain Intensity</Label>
                    <div className="flex items-center gap-4">
                      {["High", "Medium", "Low"].map((level) => (
                        <label key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>
                      Person is experiencing pain that is not easily relieved,
                      occurs at least daily, and affects the ability to sleep,
                      appetite, physical or emotional energy, concentration,
                      personal relationships, emotions, or ability or desire to
                      perform physical activity
                    </Label>
                    <Checkbox />
                  </div>
                  <div>
                    <Label>Cause (if known)</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Treatment</Label>
                    <Input />
                  </div>
                </CardContent>
              </Card>

              {/* GENITOURINARY */}
              <Card>
                <CardHeader>
                  <CardTitle>Genitourinary Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Catheter</Label>
                    <Checkbox />
                  </div>
                  <div>
                    <Label>Urine Frequency</Label>
                    <Input />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Pain/Burning",
                      "Discharge",
                      "Distention/Retention",
                      "Hesitancy",
                      "Hematuria",
                    ].map((g) => (
                      <label key={g} className="flex items-center space-x-2">
                        <Checkbox id={`gu-${g}`} />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <Label>Other</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Person has been treated for a UTI in the past month</Label>
                    <Checkbox />
                  </div>
                </CardContent>
              </Card>

              {/* CARDIOVASCULAR */}
              <Card>
                <CardHeader>
                  <CardTitle>Cardiovascular</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>BP and Pulse within normal limits</Label>
                    <Checkbox />
                  </div>
                  <div>
                    <Label>Rhythm</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="regular" />
                        <span>Regular</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="irregular" />
                        <span>Irregular</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Edema</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "RUE: Non-pitting",
                        "RUE: Pitting",
                        "LUE: Non-pitting",
                        "LUE: Pitting",
                        "RLE: Non-pitting",
                        "RLE: Pitting",
                        "LLE: Non-pitting",
                        "LLE: Pitting",
                      ].map((e) => (
                        <label key={e} className="flex items-center space-x-2">
                          <Checkbox id={`edema-${e}`} />
                          <span>{e}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Other</Label>
                    <Input />
                  </div>
                </CardContent>
              </Card>

              {/* GASTROINTESTINAL */}
              <Card>
                <CardHeader>
                  <CardTitle>Gastrointestinal Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Bowels: frequency</Label>
                    <Input />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Diarrhea",
                      "Constipation",
                      "Nausea",
                      "Vomiting",
                      "Anorexia",
                    ].map((g) => (
                      <label key={g} className="flex items-center space-x-2">
                        <Checkbox id={`gi-${g}`} />
                        <span>{g}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <Label>Swallowing issues</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Pain</Label>
                    <Input placeholder="abdominal / epigastric" />
                  </div>
                  <div>
                    <Label>Other</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Bowel incontinence frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Very rarely or never incontinent of bowel",
                          "Less than once per week",
                          "One to three times per week",
                          "Four to six times per week",
                          "On a daily basis",
                          "More than once daily",
                        ].map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Person has ostomy for bowel elimination</Label>
                    <Checkbox />
                  </div>
                </CardContent>
              </Card>

              {/* NEUROLOGICAL */}
              <Card>
                <CardHeader>
                  <CardTitle>Neurological</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Cognitive functioning</Label>
                    <div className="space-y-1">
                      {[
                        "Alert/oriented, able to focus and shift attention, comprehends and recalls task directions independently",
                        "Requires prompting (cueing, repetition, reminders) only under stressful or unfamiliar situations",
                        "Requires assistance, direction in specific situation, requires low stimulus environment due to distractibility",
                        "Requires considerable assistance in routine situations. Is not alert and oriented or is unable to shift attention and recall more than half the time.",
                        "Totally dependent due to coma or delirium",
                      ].map((c) => (
                        <label key={c} className="flex items-start space-x-2">
                          <RadioGroupItem value={c} />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Speech</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        "Clear and understandable",
                        "Slurred",
                        "Garbled",
                        "Aphasic",
                        "Unable to speak",
                      ].map((s) => (
                        <label key={s} className="flex items-center space-x-2">
                          <Checkbox id={`speech-${s}`} />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Pupils</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="equal" />
                        <span>Equal</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="unequal" />
                        <span>Unequal</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Movements</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="coordinated" />
                        <span>Coordinated</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="uncoordinated" />
                        <span>Uncoordinated</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Extremities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        "Right upper Strong",
                        "Right upper Weak",
                        "Right upper Tremors",
                        "Right upper No movement",
                        "Left upper Strong",
                        "Left upper Weak",
                        "Left upper Tremors",
                        "Left upper No movement",
                        "Right lower Strong",
                        "Right lower Weak",
                        "Right lower Tremors",
                        "Right lower No movement",
                        "Left lower Strong",
                        "Left lower Weak",
                        "Left lower Tremors",
                        "Left lower No movement",
                      ].map((e) => (
                        <label key={e} className="flex items-center space-x-2">
                          <Checkbox id={`ext-${e}`} />
                          <span>{e}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SENSORY */}
              <Card>
                <CardHeader>
                  <CardTitle>Sensory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Vision with corrective lenses</Label>
                    <div className="space-y-1">
                      {[
                        "Normal vision in most situations; can see medication labels, newsprint",
                        "Partially impaired; can't see medication labels, but can see objects in path; can count fingers at arms length",
                        "Severely impaired; cannot locate objects without hearing or touching or person non-responsive",
                      ].map((v) => (
                        <label key={v} className="flex items-start space-x-2">
                          <RadioGroupItem value={v} />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Hearing with corrective device</Label>
                    <div className="space-y-1">
                      {[
                        "Normal hearing in most situations, can hear normal conversational tone",
                        "Partially impaired; can't hear normal conversational tone",
                        "Severely impaired; cannot hear even with an elevated tone",
                      ].map((h) => (
                        <label key={h} className="flex items-start space-x-2">
                          <RadioGroupItem value={h} />
                          <span>{h}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PSYCHOSOCIAL */}
              <Card>
                <CardHeader>
                  <CardTitle>Psychosocial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Behaviors reported or observed</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {[
                        "Indecisiveness",
                        "Diminished interest in most activities",
                        "Sleep disturbances",
                        "Recent change in appetite or weight",
                        "Agitation",
                        "A suicide attempt",
                        "None of the above behaviors observed or reported",
                      ].map((b) => (
                        <label key={b} className="flex items-center space-x-2">
                          <Checkbox id={`behavior-${b}`} />
                          <span>{b}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Is this person receiving psychological counseling?</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="no" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* MUSCULOSKELETAL */}
              <Card>
                <CardHeader>
                  <CardTitle>Musculoskeletal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "Within Normal limits",
                      "Deformity",
                      "Unsteady Gait",
                      "Contracture",
                      "Poor endurance",
                      "Impaired ROM",
                      "Altered Balance",
                      "Poor coordination",
                      "Weakness",
                    ].map((m) => (
                      <label key={m} className="flex items-center space-x-2">
                        <Checkbox id={`msk-${m}`} />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <Label>Other</Label>
                    <Input />
                  </div>
                </CardContent>
              </Card>

              {/* MENTAL HEALTH */}
              <Card>
                <CardHeader>
                  <CardTitle>Mental Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      "Angry",
                      "Depressed",
                      "Uncooperative",
                      "Hostile",
                      "Panic",
                      "Flat affect",
                      "Anxious",
                      "Phobia",
                      "Agitated",
                      "Obsessive/Compulsive",
                      "Tics",
                      "Spasms",
                      "Mood swings",
                      "Depressive feeling reported or observed",
                      "None of above",
                    ].map((mh) => (
                      <label key={mh} className="flex items-center space-x-2">
                        <Checkbox id={`mh-${mh}`} />
                        <span>{mh}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SKIN */}
              <Card>
                <CardHeader>
                  <CardTitle>Skin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Color</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Normal", "Pale", "Red", "Irritation", "Rash"].map((c) => (
                        <label key={c} className="flex items-center space-x-2">
                          <Checkbox id={`skin-${c}`} />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Skin Intact</Label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <RadioGroupItem value="no" />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label>Pressure Ulcers</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center space-x-2">
                          <Label>Stage {s}</Label>
                          <Input type="number" placeholder="Count" className="w-20" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Location of ulcers</Label>
                    <Textarea rows={2} />
                  </div>

                  <div>
                    <Label>Surgical or other wounds (describe location, size, nature)</Label>
                    <Textarea rows={3} />
                  </div>
                </CardContent>
              </Card>

              {/* MOBILITY & TRANSFERS */}
              <Card>
                <CardHeader>
                  <CardTitle>Mobility & Transfers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Mobility</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "Dependent",
                          "Independent",
                          "Assist",
                          "Stand-by",
                          "One person assist",
                          "Two person assist with transfer",
                        ].map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Uses ___ to aid in ambulating</Label>
                    <Input />
                  </div>
                  <div>
                    <Label>Uses ___ to aid in transfer</Label>
                    <Input />
                  </div>
                </CardContent>
              </Card>

              {/* ADLs */}
              {[
                "Bathing",
                "Personal Hygiene (hair, nails, skin, oral care)",
                "Toileting (bladder, bowel routine, ability to access toilet)",
                "Dressing",
                "Eating and Drinking",
              ].map((label) => (
                <Card key={label}>
                  <CardHeader>
                    <CardTitle>{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {["Dependent", "Independent", "Assist", "Cue"].map((level) => (
                        <label key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                    {label.includes("Toileting") && (
                      <div className="mt-4 space-y-2">
                        <label>
                          <Checkbox />
                          <span className="ml-2">Incontinent bladder</span>
                        </label>
                        <label>
                          <Checkbox />
                          <span className="ml-2">Incontinent bowel</span>
                        </label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* HEALTH MAINTENANCE NEEDS */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Maintenance Needs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    "Reinforce diet education",
                    "Supervision of blood sugar monitoring",
                    "Routine care of prosthetic/orthotic device",
                    "Education on medical equipment use or maintenance",
                    "Referral to physician",
                    "Other health education needed",
                  ].map((need) => (
                    <label key={need} className="flex items-center space-x-2">
                      <Checkbox />
                      <span>{need}</span>
                    </label>
                  ))}
                  <Textarea rows={2} placeholder="Other needs or notes" />
                </CardContent>
              </Card>

              {/* GENERAL PHYSICAL CONDITION */}
              <Card>
                <CardHeader>
                  <CardTitle>General Physical Condition</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup defaultValue="stable">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="improving" />
                      <Label>Improving</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="stable" />
                      <Label>Stable</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deteriorating" />
                      <Label>Deteriorating</Label>
                    </div>
                  </RadioGroup>
                  <Input placeholder="Other" className="mt-2" />
                </CardContent>
              </Card>

              {/* MEDICATION MANAGEMENT */}
              <Card>
                <CardHeader>
                  <CardTitle>Medication Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current Medications (attach additional pages if necessary)</Label>
                    <Textarea rows={4} />
                  </div>
                  <div>
                    <Label>Medication Administration</Label>
                    <div className="space-y-2">
                      {[
                        "Able to independently take the correct medications at the correct times",
                        "Able to take medications at the correct time if individual doses are prepared in advance by another person and given daily reminders",
                        "Unable to take medication unless administered by someone else",
                        "No medications prescribed",
                      ].map((opt) => (
                        <label key={opt} className="flex items-start space-x-2">
                          <RadioGroupItem value={opt} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <Input placeholder="Other" />
                </CardContent>
              </Card>

              {/* NURSE MONITOR VISIT */}
              <Card>
                <CardHeader>
                  <CardTitle>Nurse Monitor Visit</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "initial",
                        "monthly",
                        "45 day",
                        "3 month",
                        "4 month",
                        "annual assessment",
                      ].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label className="mt-4 block">Activities of Visit</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Developed Caregiver Support Plan",
                      "Provided Information and Training to Caregiver",
                      "Reviewed Caregiver Support Plan",
                      "Assessed/Monitored Caregiver",
                      "Assessed/Monitored Participant",
                    ].map((act) => (
                      <label key={act} className="flex items-center space-x-2">
                        <Checkbox />
                        <span>{act}</span>
                      </label>
                    ))}
                  </div>

                  <Label className="mt-4 block">Caregiver Names</Label>
                  <Textarea rows={2} placeholder="List all caregivers" />
                </CardContent>
              </Card>

              {/* SIGNATURES */}
              <Card>
                <CardHeader>
                  <CardTitle>Signatures</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>RN Name (Print)</Label>
                    <Input />
                    <Label>RN Signature</Label>
                    <Input />
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>Participant / Guardian Name</Label>
                    <Input />
                    <Label>Signature</Label>
                    <Input />
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                </CardContent>
              </Card>

              {/* DISCLAIMERS */}
              <Card>
                <CardHeader>
                  <CardTitle>Disclaimers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>MANDATED REPORTING:</strong> Any suspicion of abuse,
                    neglect, or exploitation must be immediately reported to
                    Adult Protective Services at 1-800-917-7383.
                  </p>
                  <p>
                    <strong>Case Manager Contact:</strong> Immediately contact
                    your Case Manager to report any health and safety concerns.
                    This form must be submitted within 10 days of assessment
                    completion.
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
