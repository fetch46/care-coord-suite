"use client";

import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

// Import all form section components
import PatientDetails from "./PatientDetails";
import GeneralHealth from "./GeneralHealth";
import Respiratory from "./Respiratory";
import Pain from "./Pain";
import Genitourinary from "./Genitourinary";
import Cardiovascular from "./Cardiovascular";
import Gastrointestinal from "./Gastrointestinal";
import Neurological from "./Neurological";
import Sensory from "./Sensory";
import Psychosocial from "./Psychosocial";
import Musculoskeletal from "./Musculoskeletal";
import MentalHealth from "./MentalHealth";
import HealthMaintenanceNeeds from "./HealthMaintenanceNeeds";
import Skin from "./Skin";
import MobilityTransfers from "./MobilityTransfers";
import MedicationManagement from "./MedicationManagement";
import ADLs from "./ADLs";
import GeneralPhysicalCondition from "./GeneralPhysicalCondition";
import NurseMonitorVisit from "./NurseMonitorVisit";
import Signatures from "./Signatures";
import Disclaimers from "./Disclaimers";

// Import static data
import {
  patients,
  assessmentTypes,
  dietOptions,
  respiratoryFindingsOptions,
  shortnessOfBreathOptions,
  respiratoryTreatmentOptions,
  painFrequencyOptions,
  painIntensityOptions,
  genitourinaryOptions,
  rhythmOptions,
  edemaOptions,
  gastrointestinalOptions,
  bowelIncontinenceFrequencyOptions,
  cognitiveFunctioningOptions,
  speechOptions,
  pupilOptions,
  movementOptions,
  extremityOptions,
  visionOptions,
  hearingOptions,
  behaviorOptions,
  yesNoOptions,
  musculoskeletalOptions,
  mentalHealthOptions,
  skinColorOptions,
  mobilityOptions,
  adlLevels,
  healthMaintenanceNeedsOptions,
  generalPhysicalConditionOptions,
  medicationAdministrationOptions,
  nurseVisitTypes,
  nurseVisitActivities,
  pressureUlcerCountOptions
} from "./formData";

export default function PatientAssessment() {
  // State management organized by form section
  // Patient Details
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

  // ... other state variables for each section (similar structure)

  // Handlers
  const handleCheckboxChange = (setter) => (id, checked) => {
    setter((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));
  };

  const handleRadioChange = (setter) => (value) => {
    setter(value);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form data collection logic remains the same
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AppHeader />
          <SidebarInset>
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 print:p-4">
              <style>{`
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
                <PatientDetails
                  patients={patients}
                  assessmentTypes={assessmentTypes}
                  selectedPatient={selectedPatient}
                  setSelectedPatient={setSelectedPatient}
                  assessmentType={assessmentType}
                  setAssessmentType={setAssessmentType}
                  assessmentDate={assessmentDate}
                  setAssessmentDate={setAssessmentDate}
                  assessorName={assessorName}
                  setAssessorName={setAssessorName}
                />

                {/* Health Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  <GeneralHealth
                    temp={temp}
                    setTemp={setTemp}
                    pulse={pulse}
                    setPulse={setPulse}
                    respiration={respiration}
                    setRespiration={setRespiration}
                    bloodPressure={bloodPressure}
                    setBloodPressure={setBloodPressure}
                    weight={weight}
                    setWeight={setWeight}
                    dietOptions={dietOptions}
                    selectedDiets={selectedDiets}
                    setSelectedDiets={setSelectedDiets}
                    handleCheckboxChange={handleCheckboxChange}
                    otherDietDetails={otherDietDetails}
                    setOtherDietDetails={setOtherDietDetails}
                    fluidIntake={fluidIntake}
                    setFluidIntake={setFluidIntake}
                    fluidAmount={fluidAmount}
                    setFluidAmount={setFluidAmount}
                    recentChanges={recentChanges}
                    setRecentChanges={setRecentChanges}
                  />
                  
                  <Respiratory
                    respiratoryFindingsOptions={respiratoryFindingsOptions}
                    selectedRespiratoryFindings={selectedRespiratoryFindings}
                    setSelectedRespiratoryFindings={setSelectedRespiratoryFindings}
                    handleCheckboxChange={handleCheckboxChange}
                    otherRespiratoryFindings={otherRespiratoryFindings}
                    setOtherRespiratoryFindings={setOtherRespiratoryFindings}
                    shortnessOfBreathOptions={shortnessOfBreathOptions}
                    shortnessOfBreath={shortnessOfBreath}
                    setShortnessOfBreath={setShortnessOfBreath}
                    respiratoryTreatmentOptions={respiratoryTreatmentOptions}
                    selectedRespiratoryTreatments={selectedRespiratoryTreatments}
                    setSelectedRespiratoryTreatments={setSelectedRespiratoryTreatments}
                  />
                </div>

                {/* Additional sections follow the same pattern */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                  <Pain
                    painFrequencyOptions={painFrequencyOptions}
                    painFrequency={painFrequency}
                    setPainFrequency={setPainFrequency}
                    painSites={painSites}
                    setPainSites={setPainSites}
                    painIntensityOptions={painIntensityOptions}
                    painIntensity={painIntensity}
                    setPainIntensity={setPainIntensity}
                    painAffectsLife={painAffectsLife}
                    setPainAffectsLife={setPainAffectsLife}
                    painCause={painCause}
                    setPainCause={setPainCause}
                    painTreatment={painTreatment}
                    setPainTreatment={setPainTreatment}
                  />
                  
                  <Genitourinary
                    catheter={catheter}
                    setCatheter={setCatheter}
                    urineFrequency={urineFrequency}
                    setUrineFrequency={setUrineFrequency}
                    genitourinaryOptions={genitourinaryOptions}
                    selectedGenitourinaryIssues={selectedGenitourinaryIssues}
                    setSelectedGenitourinaryIssues={setSelectedGenitourinaryIssues}
                    handleCheckboxChange={handleCheckboxChange}
                    otherGenitourinary={otherGenitourinary}
                    setOtherGenitourinary={setOtherGenitourinary}
                    utiTreated={utiTreated}
                    setUtiTreated={setUtiTreated}
                  />
                </div>

                {/* Other sections... */}
                
                {/* Medication Management */}
                <MedicationManagement
                  medications={medications}
                  handleMedicationChange={handleMedicationChange}
                  addMedication={addMedication}
                  removeMedication={removeMedication}
                  medicationAdministrationOptions={medicationAdministrationOptions}
                  medicationAdministration={medicationAdministration}
                  setMedicationAdministration={setMedicationAdministration}
                  otherMedicationManagement={otherMedicationManagement}
                  setOtherMedicationManagement={setOtherMedicationManagement}
                />

                {/* ADLs */}
                <ADLs
                  adlLevels={adlLevels}
                  bathingLevel={bathingLevel}
                  setBathingLevel={setBathingLevel}
                  personalHygieneLevel={personalHygieneLevel}
                  setPersonalHygieneLevel={setPersonalHygieneLevel}
                  toiletingLevel={toiletingLevel}
                  setToiletingLevel={setToiletingLevel}
                  toiletingIncontinentBladder={toiletingIncontinentBladder}
                  setToiletingIncontinentBladder={setToiletingIncontinentBladder}
                  toiletingIncontinentBowel={toiletingIncontinentBowel}
                  setToiletingIncontinentBowel={setToiletingIncontinentBowel}
                  eatingDrinkingLevel={eatingDrinkingLevel}
                  setEatingDrinkingLevel={setEatingDrinkingLevel}
                  dressingLevel={dressingLevel}
                  setDressingLevel={setDressingLevel}
                />

                {/* Signatures */}
                <Signatures
                  rnName={rnName}
                  setRnName={setRnName}
                  rnSignature={rnSignature}
                  setRnSignature={setRnSignature}
                  rnDate={rnDate}
                  setRnDate={setRnDate}
                  participantGuardianName={participantGuardianName}
                  setParticipantGuardianName={setParticipantGuardianName}
                  participantGuardianSignature={participantGuardianSignature}
                  setParticipantGuardianSignature={setParticipantGuardianSignature}
                  participantGuardianDate={participantGuardianDate}
                  setParticipantGuardianDate={setParticipantGuardianDate}
                />

                {/* Disclaimers */}
                <Disclaimers />

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
