import { useState } from "react";
import { useForm } from "react-hook-form";
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

interface TimesheetData {
  caregiverName: string;
  clientName: string;
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
  const [selectedPersonalCare, setSelectedPersonalCare] = useState<string[]>([]);
  const [selectedHomeDuties, setSelectedHomeDuties] = useState<string[]>([]);
  const [selectedOtherActivities, setSelectedOtherActivities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<{[key: string]: string[]}>({});

  const dailyLogs = watch("dailyLogs") || {};

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
      personalCare: selectedPersonalCare,
      homeDuties: selectedHomeDuties,
      otherActivities: selectedOtherActivities,
      availability: availability,
      totalHours: calculateTotalHours()
    };
    console.log("Timesheet submission:", submissionData);
    // Handle form submission here
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6 w-full">
            <div className="container mx-auto max-w-7xl">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
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

        {/* Section 1: Provider and Client Information */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Section 1: Provider and Client Information</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              Please use different time sheet for each patient.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="caregiverName" className="text-sm font-medium">Name of Care Giver</Label>
                <Input {...register("caregiverName")} id="caregiverName" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="clientName" className="text-sm font-medium">Client's Name</Label>
                <Input {...register("clientName")} id="clientName" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Daily Time Log */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Section 2: Daily Time Log</CardTitle>
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
          </CardContent>
        </Card>

        {/* Section 3: Care Plan Activities */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Section 3: Care Plan Activities</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              For each shift, please check which items you worked on with the client to reflect care plan
            </p>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div>
              <Label className="text-base font-semibold">Total # of Hours: {calculateTotalHours().toFixed(2)}</Label>
            </div>

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
          </CardContent>
        </Card>

        {/* Section 4: Additional Comments and Agreements */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Section 4: Additional Comments and Agreements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div>
              <Label htmlFor="additionalComments" className="text-sm font-medium">Additional Comments/or Notes About the Patient</Label>
              <Textarea 
                {...register("additionalComments")}
                id="additionalComments"
                rows={4}
                className="mt-1"
              />
            </div>

            <Separator />

            <div className="space-y-3 text-xs sm:text-sm">
              <p className="font-semibold">EMPLOYEE AGREEMENT:</p>
              <p>I agree not to accept employment with the Client for the term of employment with American Care Team, LLC and for one (1) year after the termination of my employment with American Care Team, LLC.</p>
              <p>I declare that I have sustained no injury on this assigned job.</p>
              <p>By signing this time sheet, I certify that all services have been provided in accordance with the Client's healthcare assessment and I have delivered all service hours shown on the time sheet.</p>
              <p>In order to be paid, I understand this time sheet must be completed and signed by both me and the client.</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Availability and Signatures */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Section 5: Availability and Signatures</CardTitle>
            <div className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p>I understand I must indicate my availability below for further assignment prior to submitting this time sheet. This information is necessary for our records and also informs us of your availability for future assignments. Failure to do so results in our assumption of your voluntary termination from American Care Team, LLC and may impact your eligibility for unemployment.</p>
              <p className="font-semibold">All completed time sheets must be returned by Mondays at 12:00 PM.</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            {/* Availability */}
            <div>
              <h4 className="font-semibold mb-3 text-sm sm:text-base">Availability</h4>
              <div className="space-y-3">
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
              </div>
            </div>

            <Separator />

            {/* Signatures */}
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

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button type="submit" size="lg" className="px-8 w-full sm:w-auto">
                Submit Timesheet
              </Button>
            </div>
          </CardContent>
        </Card>
              </form>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
