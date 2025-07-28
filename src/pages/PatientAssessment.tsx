"use client";

import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Printer, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- Reusable Components ---
function FormCheckboxGroup({ label, options, selectedValues, onValueChange, className = "" }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className={`grid gap-2 mt-1 ${className}`}>
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedValues.includes(option.id)}
              onCheckedChange={(checked) => onValueChange(option.id, checked)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function FormRadioGroup({ label, options, selectedValue, onValueChange, className = "" }) {
  return (
    <div>
      {label && <Label>{label}</Label>}
      <RadioGroup value={selectedValue} onValueChange={onValueChange} className={`mt-1 ${className}`}>
        {options.map((option) => (
          <label key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} />
            <span>{option.label}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

// --- Static Data Definitions ---
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

const dietOptions = [
  { id: "regular", label: "Regular" },
  { id: "low-salt", label: "Low Salt" },
  { id: "puree-chopped", label: "Puree/Chopped" },
  { id: "diabetic-no-concentrated-sweets", label: "Diabetic/No Concentrated Sweets" },
  { id: "renal", label: "Renal" },
  { id: "other", label: "Other" },
];

const respiratoryFindingsOptions = [
  { id: "normal-limits", label: "Within Normal Limits" },
  { id: "cough", label: "Cough" },
  { id: "wheezing", label: "Wheezing" },
  { id: "other", label: "Other" },
];

const shortnessOfBreathOptions = [
  { id: "never", label: "Never short of breath" },
  { id: "walking-stairs", label: "When walking >20 ft or climbing stairs" },
  { id: "moderate-exertion", label: "With moderate exertion (dressing, commode, walking <20 ft)" },
  { id: "minimal-exertion", label: "With minimal exertion (eating, talking)" },
  { id: "at-rest", label: "At rest" },
];

const respiratoryTreatmentOptions = [
  { id: "oxygen", label: "Oxygen (intermittent or continuous)" },
  { id: "aerosol-nebulizer", label: "Aerosol or nebulizer treatments" },
  { id: "ventilator", label: "Ventilator (intermittent or continuous)" },
  { id: "cpap-bipap", label: "CPAP or BIPAP" },
  { id: "none", label: "None" },
];

const painFrequencyOptions = [
  { id: "no-pain", label: "No pain or pain does not interfere with movement" },
  { id: "less-often-daily", label: "Less often than daily" },
  { id: "daily-not-constant", label: "Daily, but not constant" },
  { id: "all-the-time", label: "All the time" },
];

const painIntensityOptions = [
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

const genitourinaryOptions = [
  { id: "pain-burning", label: "Pain/Burning" },
  { id: "discharge", label: "Discharge" },
  { id: "distention-retention", label: "Distention/Retention" },
  { id: "hesitancy", label: "Hesitancy" },
  { id: "hematuria", label: "Hematuria" },
];

const rhythmOptions = [
  { id: "regular", label: "Regular" },
  { id: "irregular", label: "Irregular" },
];

const edemaOptions = [
  { id: "rue-non-pitting", label: "RUE: Non-pitting" },
  { id: "rue-pitting", label: "RUE: Pitting" },
  { id: "lue-non-pitting", label: "LUE: Non-pitting" },
  { id: "lue-pitting", label: "LUE: Pitting" },
  { id: "rle-non-pitting", label: "RLE: Non-pitting" },
  { id: "rle-pitting", label: "RLE: Pitting" },
  { id: "lle-non-pitting", label: "LLE: Non-pitting" },
  { id: "lle-pitting", label: "LLE: Pitting" },
];

const gastrointestinalOptions = [
  { id: "diarrhea", label: "Diarrhea" },
  { id: "constipation", label: "Constipation" },
  { id: "nausea", label: "Nausea" },
  { id: "vomiting", label: "Vomiting" },
  { id: "anorexia", label: "Anorexia" },
];

const bowelIncontinenceFrequencyOptions = [
  { id: "rarely-never", label: "Very rarely or never incontinent of bowel" },
  { id: "less-once-week", label: "Less than once per week" },
  { id: "one-three-week", label: "One to three times per week" },
  { id: "four-six-week", label: "Four to six times per week" },
  { id: "daily", label: "On a daily basis" },
  { id: "more-once-daily", label: "More than once daily" },
];

const cognitiveFunctioningOptions = [
  { id: "alert-oriented", label: "Alert/oriented, able to focus and shift attention, comprehends and recalls task directions independently" },
  { id: "prompting-stress", label: "Requires prompting (cueing, repetition, reminders) only under stressful or unfamiliar situations" },
  { id: "assistance-specific", label: "Requires assistance, direction in specific situation, requires low stimulus environment due to distractibility" },
  { id: "considerable-assistance", label: "Requires considerable assistance in routine situations. Is not alert and oriented or is unable to shift attention and recall more than half the time." },
  { id: "totally-dependent", label: "Totally dependent due to coma or delirium" },
];

const speechOptions = [
  { id: "clear-understandable", label: "Clear and understandable" },
  { id: "slurred", label: "Slurred" },
  { id: "garbled", label: "Garbled" },
  { id: "aphasic", label: "Aphasic" },
  { id: "unable-speak", label: "Unable to speak" },
];

const pupilOptions = [
  { id: "equal", label: "Equal" },
  { id: "unequal", label: "Unequal" },
];

const movementOptions = [
  { id: "coordinated", label: "Coordinated" },
  { id: "uncoordinated", label: "Uncoordinated" },
];

const extremityOptions = [
  { id: "r-upper-strong", label: "Right upper Strong" },
  { id: "r-upper-weak", label: "Right upper Weak" },
  { id: "r-upper-tremors", label: "Right upper Tremors" },
  { id: "r-upper-no-movement", label: "Right upper No movement" },
  { id: "l-upper-strong", label: "Left upper Strong" },
  { id: "l-upper-weak", label: "Left upper Weak" },
  { id: "l-upper-tremors", label: "Left upper Tremors" },
  { id: "l-upper-no-movement", label: "Left upper No movement" },
  { id: "r-lower-strong", label: "Right lower Strong" },
  { id: "r-lower-weak", label: "Right lower Weak" },
  { id: "r-lower-tremors", label: "Right lower Tremors" },
  { id: "r-lower-no-movement", label: "Right lower No movement" },
  { id: "l-lower-strong", label: "Left lower Strong" },
  { id: "l-lower-weak", label: "Left lower Weak" },
  { id: "l-lower-tremors", label: "Left lower Tremors" },
  { id: "l-lower-no-movement", label: "Left lower No movement" },
];

const visionOptions = [
  { id: "normal", label: "Normal vision in most situations; can see medication labels, newsprint" },
  { id: "partially-impaired", label: "Partially impaired; can't see medication labels, but can see objects in path; can count fingers at arms length" },
  { id: "severely-impaired", label: "Severely impaired; cannot locate objects without hearing or touching or person non-responsive" },
];

const hearingOptions = [
  { id: "normal", label: "Normal hearing in most situations, can hear normal conversational tone" },
  { id: "partially-impaired", label: "Partially impaired; can't hear normal conversational tone" },
  { id: "severely-impaired", label: "Severely impaired; cannot hear even with an elevated tone" },
];

const behaviorOptions = [
  { id: "indecisiveness", label: "Indecisiveness" },
  { id: "diminished-interest", label: "Diminished interest in most activities" },
  { id: "sleep-disturbances", label: "Sleep disturbances" },
  { id: "change-appetite-weight", label: "Recent change in appetite or weight" },
  { id: "agitation", label: "Agitation" },
  { id: "suicide-attempt", label: "A suicide attempt" },
  { id: "none-behaviors", label: "None of the above behaviors observed or reported" },
];

const yesNoOptions = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];

const musculoskeletalOptions = [
  { id: "normal-limits", label: "Within Normal limits" },
  { id: "deformity", label: "Deformity" },
  { id: "unsteady-gait", label: "Unsteady Gait" },
  { id: "contracture", label: "Contracture" },
  { id: "poor-endurance", label: "Poor endurance" },
  { id: "impaired-rom", label: "Impaired ROM" },
  { id: "altered-balance", label: "Altered Balance" },
  { id: "poor-coordination", label: "Poor coordination" },
  { id: "weakness", label: "Weakness" },
];

const mentalHealthOptions = [
  { id: "angry", label: "Angry" },
  { id: "depressed", label: "Depressed" },
  { id: "uncooperative", label: "Uncooperative" },
  { id: "hostile", label: "Hostile" },
  { id: "panic", label: "Panic" },
  { id: "flat-affect", label: "Flat affect" },
  { id: "anxious", label: "Anxious" },
  { id: "phobia", label: "Phobia" },
  { id: "agitated", label: "Agitated" },
  { id: "obsessive-compulsive", label: "Obsessive/Compulsive" },
  { id: "tics", label: "Tics" },
  { id: "spasms", label: "Spasms" },
  { id: "mood-swings", label: "Mood swings" },
  { id: "depressive-feeling", label: "Depressive feeling reported or observed" },
  { id: "none-mental-health", label: "None of above" },
];

const skinColorOptions = [
  { id: "normal", label: "Normal" },
  { id: "pale", label: "Pale" },
  { id: "red", label: "Red" },
  { id: "irritation", label: "Irritation" },
  { id: "rash", label: "Rash" },
];

const mobilityOptions = [
  { id: "dependent", label: "Dependent" },
  { id: "independent", label: "Independent" },
  { id: "assist", label: "Assist" },
  { id: "stand-by", label: "Stand-by" },
  { id: "one-person-assist", label: "One person assist" },
  { id: "two-person-assist", label: "Two person assist with transfer" },
];

const adlLevels = [
  { id: "dependent", label: "Dependent" },
  { id: "independent", label: "Independent" },
  { id: "assist", label: "Assist" },
  { id: "cue", label: "Cue" },
];

const healthMaintenanceNeedsOptions = [
  { id: "diet-education", label: "Reinforce diet education" },
  { id: "blood-sugar-monitoring", label: "Supervision of blood sugar monitoring" },
  { id: "prosthetic-care", label: "Routine care of prosthetic/orthotic device" },
  { id: "medical-equipment-education", label: "Education on medical equipment use or maintenance" },
  { id: "referral-physician", label: "Referral to physician" },
  { id: "other-health-education", label: "Other health education needed" },
];

const generalPhysicalConditionOptions = [
  { id: "improving", label: "Improving" },
  { id: "stable", label: "Stable" },
  { id: "deteriorating", label: "Deteriorating" },
];

const medicationAdministrationOptions = [
  { id: "independently", label: "Able to independently take the correct medications at the correct times" },
  { id: "prepared-daily-reminders", label: "Able to take medications at the correct time if individual doses are prepared in advance by another person and given daily reminders" },
  { id: "administered-by-someone-else", label: "Unable to take medication unless administered by someone else" },
  { id: "no-medications", label: "No medications prescribed" },
];

const nurseVisitTypes = [
  { id: "initial", label: "initial" },
  { id: "monthly", label: "monthly" },
  { id: "45-day", label: "45 day" },
  { id: "3-month", label: "3 month" },
  { id: "4-month", label: "4 month" },
  { id: "annual-assessment", label: "annual assessment" },
];

const nurseVisitActivities = [
  { id: "developed-caregiver-plan", label: "Developed Caregiver Support Plan" },
  { id: "provided-info-training", label: "Provided Information and Training to Caregiver" },
  { id: "reviewed-caregiver-plan", label: "Reviewed Caregiver Support Plan" },
  { id: "assessed-monitored-caregiver", label: "Assessed/Monitored Caregiver" },
  { id: "assessed-monitored-participant", label: "Assessed/Monitored Participant" },
];

const pressureUlcerCountOptions = [
  { id: "0", label: "0" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4+", label: "4 or more" },
];

export default function PatientAssessment() {
  // --- State Management ---
  const [selectedPatient, setSelectedPatient] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [assessorName, setAssessorName] = useState("");

  // General Health
  const [temp, setTemp] = useState("");
  const [pulse, setPulse] = useState("");
  const [respiration, setRespiration] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [otherDietDetails, setOtherDietDetails] = useState("");
  const [fluidIntake, setFluidIntake] = useState("");
  const [fluidAmount, setFluidAmount] = useState("");
  const [recentChanges, setRecentChanges] = useState("");

  // Respiratory
  const [selectedRespiratoryFindings, setSelectedRespiratoryFindings] = useState([]);
  const [otherRespiratoryFindings, setOtherRespiratoryFindings] = useState("");
  const [shortnessOfBreath, setShortnessOfBreath] = useState("");
  const [selectedRespiratoryTreatments, setSelectedRespiratoryTreatments] = useState([]);

  // Pain
  const [painFrequency, setPainFrequency] = useState("");
  const [painSites, setPainSites] = useState("");
  const [painIntensity, setPainIntensity] = useState("");
  const [painAffectsLife, setPainAffectsLife] = useState(false);
  const [painCause, setPainCause] = useState("");
  const [painTreatment, setPainTreatment] = useState("");

  // Genitourinary
  const [catheter, setCatheter] = useState(false);
  const [urineFrequency, setUrineFrequency] = useState("");
  const [selectedGenitourinaryIssues, setSelectedGenitourinaryIssues] = useState([]);
  const [otherGenitourinary, setOtherGenitourinary] = useState("");
  const [utiTreated, setUtiTreated] = useState(false);

  // Cardiovascular
  const [bpPulseNormal, setBpPulseNormal] = useState(false);
  const [rhythm, setRhythm] = useState("");
  const [selectedEdema, setSelectedEdema] = useState([]);
  const [otherCardiovascular, setOtherCardiovascular] = useState("");

  // Gastrointestinal
  const [bowelsFrequency, setBowelsFrequency] = useState("");
  const [selectedGastrointestinalIssues, setSelectedGastrointestinalIssues] = useState([]);
  const [swallowingIssues, setSwallowingIssues] = useState("");
  const [painGastrointestinal, setPainGastrointestinal] = useState("");
  const [otherGastrointestinal, setOtherGastrointestinal] = useState("");
  const [bowelIncontinenceFrequency, setBowelIncontinenceFrequency] = useState("");
  const [ostomyBowelElimination, setOstomyBowelElimination] = useState(false);

  // Neurological
  const [cognitiveFunctioning, setCognitiveFunctioning] = useState("");
  const [selectedSpeechIssues, setSelectedSpeechIssues] = useState([]);
  const [pupils, setPupils] = useState("");
  const [movements, setMovements] = useState("");
  const [selectedExtremities, setSelectedExtremities] = useState([]);

  // Sensory
  const [vision, setVision] = useState("");
  const [hearing, setHearing] = useState("");

  // Psychosocial
  const [selectedBehaviors, setSelectedBehaviors] = useState([]);
  const [psychologicalCounseling, setPsychologicalCounseling] = useState("");

  // Musculoskeletal
  const [selectedMusculoskeletalIssues, setSelectedMusculoskeletalIssues] = useState([]);
  const [otherMusculoskeletal, setOtherMusculoskeletal] = useState("");

  // Mental Health
  const [selectedMentalHealthIssues, setSelectedMentalHealthIssues] = useState([]);

  // Skin
  const [selectedSkinColors, setSelectedSkinColors] = useState([]);
  const [skinIntact, setSkinIntact] = useState("");
  const [pressureUlcersStage1, setPressureUlcersStage1] = useState("0");
  const [pressureUlcersStage2, setPressureUlcersStage2] = useState("0");
  const [pressureUlcersStage3, setPressureUlcersStage3] = useState("0");
  const [pressureUlcersStage4, setPressureUlcersStage4] = useState("0");
  const [ulcerLocations, setUlcerLocations] = useState("");
  const [surgicalWounds, setSurgicalWounds] = useState("");

  // Mobility & Transfers
  const [mobility, setMobility] = useState("");
  const [ambulatingAid, setAmbulatingAid] = useState("");
  const [transferAid, setTransferAid] = useState("");

  // ADLs
  const [bathingLevel, setBathingLevel] = useState("");
  const [personalHygieneLevel, setPersonalHygieneLevel] = useState("");
  const [toiletingLevel, setToiletingLevel] = useState("");
  const [toiletingIncontinentBladder, setToiletingIncontinentBladder] = useState(false);
  const [toiletingIncontinentBowel, setToiletingIncontinentBowel] = useState(false);
  const [dressingLevel, setDressingLevel] = useState("");
  const [eatingDrinkingLevel, setEatingDrinkingLevel] = useState("");

  // Health Maintenance Needs
  const [selectedHealthMaintenanceNeeds, setSelectedHealthMaintenanceNeeds] = useState([]);
  const [otherHealthNeedsNotes, setOtherHealthNeedsNotes] = useState("");

  // General Physical Condition
  const [generalPhysicalCondition, setGeneralPhysicalCondition] = useState("stable");
  const [otherPhysicalCondition, setOtherPhysicalCondition] = useState("");

  // Medication Management
  const [medicationAdministration, setMedicationAdministration] = useState("");
  const [otherMedicationManagement, setOtherMedicationManagement] = useState("");
  const [medications, setMedications] = useState([
    { id: 1, medication: "", dose: "", frequency: "", physician: "", purpose: "" },
  ]);

  // Nurse Monitor Visit
  const [nurseVisitType, setNurseVisitType] = useState("");
  const [selectedNurseVisitActivities, setSelectedNurseVisitActivities] = useState([]);
  const [caregiverNames, setCaregiverNames] = useState("");

  // Signatures
  const [rnName, setRnName] = useState("");
  const [rnSignature, setRnSignature] = useState("");
  const [rnDate, setRnDate] = useState("");
  const [participantGuardianName, setParticipantGuardianName] = useState("");
  const [participantGuardianSignature, setParticipantGuardianSignature] = useState("");
  const [participantGuardianDate, setParticipantGuardianDate] = useState("");

  // --- Handlers for Checkbox/Radio Groups ---
  const handleCheckboxChange = (setter) => (id, checked) => {
    setter((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  const handleRadioChange = (setter) => (value) => {
    setter(value);
  };

  // --- Medication Management Handlers ---
  const handleMedicationChange = (id, field, value) => {
    setMedications((prevMedications) =>
      prevMedications.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const addMedication = () => {
    setMedications((prevMedications) => [
      ...prevMedications,
      {
        id: prevMedications.length > 0 ? Math.max(...prevMedications.map((m) => m.id)) + 1 : 1,
        medication: "",
        dose: "",
        frequency: "",
        physician: "",
        purpose: "",
      },
    ]);
  };

  const removeMedication = (id) => {
    setMedications((prevMedications) => prevMedications.filter((med) => med.id !== id));
  };

  // --- Form Submission ---
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      selectedPatient,
      assessmentType,
      assessmentDate,
      assessorName,
      temp,
      pulse,
      respiration,
      bloodPressure,
      weight,
      selectedDiets,
      otherDietDetails: selectedDiets.includes("other") ? otherDietDetails : "",
      fluidIntake,
      fluidAmount: fluidIntake === "restricted" ? fluidAmount : "",
      recentChanges,
      selectedRespiratoryFindings,
      otherRespiratoryFindings: selectedRespiratoryFindings.includes("other") ? otherRespiratoryFindings : "",
      shortnessOfBreath,
      selectedRespiratoryTreatments,
      painFrequency,
      painSites,
      painIntensity,
      painAffectsLife,
      painCause,
      painTreatment,
      catheter,
      urineFrequency,
      selectedGenitourinaryIssues,
      otherGenitourinary,
      utiTreated,
      bpPulseNormal,
      rhythm,
      selectedEdema,
      otherCardiovascular,
      bowelsFrequency,
      selectedGastrointestinalIssues,
      swallowingIssues,
      painGastrointestinal,
      otherGastrointestinal,
      bowelIncontinenceFrequency,
      ostomyBowelElimination,
      cognitiveFunctioning,
      selectedSpeechIssues,
      pupils,
      movements,
      selectedExtremities,
      vision,
      hearing,
      selectedBehaviors,
      psychologicalCounseling,
      selectedMusculoskeletalIssues,
      otherMusculoskeletal,
      selectedMentalHealthIssues,
      selectedSkinColors,
      skinIntact,
      pressureUlcers: {
        stage1: pressureUlcersStage1,
        stage2: pressureUlcersStage2,
        stage3: pressureUlcersStage3,
        stage4: pressureUlcersStage4,
      },
      ulcerLocations,
      surgicalWounds,
      mobility,
      ambulatingAid,
      transferAid,
      bathingLevel,
      personalHygieneLevel,
      toiletingLevel,
      toiletingIncontinentBladder,
      toiletingIncontinentBowel,
      dressingLevel,
      eatingDrinkingLevel,
      selectedHealthMaintenanceNeeds,
      otherHealthNeedsNotes,
      generalPhysicalCondition,
      otherPhysicalCondition,
      medications,
      medicationAdministration,
      otherMedicationManagement,
      nurseVisitType,
      selectedNurseVisitActivities,
      caregiverNames,
      rnName,
      rnSignature,
      rnDate,
      participantGuardianName,
      participantGuardianSignature,
      participantGuardianDate,
    };
    console.log("Collected Form Data:", formData);
    alert("Form data logged to console. In a real app, this would be submitted.");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AppHeader className="print:hidden" />
          <SidebarInset>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:p-4">
              <style jsx global>{`
                @media print {
                  body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                  }
                  main {
                    overflow: visible !important;
                  }
                  .space-y-6 > * {
                    break-inside: avoid;
                  }
                }
              `}</style>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">
                    DHMH 4658 A (N-PA) – Waiver Participant Assessment
                  </h1>
                  <Button variant="outline" type="button" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print Form
                  </Button>
                </div>

                {/* Patient Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-6">
                    <div className="space-y-1">
                      <Label htmlFor="patient-select">Select Patient</Label>
                      <Select value={selectedPatient} onValueChange={setSelectedPatient} id="patient-select">
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
                      <Label htmlFor="assessment-type-select">Assessment Type</Label>
                      <Select value={assessmentType} onValueChange={setAssessmentType} id="assessment-type-select">
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
                      <Label htmlFor="assessment-date">Assessment Date</Label>
                      <Input id="assessment-date" type="date" value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="assessor-name">Assessor Name</Label>
                      <Input id="assessor-name" placeholder="Your name" value={assessorName} onChange={(e) => setAssessorName(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                {/* General Health and Respiratory Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  {/* GENERAL HEALTH */}
                  <Card>
                    <CardHeader>
                      <CardTitle>General Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="temp">Temp (°F)</Label>
                          <Input id="temp" value={temp} onChange={(e) => setTemp(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="pulse">Pulse (bpm)</Label>
                          <Input id="pulse" value={pulse} onChange={(e) => setPulse(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="respiration">Respiration (rpm)</Label>
                          <Input id="respiration" value={respiration} onChange={(e) => setRespiration(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="bp">Blood Pressure</Label>
                          <Input id="bp" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="weight">Weight (lbs)</Label>
                          <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        </div>
                      </div>

                      <FormCheckboxGroup
                        label="Diet / Nutrition"
                        options={dietOptions}
                        selectedValues={selectedDiets}
                        onValueChange={handleCheckboxChange(setSelectedDiets)}
                        className="grid-cols-2 md:grid-cols-2"
                      />
                      {selectedDiets.includes("other") && (
                        <Input
                          placeholder="Other diet details"
                          className="mt-2"
                          value={otherDietDetails}
                          onChange={(e) => setOtherDietDetails(e.target.value)}
                        />
                      )}

                      <div>
                        <Label>Fluid</Label>
                        <RadioGroup value={fluidIntake} onValueChange={setFluidIntake} className="flex items-center gap-4 mt-1">
                          <label className="flex items-center space-x-2">
                            <RadioGroupItem value="unlimited" />
                            <span>Unlimited</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <RadioGroupItem value="restricted" />
                            <span>Restricted</span>
                          </label>
                          {fluidIntake === "restricted" && (
                            <Input placeholder="Amount (mL)" className="w-32" value={fluidAmount} onChange={(e) => setFluidAmount(e.target.value)} />
                          )}
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="recent-changes">
                          Identify any changes over the past month (Diagnosis,
                          Medications, Health Status, Hospitalization, Falls,
                          Incidents, Other)
                        </Label>
                        <Textarea id="recent-changes" rows={3} value={recentChanges} onChange={(e) => setRecentChanges(e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* RESPIRATORY */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Respiratory</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormCheckboxGroup
                        label="Findings"
                        options={respiratoryFindingsOptions}
                        selectedValues={selectedRespiratoryFindings}
                        onValueChange={handleCheckboxChange(setSelectedRespiratoryFindings)}
                        className="grid-cols-2 md:grid-cols-2"
                      />
                      {selectedRespiratoryFindings.includes("other") && (
                        <Input
                          placeholder="Other findings"
                          className="mt-2"
                          value={otherRespiratoryFindings}
                          onChange={(e) => setOtherRespiratoryFindings(e.target.value)}
                        />
                      )}

                      <div>
                        <Label htmlFor="shortness-of-breath">Shortness of Breath</Label>
                        <Select value={shortnessOfBreath} onValueChange={setShortnessOfBreath} id="shortness-of-breath">
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {shortnessOfBreathOptions.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormCheckboxGroup
                        label="Respiratory treatments at home"
                        options={respiratoryTreatmentOptions}
                        selectedValues={selectedRespiratoryTreatments}
                        onValueChange={handleCheckboxChange(setSelectedRespiratoryTreatments)}
                        className="grid-cols-1 md:grid-cols-2"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Pain and Genitourinary Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  {/* PAIN */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Pain / Discomfort</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="pain-frequency">Pain Frequency</Label>
                        <Select value={painFrequency} onValueChange={setPainFrequency} id="pain-frequency">
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {painFrequencyOptions.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pain-sites">Pain Sites</Label>
                        <Textarea id="pain-sites" rows={2} value={painSites} onChange={(e) => setPainSites(e.target.value)} />
                      </div>
                      <FormRadioGroup
                        label="Pain Intensity"
                        options={painIntensityOptions}
                        selectedValue={painIntensity}
                        onValueChange={handleRadioChange(setPainIntensity)}
                        className="flex items-center gap-4"
                      />
                      <div>
                        <label htmlFor="pain-affects-life" className="flex items-center space-x-2">
                          <Checkbox
                            id="pain-affects-life"
                            checked={painAffectsLife}
                            onCheckedChange={setPainAffectsLife}
                          />
                          <span>
                            Person is experiencing pain that is not easily relieved,
                            occurs at least daily, and affects the ability to sleep,
                            appetite, physical or emotional energy, concentration,
                            personal relationships, emotions, or ability or desire to
                            perform physical activity
                          </span>
                        </label>
                      </div>
                      <div>
                        <Label htmlFor="pain-cause">Cause (if known)</Label>
                        <Input id="pain-cause" value={painCause} onChange={(e) => setPainCause(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="pain-treatment">Treatment</Label>
                        <Input id="pain-treatment" value={painTreatment} onChange={(e) => setPainTreatment(e.target.value)} />
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
                        <label htmlFor="catheter" className="flex items-center space-x-2">
                          <Checkbox id="catheter" checked={catheter} onCheckedChange={setCatheter} />
                          <span>Catheter</span>
                        </label>
                      </div>
                      <div>
                        <Label htmlFor="urine-frequency">Urine Frequency</Label>
                        <Input id="urine-frequency" value={urineFrequency} onChange={(e) => setUrineFrequency(e.target.value)} />
                      </div>
                      <FormCheckboxGroup
                        label=""
                        options={genitourinaryOptions}
                        selectedValues={selectedGenitourinaryIssues}
                        onValueChange={handleCheckboxChange(setSelectedGenitourinaryIssues)}
                        className="grid-cols-2 md:grid-cols-2"
                      />
                      <div>
                        <Label htmlFor="other-genitourinary">Other</Label>
                        <Input id="other-genitourinary" value={otherGenitourinary} onChange={(e) => setOtherGenitourinary(e.target.value)} />
                      </div>
                      <div>
                        <label htmlFor="uti-treated" className="flex items-center space-x-2">
                          <Checkbox id="uti-treated" checked={utiTreated} onCheckedChange={setUtiTreated} />
                          <span>Person has been treated for a UTI in the past month</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Cardiovascular and Gastrointestinal Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  {/* CARDIOVASCULAR */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Cardiovascular</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label htmlFor="bp-pulse-normal" className="flex items-center space-x-2">
                          <Checkbox id="bp-pulse-normal" checked={bpPulseNormal} onCheckedChange={setBpPulseNormal} />
                          <span>BP and Pulse within normal limits</span>
                        </label>
                      </div>
                      <FormRadioGroup
                        label="Rhythm"
                        options={rhythmOptions}
                        selectedValue={rhythm}
                        onValueChange={handleRadioChange(setRhythm)}
                        className="flex items-center gap-4"
                      />
                      <FormCheckboxGroup
                        label="Edema"
                        options={edemaOptions}
                        selectedValues={selectedEdema}
                        onValueChange={handleCheckboxChange(setSelectedEdema)}
                        className="grid-cols-1 md:grid-cols-2"
                      />
                      <div>
                        <Label htmlFor="other-cardiovascular">Other</Label>
                        <Input id="other-cardiovascular" value={otherCardiovascular} onChange={(e) => setOtherCardiovascular(e.target.value)} />
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
                        <Label htmlFor="bowels-frequency">Bowels: frequency</Label>
                        <Input id="bowels-frequency" value={bowelsFrequency} onChange={(e) => setBowelsFrequency(e.target.value)} />
                      </div>
                      <FormCheckboxGroup
                        label=""
                        options={gastrointestinalOptions}
                        selectedValues={selectedGastrointestinalIssues}
                        onValueChange={handleCheckboxChange(setSelectedGastrointestinalIssues)}
                        className="grid-cols-2 md:grid-cols-2"
                      />
                      <div>
                        <Label htmlFor="swallowing-issues">Swallowing issues</Label>
                        <Input id="swallowing-issues" value={swallowingIssues} onChange={(e) => setSwallowingIssues(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="pain-gastrointestinal">Pain</Label>
                        <Input id="pain-gastrointestinal" placeholder="abdominal / epigastric" value={painGastrointestinal} onChange={(e) => setPainGastrointestinal(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="other-gastrointestinal">Other</Label>
                        <Input id="other-gastrointestinal" value={otherGastrointestinal} onChange={(e) => setOtherGastrointestinal(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="bowel-incontinence-frequency">Bowel incontinence frequency</Label>
                        <Select value={bowelIncontinenceFrequency} onValueChange={setBowelIncontinenceFrequency} id="bowel-incontinence-frequency">
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {bowelIncontinenceFrequencyOptions.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="ostomy-bowel-elimination" className="flex items-center space-x-2">
                          <Checkbox id="ostomy-bowel-elimination" checked={ostomyBowelElimination} onCheckedChange={setOstomyBowelElimination} />
                          <span>Person has ostomy for bowel elimination</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Neurological (Full Width) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Neurological</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormRadioGroup
                      label="Cognitive functioning"
                      options={cognitiveFunctioningOptions}
                      selectedValue={cognitiveFunctioning}
                      onValueChange={handleRadioChange(setCognitiveFunctioning)}
                      className="space-y-1"
                    />
                    <FormCheckboxGroup
                      label="Speech"
                      options={speechOptions}
                      selectedValues={selectedSpeechIssues}
                      onValueChange={handleCheckboxChange(setSelectedSpeechIssues)}
                      className="grid-cols-2 md:grid-cols-3"
                    />
                    <FormRadioGroup
                      label="Pupils"
                      options={pupilOptions}
                      selectedValue={pupils}
                      onValueChange={handleRadioChange(setPupils)}
                      className="flex items-center gap-4"
                    />
                    <FormRadioGroup
                      label="Movements"
                      options={movementOptions}
                      selectedValue={movements}
                      onValueChange={handleRadioChange(setMovements)}
                      className="flex items-center gap-4"
                    />
                    <FormCheckboxGroup
                      label="Extremities"
                      options={extremityOptions}
                      selectedValues={selectedExtremities}
                      onValueChange={handleCheckboxChange(setSelectedExtremities)}
                      className="grid-cols-2 md:grid-cols-3"
                    />
                  </CardContent>
                </Card>

                {/* Sensory (Full Width) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sensory</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormRadioGroup
                      label="Vision with corrective lenses"
                      options={visionOptions}
                      selectedValue={vision}
                      onValueChange={handleRadioChange(setVision)}
                      className="space-y-1"
                    />
                    <FormRadioGroup
                      label="Hearing with corrective device"
                      options={hearingOptions}
                      selectedValue={hearing}
                      onValueChange={handleRadioChange(setHearing)}
                      className="space-y-1"
                    />
                  </CardContent>
                </Card>

                {/* Psychosocial and Musculoskeletal Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  {/* PSYCHOSOCIAL */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Psychosocial</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormCheckboxGroup
                        label="Behaviors reported or observed"
                        options={behaviorOptions}
                        selectedValues={selectedBehaviors}
                        onValueChange={handleCheckboxChange(setSelectedBehaviors)}
                        className="grid-cols-1 md:grid-cols-2"
                      />
                      <FormRadioGroup
                        label="Is this person receiving psychological counseling?"
                        options={yesNoOptions}
                        selectedValue={psychologicalCounseling}
                        onValueChange={handleRadioChange(setPsychologicalCounseling)}
                        className="flex items-center gap-4"
                      />
                    </CardContent>
                  </Card>

                  {/* MUSCULOSKELETAL */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Musculoskeletal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormCheckboxGroup
                        label=""
                        options={musculoskeletalOptions}
                        selectedValues={selectedMusculoskeletalIssues}
                        onValueChange={handleCheckboxChange(setSelectedMusculoskeletalIssues)}
                        className="grid-cols-2 md:grid-cols-2"
                      />
                      <div>
                        <Label htmlFor="other-musculoskeletal">Other</Label>
                        <Input id="other-musculoskeletal" value={otherMusculoskeletal} onChange={(e) => setOtherMusculoskeletal(e.target.value)} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mental Health and Health Maintenance Needs Side-by-Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  {/* MENTAL HEALTH */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Mental Health</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormCheckboxGroup
                        label=""
                        options={mentalHealthOptions}
                        selectedValues={selectedMentalHealthIssues}
                        onValueChange={handleCheckboxChange(setSelectedMentalHealthIssues)}
                        className="grid-cols-2 md:grid-cols-2"
                      />
                    </CardContent>
                  </Card>

                  {/* HEALTH MAINTENANCE NEEDS */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Health Maintenance Needs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <FormCheckboxGroup
                        label=""
                        options={healthMaintenanceNeedsOptions}
                        selectedValues={selectedHealthMaintenanceNeeds}
                        onValueChange={handleCheckboxChange(setSelectedHealthMaintenanceNeeds)}
                        className="grid-cols-1 md:grid-cols-2"
                      />
                      <Textarea rows={2} placeholder="Other needs or notes" value={otherHealthNeedsNotes} onChange={(e) => setOtherHealthNeedsNotes(e.target.value)} />
                    </CardContent>
                  </Card>
                </div>

                {/* Skin and Medication Management Side-by-Side */}
                <div className="grid grid-cols-10 gap-x-6 gap-y-8">
                  {/* Skin Card */}
                  <div className="col-span-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Skin</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormCheckboxGroup
                          label="Color"
                          options={skinColorOptions}
                          selectedValues={selectedSkinColors}
                          onValueChange={handleCheckboxChange(setSelectedSkinColors)}
                          className="grid-cols-2 md:grid-cols-3"
                        />
                        <FormRadioGroup
                          label="Skin Intact"
                          options={yesNoOptions}
                          selectedValue={skinIntact}
                          onValueChange={handleRadioChange(setSkinIntact)}
                          className="flex items-center gap-4"
                        />

                        {skinIntact === "no" && (
                          <div className="mt-4">
                            <Label>Number of Pressure Ulcers</Label>
                            <Table className="border mt-2">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[60%]">Pressure Ulcer Stages</TableHead>
                                  <TableHead className="text-center w-[40%]">Number of Pressure Ulcers</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Stage 1: Redness of intact skin; warmth, edema, hardness, or discolored skin may be indicators
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <RadioGroup
                                      value={pressureUlcersStage1}
                                      onValueChange={setPressureUlcersStage1}
                                      className="flex justify-center space-x-4"
                                    >
                                      {pressureUlcerCountOptions.map((opt) => (
                                        <label key={`stage1-${opt.id}`} className="flex items-center space-x-1">
                                          <RadioGroupItem value={opt.id} />
                                          <span>{opt.label}</span>
                                        </label>
                                      ))}
                                    </RadioGroup>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Stage 2: Partial thickness skin loss of epidermis and/or dermis. The ulcer is superficial and appears as an abrasion, blister, or shallow crater.
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <RadioGroup
                                      value={pressureUlcersStage2}
                                      onValueChange={setPressureUlcersStage2}
                                      className="flex justify-center space-x-4"
                                    >
                                      {pressureUlcerCountOptions.map((opt) => (
                                        <label key={`stage2-${opt.id}`} className="flex items-center space-x-1">
                                          <RadioGroupItem value={opt.id} />
                                          <span>{opt.label}</span>
                                        </label>
                                      ))}
                                    </RadioGroup>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Stage 3: Full thickness skin loss; damage or necrosis of subcutaneous tissue; deep crater
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <RadioGroup
                                      value={pressureUlcersStage3}
                                      onValueChange={setPressureUlcersStage3}
                                      className="flex justify-center space-x-4"
                                    >
                                      {pressureUlcerCountOptions.map((opt) => (
                                        <label key={`stage3-${opt.id}`} className="flex items-center space-x-1">
                                          <RadioGroupItem value={opt.id} />
                                          <span>{opt.label}</span>
                                        </label>
                                      ))}
                                    </RadioGroup>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium">
                                    Stage 4: Full thickness skin loss with extensive destruction, tissue necrosis or damage to muscle, bone or supporting structures
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <RadioGroup
                                      value={pressureUlcersStage4}
                                      onValueChange={setPressureUlcersStage4}
                                      className="flex justify-center space-x-4"
                                    >
                                      {pressureUlcerCountOptions.map((opt) => (
                                        <label key={`stage4-${opt.id}`} className="flex items-center space-x-1">
                                          <RadioGroupItem value={opt.id} />
                                          <span>{opt.label}</span>
                                        </label>
                                      ))}
                                    </RadioGroup>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        <div>
                          <Label htmlFor="ulcer-locations">Location of ulcers:</Label>
                          <Textarea id="ulcer-locations" rows={2} value={ulcerLocations} onChange={(e) => setUlcerLocations(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="surgical-wounds">Surgical or other types of wounds (describe location, size and nature of wound)</Label>
                          <Textarea id="surgical-wounds" rows={3} value={surgicalWounds} onChange={(e) => setSurgicalWounds(e.target.value)} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Medication Management Card */}
                  <div className="col-span-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Medication Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Medications subform moved to top */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Current Medications</h3>
                          {medications.map((med) => (
                            <div
                              key={med.id}
                              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start border p-4 rounded-md relative"
                            >
                              <div>
                                <Label htmlFor={`medication-${med.id}`}>Medication</Label>
                                <Input
                                  id={`medication-${med.id}`}
                                  value={med.medication}
                                  onChange={(e) => handleMedicationChange(med.id, "medication", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`dose-${med.id}`}>Dose</Label>
                                <Input
                                  id={`dose-${med.id}`}
                                  value={med.dose}
                                  onChange={(e) => handleMedicationChange(med.id, "dose", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`frequency-${med.id}`}>Frequency</Label>
                                <Input
                                  id={`frequency-${med.id}`}
                                  value={med.frequency}
                                  onChange={(e) => handleMedicationChange(med.id, "frequency", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`physician-${med.id}`}>Physician</Label>
                                <Input
                                  id={`physician-${med.id}`}
                                  value={med.physician}
                                  onChange={(e) => handleMedicationChange(med.id, "physician", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`purpose-${med.id}`}>Purpose</Label>
                                <Textarea
                                  id={`purpose-${med.id}`}
                                  rows={1}
                                  value={med.purpose}
                                  onChange={(e) => handleMedicationChange(med.id, "purpose", e.target.value)}
                                />
                              </div>
                              {medications.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeMedication(med.id)}
                                  className="absolute top-2 right-2"
                                >
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button type="button" onClick={addMedication}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Medication
                          </Button>
                        </div>

                        <hr className="my-4" />

                        <FormRadioGroup
                          label="Medication Administration"
                          options={medicationAdministrationOptions}
                          selectedValue={medicationAdministration}
                          onValueChange={handleRadioChange(setMedicationAdministration)}
                          className="space-y-2"
                        />
                        <Input
                          placeholder="Other"
                          value={otherMedicationManagement}
                          onChange={(e) => setOtherMedicationManagement(e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* MOBILITY & TRANSFERS (Full Width) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mobility & Transfers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="mobility">Mobility</Label>
                      <Select value={mobility} onValueChange={setMobility} id="mobility">
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mobilityOptions.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ambulating-aid">Uses ___ to aid in ambulating</Label>
                      <Input id="ambulating-aid" value={ambulatingAid} onChange={(e) => setAmbulatingAid(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="transfer-aid">Uses ___ to aid in transfer</Label>
                      <Input id="transfer-aid" value={transferAid} onChange={(e) => setTransferAid(e.target.value)} />
                    </div>
                  </CardContent>
                </Card>

                {/* ADLs: Bathing, Personal Hygiene, Toileting (3 in a row) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bathing */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Bathing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormRadioGroup
                        label=""
                        options={adlLevels}
                        selectedValue={bathingLevel}
                        onValueChange={handleRadioChange(setBathingLevel)}
                        className="grid grid-cols-2 gap-4"
                      />
                    </CardContent>
                  </Card>

                  {/* Personal Hygiene */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Hygiene (hair, nails, skin, oral care)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormRadioGroup
                        label=""
                        options={adlLevels}
                        selectedValue={personalHygieneLevel}
                        onValueChange={handleRadioChange(setPersonalHygieneLevel)}
                        className="grid grid-cols-2 gap-4"
                      />
                    </CardContent>
                  </Card>

                  {/* Toileting */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Toileting (bladder, bowel routine, ability to access toilet)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormRadioGroup
                        label=""
                        options={adlLevels}
                        selectedValue={toiletingLevel}
                        onValueChange={handleRadioChange(setToiletingLevel)}
                        className="grid grid-cols-2 gap-4"
                      />
                      <div className="mt-4 space-y-2">
                        <label htmlFor="incontinent-bladder" className="flex items-center">
                          <Checkbox id="incontinent-bladder" checked={toiletingIncontinentBladder} onCheckedChange={setToiletingIncontinentBladder} />
                          <span className="ml-2">Incontinent bladder</span>
                        </label>
                        <label htmlFor="incontinent-bowel" className="flex items-center">
                          <Checkbox id="incontinent-bowel" checked={toiletingIncontinentBowel} onCheckedChange={setToiletingIncontinentBowel} />
                          <span className="ml-2">Incontinent bowel</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* ADLs: Eating, Dressing, General Physical Condition (3 in a row) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Eating and Drinking */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Eating and Drinking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormRadioGroup
                        label=""
                        options={adlLevels}
                        selectedValue={eatingDrinkingLevel}
                        onValueChange={handleRadioChange(setEatingDrinkingLevel)}
                        className="grid grid-cols-2 gap-4"
                      />
                    </CardContent>
                  </Card>

                  {/* Dressing */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Dressing</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormRadioGroup
                        label=""
                        options={adlLevels}
                        selectedValue={dressingLevel}
                        onValueChange={handleRadioChange(setDressingLevel)}
                        className="grid grid-cols-2 gap-4"
                      />
                    </CardContent>
                  </Card>

                  {/* GENERAL PHYSICAL CONDITION */}
                  <Card>
                    <CardHeader>
                      <CardTitle>General Physical Condition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormRadioGroup
                        label=""
                        options={generalPhysicalConditionOptions}
                        selectedValue={generalPhysicalCondition}
                        onValueChange={handleRadioChange(setGeneralPhysicalCondition)}
                        className="space-y-2"
                      />
                      <Input placeholder="Other" className="mt-2" value={otherPhysicalCondition} onChange={(e) => setOtherPhysicalCondition(e.target.value)} />
                    </CardContent>
                  </Card>
                </div>

                {/* NURSE MONITOR VISIT (Full Width) */}
                <Card>
                  <CardHeader>
                    <CardTitle>Nurse Monitor Visit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="nurse-visit-type">Visit type</Label>
                    <Select value={nurseVisitType} onValueChange={setNurseVisitType} id="nurse-visit-type">
                      <SelectTrigger>
                        <SelectValue placeholder="Visit type" />
                      </SelectTrigger>
                      <SelectContent>
                        {nurseVisitTypes.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Label className="mt-4 block">Activities of Visit</Label>
                    <FormCheckboxGroup
                      label=""
                      options={nurseVisitActivities}
                      selectedValues={selectedNurseVisitActivities}
                      onValueChange={handleCheckboxChange(setSelectedNurseVisitActivities)}
                      className="grid-cols-1 md:grid-cols-2"
                    />

                    <Label htmlFor="caregiver-names" className="mt-4 block">Caregiver Names</Label>
                    <Textarea id="caregiver-names" rows={2} placeholder="List all caregivers" value={caregiverNames} onChange={(e) => setCaregiverNames(e.target.value)} />
                  </CardContent>
                </Card>

                {/* SIGNATURES */}
                <Card>
                  <CardHeader>
                    <CardTitle>Signatures</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="rn-name">RN Name (Print)</Label>
                      <Input id="rn-name" value={rnName} onChange={(e) => setRnName(e.target.value)} />
                      <Label htmlFor="rn-signature">RN Signature</Label>
                      <Input id="rn-signature" value={rnSignature} onChange={(e) => setRnSignature(e.target.value)} />
                      <Label htmlFor="rn-date">Date</Label>
                      <Input id="rn-date" type="date" value={rnDate} onChange={(e) => setRnDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="participant-guardian-name">Participant / Guardian Name</Label>
                      <Input id="participant-guardian-name" value={participantGuardianName} onChange={(e) => setParticipantGuardianName(e.target.value)} />
                      <Label htmlFor="participant-guardian-signature">Signature</Label>
                      <Input id="participant-guardian-signature" value={participantGuardianSignature} onChange={(e) => setParticipantGuardianSignature(e.target.value)} />
                      <Label htmlFor="participant-guardian-date">Date</Label>
                      <Input id="participant-guardian-date" type="date" value={participantGuardianDate} onChange={(e) => setParticipantGuardianDate(e.target.value)} />
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

                <div className="flex justify-end mt-6">
                  <Button type="submit">Submit Assessment</Button>
                </div>
              </form>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
