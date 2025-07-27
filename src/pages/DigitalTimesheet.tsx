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
                        {dayOfWeek && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {dayOfWeek}
                          </div>
                        )}
                        {errors?.timeLog?.date && (
                          <p className="text-sm text-red-600 mt-1">{errors.timeLog.date.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="timeLog.timeIn">Time In</Label>
                        <Input
                          type="time"
                          {...register("timeLog.timeIn", { required: "Time In is required" })}
                        />
                        {errors?.timeLog?.timeIn && (
                          <p className="text-sm text-red-600 mt-1">{errors.timeLog.timeIn.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="timeLog.timeOut">Time Out</Label>
                        <Input
                          type="time"
                          {...register("timeLog.timeOut", { required: "Time Out is required" })}
                        />
                        {errors?.timeLog?.timeOut && (
                          <p className="text-sm text-red-600 mt-1">{errors.timeLog.timeOut.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="timeLog.break">Break (mins)</Label>
                        <Input
                          type="number"
                          {...register("timeLog.break", { required: "Break is required" })}
                          placeholder="0"
                        />
                        {errors?.timeLog?.break && (
                          <p className="text-sm text-red-600 mt-1">{errors.timeLog.break.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="timeLog.sleepIn">Sleep In?</Label>
                        <Switch
                          onCheckedChange={(checked) => setValue("timeLog.sleepIn", checked)}
                        />
                      </div>
                      <div>
                        <Label>Total Hours</Label>
                        <div className="font-medium">
                          {calculateTotalHours(
                            watch("timeLog.timeIn"),
                            watch("timeLog.timeOut"),
                            watch("timeLog.break")
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="timeLog.miles">Miles</Label>
                        <Input
                          type="number"
                          step="0.1"
                          {...register("timeLog.miles")}
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Duties Checklist Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckSquare className="w-5 h-5" />
                      Care Plan Activities
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      For this shift, please check which items you worked on with the patient
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Personal Care Tasks */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Care Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {personalCareTasks.map(task => (
                            <div key={task} className="flex items-center">
                              <Checkbox
                                checked={duties.personalCare[task] || false}
                                onCheckedChange={(checked) => handleDutyChange("personalCare", task, !!checked)}
                              />
                              <Label className="ml-2">{task}</Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    {/* Home Management Tasks */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Home Management Tasks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {homeManagementTasks.map(task => (
                            <div key={task} className="flex items-center">
                              <Checkbox
                                checked={duties.homeManagement[task] || false}
                                onCheckedChange={(checked) => handleDutyChange("homeManagement", task, !!checked)}
                              />
                              <Label className="ml-2">{task}</Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    {/* Activities */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Activities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {activitiesTasks.map(task => (
                            <div key={task} className="flex items-center">
                              <Checkbox
                                checked={duties.activities[task] || false}
                                onCheckedChange={(checked) => handleDutyChange("activities", task, !!checked)}
                              />
                              <Label className="ml-2">{task}</Label>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                {/* Additional Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Additional Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="additionalComments">Additional Comments or Notes About the Patient</Label>
                    <Textarea
                      {...register("additionalComments")}
                      rows={4}
                      placeholder="Enter any additional comments or observations about the patient's care..."
                    />
                  </CardContent>
                </Card>

                {/* Agreement Section */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle>Employee Agreement</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>I agree not to accept employment with the Patient for the term of employment with American Care Team, LLC and for one (1) year after the termination of my employment with American Care Team, LLC.</p>
                    <p>I declare that I have sustained no injury on this assigned job.</p>
                    <p>By signing this time sheet, I certify that all services have been provided in accordance with the Patient's healthcare assessment and I have delivered all service hours shown on the time sheet.</p>
                    <p className="font-semibold">In order to be paid, I understand this time sheet must be completed and signed by both me and the patient.</p>
                    <p className="font-semibold text-red-600">All completed time sheets must be returned by Mondays at 12:00 PM.</p>
                  </CardContent>
                </Card>

                {/* Signatures Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="w-5 h-5" />
                      Signatures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold">Employee Signature</h4>
                        <div>
                          <Label htmlFor="employeeSignature">Digital Signature</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
                            <p className="text-gray-500 text-sm">Click to sign digitally</p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="employeeDate">Date</Label>
                          <Input
                            type="date"
                            {...register("employeeDate", { required: "Employee date is required" })}
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold">Patient Signature</h4>
                        <div>
                          <Label htmlFor="patientSignature">Digital Signature</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
                            <p className="text-gray-500 text-sm">Click to sign digitally</p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="patientDate">Date</Label>
                          <Input
                            type="date"
                            {...register("patientDate", { required: "Patient date is required" })}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-center gap-4 pt-6">
                  <Button type="button" variant="outline" size="lg">
                    Save as Draft
                  </Button>
                  <Button type="submit" size="lg" className="bg-gradient-primary text-white hover:opacity-90">
                    Submit Timesheet
                  </Button>
                </div>
              </form>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
