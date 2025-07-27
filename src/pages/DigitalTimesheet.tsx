import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, FileText, CheckSquare, PenTool } from "lucide-react";

interface TimesheetData {
  caregiverId: string;
  patientId: string;
  timeLog: {
    date: string;
    timeIn: string;
    timeOut: string;
    break: string;
    sleepIn: boolean;
    totalHours: string;
    miles: string;
  };
  duties: {
    personalCare: { [task: string]: boolean };
    homeManagement: { [task: string]: boolean };
    activities: { [task: string]: boolean };
  };
  additionalComments: string;
  employeeSignature: string;
  employeeDate: string;
  patientSignature: string;
  patientDate: string;
}

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  room_number: string;
  allergies?: string;
}

const personalCareTasks = [
  "Dressed/Undressed", "Bed Bath", "Oral Hygiene", "Shampoo", "Eating",
  "Urinary", "Meal Preparation", "Medication Reminders", "Garbage",
  "Toileting", "Bathroom Help", "Urinal", "Briefs", "Hoyer Lift",
  "Transfers (bed/chair/car)"
];

const homeManagementTasks = [
  "Housekeeping", "Change Linens", "Vacuum", "Clean Bathroom", "Clean Kitchen",
  "Grocery Shopping", "Dusting", "Mop Floors", "Make Bed"
];

const activitiesTasks = [
  "Escort to Appointments", "Pet Care", "Mail/Letters", "Recreational",
  "Transportation", "Errands"
];

export default function DigitalTimesheet() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<TimesheetData>();
  const { toast } = useToast();

  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [duties, setDuties] = useState<TimesheetData["duties"]>({
    personalCare: {},
    homeManagement: {},
    activities: {}
  });

  useEffect(() => {
    fetchData();
    initializeDuties();
  }, []);

  const fetchData = async () => {
    try {
      const [caregiversResponse, patientsResponse] = await Promise.all([
        supabase.from("caregivers").select("id, first_name, last_name, role").eq("status", "Active"),
        supabase.from("patients").select("id, first_name, last_name, room_number, allergies").eq("status", "Active")
      ]);

      if (caregiversResponse.error) throw caregiversResponse.error;
      if (patientsResponse.error) throw patientsResponse.error;

      setCaregivers(caregiversResponse.data || []);
      setPatients(patientsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load caregivers and patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDuties = () => {
    setDuties({
      personalCare: personalCareTasks.reduce((acc, task) => ({ ...acc, [task]: false }), {}),
      homeManagement: homeManagementTasks.reduce((acc, task) => ({ ...acc, [task]: false }), {}),
      activities: activitiesTasks.reduce((acc, task) => ({ ...acc, [task]: false }), {}),
    });
  };

  const handleDutyChange = (category: keyof TimesheetData["duties"], task: string, checked: boolean) => {
    setDuties(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [task]: checked
      }
    }));
  };

  const calculateTotalHours = (timeIn: string, timeOut: string, breakMinutes: string) => {
    if (!timeIn || !timeOut) return "0.00";
    const start = new Date(`2000-01-01T${timeIn}`);
    const end = new Date(`2000-01-01T${timeOut}`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diff < 0) diff += 24; // Handle overnight shifts
    const breakHours = parseFloat(breakMinutes || "0") / 60;
    const totalHours = Math.max(0, diff - breakHours);
    return totalHours.toFixed(2);
  };

  const onSubmit = async (data: TimesheetData) => {
    try {
      const timesheetData = {
        ...data,
        duties,
        submitted_at: new Date().toISOString(),
        status: 'submitted'
      };
      console.log("Timesheet submission:", timesheetData);
      toast({
        title: "Success",
        description: "Timesheet submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      toast({
        title: "Error",
        description: "Failed to submit timesheet",
        variant: "destructive",
      });
    }
  };

  // For displaying the day of the week with the selected date
  const timeLogDate = watch("timeLog.date");
  const dayOfWeek = timeLogDate
    ? new Date(timeLogDate).toLocaleDateString(undefined, { weekday: "long" })
    : "";

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading...</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full space-y-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Header */}
                <Card className="bg-primary text-primary-foreground">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">American Care Team</CardTitle>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">Provider Timesheet For Home Health Care</p>
                      <p className="text-sm">240-581-2918</p>
                      <p className="text-sm">1503 East North Ave, Baltimore MD 21213</p>
                      <p className="text-sm">www.AmericanCareTeam.com</p>
                    </div>
                  </CardHeader>
                </Card>

                {/* Important Notice */}
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-orange-800 text-center">
                      ⚠️ Please use a different timesheet for each patient
                    </p>
                  </CardContent>
                </Card>

                {/* Caregiver & Patient Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Provider and Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="caregiverId">Care Giver</Label>
                        <Select onValueChange={(value) => setValue("caregiverId", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select caregiver" />
                          </SelectTrigger>
                          <SelectContent>
                            {caregivers.map((caregiver) => (
                              <SelectItem key={caregiver.id} value={caregiver.id}>
                                {caregiver.first_name} {caregiver.last_name} - {caregiver.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="patientId">Patient</Label>
                        <Select onValueChange={(value) => {
                          setValue("patientId", value);
                          const patient = patients.find(p => p.id === value);
                          setSelectedPatient(patient || null);
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name} - Room {patient.room_number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedPatient?.allergies && (
                          <div className="mt-2 text-sm text-red-600">
                            <strong>Allergies:</strong> {selectedPatient.allergies}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Time Log */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Time Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="timeLog.date">Date</Label>
                        <Input
                          type="date"
                          {...register("timeLog.date", { required: "Date is required" })}
                        />
                        {*

