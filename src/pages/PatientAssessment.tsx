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
  
