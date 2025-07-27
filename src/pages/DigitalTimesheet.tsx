import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  clientId: string;
  weekEnding: string;
  dailyLogs: {
    [key: string]: {
      date: string;
      timeIn: string;
      timeOut: string;
      breakMinutes: string;
      sleepIn: boolean;
      totalHours: string;
      miles: string;
    };
  };
  duties: {
    [task: string]: {
      [day: string]: boolean;
    };
  };
  additionalComments: string;
  employeeSignature: string;
  employeeDate: string;
  clientSignature: string;
  clientDate: string;
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
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayAbbreviations = ["S", "M", "T", "W", "T", "F", "S"];

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
  const [loading, setLoading] = useState(true);
  const [duties, setDuties] = useState<{[task: string]: {[day: string]: boolean}}>({});

  useEffect(() => {
    fetchData();
    initializeDuties();
  }, []);

  const fetchData = async () => {
    try {
      const [caregiversResponse, patientsResponse] = await Promise.all([
        supabase.from("caregivers").select("id, first_name, last_name, role").eq("status", "Active"),
        supabase.from("patients").select("id, first_name, last_name, room_number").eq("status", "Active")
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
    const allTasks = [...personalCareTasks, ...homeManagementTasks, ...activitiesTasks];
    const initialDuties: {[task: string]: {[day: string]: boolean}} = {};
    
    allTasks.forEach(task => {
      initialDuties[task] = {};
      dayAbbreviations.forEach(day => {
        initialDuties[task][day] = false;
      });
    });
    
    setDuties(initialDuties);
  };

  const handleDutyChange = (task: string, day: string, checked: boolean) => {
    setDuties(prev => ({
      ...prev,
      [task]: {
        ...prev[task],
        [day]: checked
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
      // In a real application, you would save this to a timesheets table
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

  const TaskGrid = ({ tasks, title }: { tasks: string[], title: string }) => (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b font-medium">Task</th>
              {dayAbbreviations.map(day => (
                <th key={day} className="text-center p-2 border-b font-medium w-12">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task} className="border-b">
                <td className="p-2 text-sm">{task}</td>
                {dayAbbreviations.map(day => (
                  <td key={day} className="text-center p-2">
                    <Checkbox
                      checked={duties[task]?.[day] || false}
                      onCheckedChange={(checked) => handleDutyChange(task, day, !!checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
            <div className="w-full max-w-6xl mx-auto space-y-8">
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

                {/* Caregiver Info Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Provider and Client Information
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
                        <Label htmlFor="clientId">Client</Label>
                        <Select onValueChange={(value) => setValue("clientId", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.first_name} {patient.last_name} - Room {patient.room_number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="weekEnding">Week Ending</Label>
                      <Input
                        type="date"
                        {...register("weekEnding", { required: "Week ending date is required" })}
                      />
                      {errors.weekEnding && (
                        <p className="text-sm text-red-600 mt-1">{errors.weekEnding.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Daily Log Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Daily Time Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-2 text-left">Date</th>
                            <th className="border border-border p-2 text-left">Day</th>
                            <th className="border border-border p-2 text-left">Time In</th>
                            <th className="border border-border p-2 text-left">Time Out</th>
                            <th className="border border-border p-2 text-left">Break (mins)</th>
                            <th className="border border-border p-2 text-left">Sleep In?</th>
                            <th className="border border-border p-2 text-left">Total Hours</th>
                            <th className="border border-border p-2 text-left">Miles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {daysOfWeek.map((day, index) => {
                            const timeIn = watch(`dailyLogs.${day}.timeIn`);
                            const timeOut = watch(`dailyLogs.${day}.timeOut`);
                            const breakMinutes = watch(`dailyLogs.${day}.breakMinutes`);
                            const totalHours = calculateTotalHours(timeIn, timeOut, breakMinutes);
                            
                            return (
                              <tr key={day}>
                                <td className="border border-border p-1">
                                  <Input 
                                    type="date"
                                    {...register(`dailyLogs.${day}.date`)}
                                    className="h-8"
                                  />
                                </td>
                                <td className="border border-border p-2 font-medium">{day}</td>
                                <td className="border border-border p-1">
                                  <Input 
                                    type="time"
                                    {...register(`dailyLogs.${day}.timeIn`)}
                                    className="h-8"
                                  />
                                </td>
                                <td className="border border-border p-1">
                                  <Input 
                                    type="time"
                                    {...register(`dailyLogs.${day}.timeOut`)}
                                    className="h-8"
                                  />
                                </td>
                                <td className="border border-border p-1">
                                  <Input 
                                    type="number"
                                    {...register(`dailyLogs.${day}.breakMinutes`)}
                                    className="h-8"
                                    placeholder="0"
                                  />
                                </td>
                                <td className="border border-border p-2 text-center">
                                  <Switch
                                    onCheckedChange={(checked) => setValue(`dailyLogs.${day}.sleepIn`, checked)}
                                  />
                                </td>
                                <td className="border border-border p-2 text-center font-medium">
                                  {totalHours}
                                </td>
                                <td className="border border-border p-1">
                                  <Input 
                                    type="number"
                                    step="0.1"
                                    {...register(`dailyLogs.${day}.miles`)}
                                    className="h-8"
                                    placeholder="0"
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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
                      For each shift, please check which items you worked on with the client
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <TaskGrid tasks={personalCareTasks} title="Personal Care Tasks" />
                    <TaskGrid tasks={homeManagementTasks} title="Home Management Tasks" />
                    <TaskGrid tasks={activitiesTasks} title="Activities" />
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
                    <p>I agree not to accept employment with the Client for the term of employment with American Care Team, LLC and for one (1) year after the termination of my employment with American Care Team, LLC.</p>
                    <p>I declare that I have sustained no injury on this assigned job.</p>
                    <p>By signing this time sheet, I certify that all services have been provided in accordance with the Client's healthcare assessment and I have delivered all service hours shown on the time sheet.</p>
                    <p className="font-semibold">In order to be paid, I understand this time sheet must be completed and signed by both me and the client.</p>
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
                        <h4 className="font-semibold">Client Signature</h4>
                        <div>
                          <Label htmlFor="clientSignature">Digital Signature</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-32 flex items-center justify-center bg-gray-50">
                            <p className="text-gray-500 text-sm">Click to sign digitally</p>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="clientDate">Date</Label>
                          <Input 
                            type="date"
                            {...register("clientDate", { required: "Client date is required" })}
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