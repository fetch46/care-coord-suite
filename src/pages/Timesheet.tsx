import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { AppHeader } from "@/components/ui/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Clock, User, Shield, FileText, Calendar, Signature } from "lucide-react";

interface TimesheetData {
  caregiverId: string;
  clientId: string;
  dailyLogs: {
    [key: string]: {
      date: string;
      timeIn: string;
      timeOut: string;
      break: string;
      sleepIn: string;
      totalHours: string;
      miles: string;
      clientInitial: string;
    };
  };
  personalCare: string[];
  homeDuties: string[];
  otherActivities: string[];
  additionalComments: string;
  availability: {
    [key: string]: string[];
  };
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

const personalCareItems = [
  "Dressed/Undressed", "Bed Bath", "Oral Hygiene", "Shampoo", "Eating",
  "Urinary", "Toileting", "Transfer", "Bathroom", "Urinal", "Attend Brief"
];

const homeDutiesItems = [
  "House Keeping", "Changed Linens", "Vacuumed", "Clean Bathroom", "Clean Kitchen",
  "Grocery Shopping", "Dusted", "Mopped Floors", "Made Bed"
];

const otherActivitiesItems = [
  "Meal Preparation", "Med Reminders", "Take out Garbage", "From the Chair", "From the bed",
  "In/Out of Car", "Hoyer Lift", "Activities", "Errands", "Recreational",
  "Transportation", "Escort to Appointment(s)", "Pet Care", "Mail letters/ Bills"
];

const shifts = ["7-3", "3-11", "11-7"];

export default function Timesheet() {
  const { register, handleSubmit, watch, setValue } = useForm<TimesheetData>();
  const { toast } = useToast();
  
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>("");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedPersonalCare, setSelectedPersonalCare] = useState<string[]>([]);
  const [selectedHomeDuties, setSelectedHomeDuties] = useState<string[]>([]);
  const [selectedOtherActivities, setSelectedOtherActivities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<{[key: string]: string[]}>({});
  const [loading, setLoading] = useState(true);

  const dailyLogs = watch("dailyLogs") || {};

  useEffect(() => {
    fetchCaregivers();
    fetchPatients();
  }, []);

  const fetchCaregivers = async () => {
    try {
      const { data, error } = await supabase
        .from("caregivers")
        .select("id, first_name, last_name, role")
        .eq("status", "Active")
        .order("last_name");

      if (error) throw error;
      setCaregivers(data || []);
    } catch (error) {
      console.error("Error fetching caregivers:", error);
      toast({
        title: "Error",
        description: "Failed to load caregivers",
        variant: "destructive",
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name, room_number")
        .eq("status", "Active")
        .order("last_name");

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalHours = () => {
    return Object.values(dailyLogs).reduce((total, log) => {
      const hours = parseFloat(log?.totalHours || "0");
      return total + (isNaN(hours) ? 0 : hours);
    }, 0);
  };

  const handleCheckboxChange = (item: string, category: "personalCare" | "homeDuties" | "otherActivities") => {
    const setters = {
      personalCare: setSelectedPersonalCare,
      homeDuties: setSelectedHomeDuties,
      otherActivities: setSelectedOtherActivities
    };
    const getters = {
      personalCare: selectedPersonalCare,
      homeDuties: selectedHomeDuties,
      otherActivities: selectedOtherActivities
    };

    const currentItems = getters[category];
    const setter = setters[category];
    
    if (currentItems.includes(item)) {
      setter(currentItems.filter(i => i !== item));
    } else {
      setter([...currentItems, item]);
    }
  };

  const handleAvailabilityChange = (day: string, shift: string) => {
    const currentShifts = availability[day] || [];
    if (currentShifts.includes(shift)) {
      setAvailability({
        ...availability,
        [day]: currentShifts.filter(s => s !== shift)
      });
    } else {
      setAvailability({
        ...availability,
        [day]: [...currentShifts, shift]
      });
    }
  };

  const onSubmit = (data: TimesheetData) => {
    const submissionData = {
      ...data,
      caregiverId: selectedCaregiverId,
      clientId: selectedClientId,
      personalCare: selectedPersonalCare,
      homeDuties: selectedHomeDuties,
      otherActivities: selectedOtherActivities,
      availability: availability,
      totalHours: calculateTotalHours()
    };
    console.log("Timesheet submission:", submissionData);
    toast({
      title: "Success",
      description: "Timesheet submitted successfully",
    });
  };

  const selectedCaregiver = caregivers.find(c => c.id === selectedCaregiverId);
  const selectedClient = patients.find(p => p.id === selectedClientId);

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading timesheet...</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 w-full">
            <div className="w-full space-y-6 sm:space-y-8">
              {/* Header */}
              <Card>
                <CardHeader className="text-center bg-primary text-primary-foreground p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl font-bold">American Care Team</CardTitle>
                  <div className="space-y-1">
                    <p className="text-base sm:text-lg font-semibold">Provider Timesheet For Home Health Care</p>
                    <p className="text-xs sm:text-sm">240-581-2918</p>
                    <p className="text-xs sm:text-sm">1503 East North Ave, Baltimore MD 21213</p>
                    <p className="text-xs sm:text-sm">www.AmericanCareTeam.com</p>
                  </div>
                </CardHeader>
              </Card>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Tabs defaultValue="basic-info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
                    <TabsTrigger value="basic-info" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Basic Info</span>
                    </TabsTrigger>
                    <TabsTrigger value="time-log" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">Time Log</span>
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Activities</span>
                    </TabsTrigger>
                    <TabsTrigger value="availability" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">Availability</span>
                    </TabsTrigger>
                    <TabsTrigger value="signatures" className="flex items-center gap-2">
                      <Signature className="w-4 h-4" />
                      <span className="hidden sm:inline">Signatures</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic-info">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5 text-primary" />
                          Provider and Client Information
                        </CardTitle>
                        <p className="text-sm text-muted-foreground italic">
                          Please use different time sheet for each patient.
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <Label htmlFor="caregiver" className="text-sm font-medium">Care Giver</Label>
                            <Select value={selectedCaregiverId} onValueChange={setSelectedCaregiverId}>
                              <SelectTrigger className="mt-1">
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
                            <Label htmlFor="client" className="text-sm font-medium">Client</Label>
                            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                              <SelectContent>
                                {patients.map((patient) => (
                                  <SelectItem key={patient.id} value={patient.id}>
                                    {patient.first_name} {patient.last_name} 
                                    {patient.room_number && ` - Room ${patient.room_number}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Display selected information */}
                        {(selectedCaregiver || selectedClient) && (
                          <div className="mt-6 p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">Selected Information:</h4>
                            <div className="grid gap-2 sm:grid-cols-2 text-sm">
                              {selectedCaregiver && (
                                <div>
                                  <span className="font-medium">Caregiver:</span> {selectedCaregiver.first_name} {selectedCaregiver.last_name} ({selectedCaregiver.role})
                                </div>
                              )}
                              {selectedClient && (
                                <div>
                                  <span className="font-medium">Client:</span> {selectedClient.first_name} {selectedClient.last_name}
                                  {selectedClient.room_number && ` - Room ${selectedClient.room_number}`}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Daily Time Log Tab */}
                  <TabsContent value="time-log">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-primary" />
                          Daily Time Log
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 sm:p-6">
                        <div className="overflow-x-auto -mx-2 sm:mx-0">
                          <table className="w-full min-w-[800px] border-collapse border border-border text-sm">
                            <thead>
                              <tr className="bg-muted">
                                <th className="border border-border p-2 text-left min-w-[100px]">Date</th>
                                <th className="border border-border p-2 text-left min-w-[80px]">Days of Week</th>
                                <th className="border border-border p-2 text-left min-w-[80px]">Time In</th>
                                <th className="border border-border p-2 text-left min-w-[80px]">Time Out</th>
                                <th className="border border-border p-2 text-left min-w-[70px]">Break</th>
                                <th className="border border-border p-2 text-left min-w-[80px]">Sleep In</th>
                                <th className="border border-border p-2 text-left min-w-[80px]">Total Hours</th>
                                <th className="border border-border p-2 text-left min-w-[60px]">Miles</th>
                                <th className="border border-border p-2 text-left min-w-[80px]">Client Initial</th>
                              </tr>
                            </thead>
                            <tbody>
                              {daysOfWeek.map((day) => (
                                <tr key={day}>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.date`)}
                                      type="date"
                                      className="h-8 text-xs"
                                    />
                                  </td>
                                  <td className="border border-border p-2 font-medium text-xs sm:text-sm">{day}</td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.timeIn`)}
                                      type="time"
                                      className="h-8 text-xs"
                                    />
                                  </td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.timeOut`)}
                                      type="time"
                                      className="h-8 text-xs"
                                    />
                                  </td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.break`)}
                                      className="h-8 text-xs"
                                      placeholder="mins"
                                    />
                                  </td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.sleepIn`)}
                                      className="h-8 text-xs"
                                      placeholder="hrs"
                                    />
                                  </td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.totalHours`)}
                                      className="h-8 text-xs"
                                      placeholder="hrs"
                                    />
                                  </td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.miles`)}
                                      className="h-8 text-xs"
                                    />
                                  </td>
                                  <td className="border border-border p-1">
                                    <Input 
                                      {...register(`dailyLogs.${day}.clientInitial`)}
                                      className="h-8 text-xs"
                                      maxLength={3}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <Label className="text-base font-semibold">Total # of Hours: {calculateTotalHours().toFixed(2)}</Label>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Care Plan Activities Tab */}
                  <TabsContent value="activities">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-primary" />
                          Care Plan Activities
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          For each shift, please check which items you worked on with the client to reflect care plan
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
                          {/* Personal Care */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm sm:text-base">Personal Care</h4>
                            <div className="space-y-2">
                              {personalCareItems.map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`personal-${item}`}
                                    checked={selectedPersonalCare.includes(item)}
                                    onCheckedChange={() => handleCheckboxChange(item, "personalCare")}
                                  />
                                  <Label htmlFor={`personal-${item}`} className="text-sm">{item}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Home Duties */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm sm:text-base">Home Duties</h4>
                            <div className="space-y-2">
                              {homeDutiesItems.map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`home-${item}`}
                                    checked={selectedHomeDuties.includes(item)}
                                    onCheckedChange={() => handleCheckboxChange(item, "homeDuties")}
                                  />
                                  <Label htmlFor={`home-${item}`} className="text-sm">{item}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Other Activities */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm sm:text-base">Other Activities/Duties</h4>
                            <div className="space-y-2">
                              {otherActivitiesItems.map((item) => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`other-${item}`}
                                    checked={selectedOtherActivities.includes(item)}
                                    onCheckedChange={() => handleCheckboxChange(item, "otherActivities")}
                                  />
                                  <Label htmlFor={`other-${item}`} className="text-sm">{item}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <Label htmlFor="additionalComments" className="text-sm font-medium">Additional Comments/or Notes About the Patient</Label>
                          <Textarea 
                            {...register("additionalComments")}
                            id="additionalComments"
                            rows={4}
                            className="mt-1"
                          />
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm bg-muted p-4 rounded-lg">
                          <p className="font-semibold">EMPLOYEE AGREEMENT:</p>
                          <p>I agree not to accept employment with the Client for the term of employment with American Care Team, LLC and for one (1) year after the termination of my employment with American Care Team, LLC.</p>
                          <p>I declare that I have sustained no injury on this assigned job.</p>
                          <p>By signing this time sheet, I certify that all services have been provided in accordance with the Client's healthcare assessment and I have delivered all service hours shown on the time sheet.</p>
                          <p>In order to be paid, I understand this time sheet must be completed and signed by both me and the client.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Availability Tab */}
                  <TabsContent value="availability">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          Availability for Future Assignments
                        </CardTitle>
                        <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
                          <p>I understand I must indicate my availability below for further assignment prior to submitting this time sheet. This information is necessary for our records and also informs us of your availability for future assignments. Failure to do so results in our assumption of your voluntary termination from American Care Team, LLC and may impact your eligibility for unemployment.</p>
                          <p className="font-semibold">All completed time sheets must be returned by Mondays at 12:00 PM.</p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {daysOfWeek.map((day) => (
                          <div key={day} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="w-full sm:w-20 font-medium text-sm">{day}:</div>
                            <div className="flex flex-wrap gap-2 sm:gap-4">
                              {shifts.map((shift) => (
                                <div key={shift} className="flex items-center space-x-1">
                                  <Checkbox
                                    id={`${day}-${shift}`}
                                    checked={availability[day]?.includes(shift) || false}
                                    onCheckedChange={() => handleAvailabilityChange(day, shift)}
                                  />
                                  <Label htmlFor={`${day}-${shift}`} className="text-sm">{shift}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Signatures Tab */}
                  <TabsContent value="signatures">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Signature className="w-5 h-5 text-primary" />
                          Signatures and Submission
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="employeeSignature" className="text-sm font-medium">Employee's Signature</Label>
                              <Input {...register("employeeSignature")} id="employeeSignature" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="employeeDate" className="text-sm font-medium">Date</Label>
                              <Input {...register("employeeDate")} id="employeeDate" type="date" className="mt-1" />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="clientSignature" className="text-sm font-medium">Client's Signature</Label>
                              <Input {...register("clientSignature")} id="clientSignature" className="mt-1" />
                            </div>
                            <div>
                              <Label htmlFor="clientDate" className="text-sm font-medium">Date</Label>
                              <Input {...register("clientDate")} id="clientDate" type="date" className="mt-1" />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                          <Button type="submit" size="lg" className="px-8 w-full sm:w-auto bg-gradient-primary text-white hover:opacity-90">
                            Submit Timesheet
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </form>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}