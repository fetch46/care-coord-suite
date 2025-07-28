import { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import SignatureCanvas from "react-signature-canvas";

// --------------------------------------------------
// Zod schema for validation
// --------------------------------------------------
const dutiesSchema = z.record(z.string(), z.boolean());
const timeLogSchema = z.object({
  date: z.string().min(1, "Date is required"),
  timeIn: z.string().min(1, "Time In is required"),
  timeOut: z.string().min(1, "Time Out is required"),
  break: z.string().min(1, "Break minutes are required"),
  sleepIn: z.boolean().default(false),
  totalHours: z.string(),
  miles: z.string().optional(),
});

const schema = z.object({
  caregiverId: z.string().min(1, "Caregiver is required"),
  patientId: z.string().min(1, "Patient is required"),
  timeLog: timeLogSchema,
  duties: z.object({
    personalCare: dutiesSchema,
    homeManagement: dutiesSchema,
    activities: dutiesSchema,
  }),
  additionalComments: z.string().optional(),
  employeeSignature: z.string().min(1, "Employee signature is required"),
  employeeDate: z.string().min(1, "Employee date is required"),
  patientSignature: z.string().min(1, "Patient signature is required"),
  patientDate: z.string().min(1, "Patient date is required"),
});

type FormData = z.infer<typeof schema>;

// --------------------------------------------------
// Static task lists
// --------------------------------------------------
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

// --------------------------------------------------
// Component
// --------------------------------------------------
export default function DigitalTimesheet() {
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      timeLog: {
        sleepIn: false,
        totalHours: "0.00",
      },
      duties: {
        personalCare: Object.fromEntries(personalCareTasks.map(t => [t, false])),
        homeManagement: Object.fromEntries(homeManagementTasks.map(t => [t, false])),
        activities: Object.fromEntries(activitiesTasks.map(t => [t, false])),
      },
    },
  });

  const { toast } = useToast();

  const [caregivers, setCaregivers] = useState<{ id: string; first_name: string; last_name: string; role: string }[]>([]);
  const [patients, setPatients] = useState<{ id: string; first_name: string; last_name: string; room_number: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [sigPadEmp, setSigPadEmp] = useState<SignatureCanvas | null>(null);
  const [sigPadPat, setSigPadPat] = useState<SignatureCanvas | null>(null);

  const timeLogDate = watch("timeLog.date");
  const dayOfWeek = useMemo(() => {
    if (!timeLogDate) return "";
    return new Date(timeLogDate).toLocaleDateString(undefined, { weekday: "long" });
  }, [timeLogDate]);

  const { timeIn, timeOut, break: breakMinutes } = watch("timeLog");
  const totalHours = useMemo(() => {
    if (!timeIn || !timeOut) return "0.00";
    const start = new Date(`2000-01-01T${timeIn}`);
    const end = new Date(`2000-01-01T${timeOut}`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    if (diff < 0) diff += 24;
    const breakHrs = parseFloat(breakMinutes || "0") / 60;
    return Math.max(0, diff - breakHrs).toFixed(2);
  }, [timeIn, timeOut, breakMinutes]);

  useEffect(() => {
    setValue("timeLog.totalHours", totalHours);
  }, [totalHours, setValue]);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([
          supabase.from("caregivers").select("id, first_name, last_name, role").eq("status", "Active"),
          supabase.from("patients").select("id, first_name, last_name, room_number").eq("status", "Active"),
        ]);
        if (cRes.error) throw cRes.error;
        if (pRes.error) throw pRes.error;
        setCaregivers(cRes.data || []);
        setPatients(pRes.data || []);
      } catch (e: any) {
        toast({ title: "Error", description: e.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("timesheets").insert({
        ...data,
        submitted_at: new Date().toISOString(),
        status: "submitted",
      });
      if (error) throw error;
      toast({ title: "Success", description: "Timesheet submitted!" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">Loading…</div>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Notice */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-orange-800 text-center">
                    ⚠️ Please use a different timesheet for each patient
                  </p>
                </CardContent>
              </Card>

              {/* Provider & Patient */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" /> Provider and Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Care Giver</Label>
                    <Controller
                      name="caregiverId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select caregiver" />
                          </SelectTrigger>
                          <SelectContent>
                            {caregivers.map(c => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.first_name} {c.last_name} - {c.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.caregiverId && <p className="text-sm text-red-600 mt-1">{errors.caregiverId.message}</p>}
                  </div>
                  <div>
                    <Label>Patient</Label>
                    <Controller
                      name="patientId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.first_name} {p.last_name} - Room {p.room_number}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.patientId && <p className="text-sm text-red-600 mt-1">{errors.patientId.message}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Time Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Time Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Date</Label>
                    <Controller
                      name="timeLog.date"
                      control={control}
                      render={({ field }) => <Input type="date" {...field} />}
                    />
                    {dayOfWeek && <div className="text-xs text-muted-foreground mt-1">{dayOfWeek}</div>}
                    {errors.timeLog?.date && <p className="text-sm text-red-600 mt-1">{errors.timeLog.date.message}</p>}
                  </div>
                  <div>
                    <Label>Time In</Label>
                    <Controller
                      name="timeLog.timeIn"
                      control={control}
                      render={({ field }) => <Input type="time" {...field} />}
                    />
                    {errors.timeLog?.timeIn && <p className="text-sm text-red-600 mt-1">{errors.timeLog.timeIn.message}</p>}
                  </div>
                  <div>
                    <Label>Time Out</Label>
                    <Controller
                      name="timeLog.timeOut"
                      control={control}
                      render={({ field }) => <Input type="time" {...field} />}
                    />
                    {errors.timeLog?.timeOut && <p className="text-sm text-red-600 mt-1">{errors.timeLog.timeOut.message}</p>}
                  </div>
                  <div>
                    <Label>Break (mins)</Label>
                    <Controller
                      name="timeLog.break"
                      control={control}
                      render={({ field }) => <Input type="number" {...field} placeholder="0" />}
                    />
                    {errors.timeLog?.break && <p className="text-sm text-red-600 mt-1">{errors.timeLog.break.message}</p>}
                  </div>
                  <div>
                    <Label>Sleep In?</Label>
                    <Controller
                      name="timeLog.sleepIn"
                      control={control}
                      render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
                    />
                  </div>
                  <div>
                    <Label>Total Hours</Label>
                    <div className="font-medium">{totalHours}</div>
                  </div>
                  <div>
                    <Label>Miles</Label>
                    <Controller
                      name="timeLog.miles"
                      control={control}
                      render={({ field }) => <Input type="number" step="0.1" {...field} placeholder="0" />}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Duties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5" /> Care Plan Activities
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Check which items you worked on with the patient
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                  {[
                    { title: "Personal Care Tasks", tasks: personalCareTasks, key: "personalCare" as const },
                    { title: "Home Management Tasks", tasks: homeManagementTasks, key: "homeManagement" as const },
                    { title: "Activities", tasks: activitiesTasks, key: "activities" as const },
                  ].map(({ title, tasks, key }) => (
                    <Card key={title} className="flex-1">
                      <CardHeader>
                        <CardTitle>{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {tasks.map(task => (
                          <div key={task} className="flex items-center">
                            <Controller
                              name={`duties.${key}.${task}`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                            <Label className="ml-2">{task}</Label>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Additional Comments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Additional Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label>Additional Comments or Notes About the Patient</Label>
                  <Controller
                    name="additionalComments"
                    control={control}
                    render={({ field }) => (
                      <Textarea rows={4} {...field} placeholder="Enter any additional comments or observations…" />
                    )}
                  />
                </CardContent>
              </Card>

              {/* Agreement */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle>Employee Agreement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>I agree not to accept employment with the Patient for the term of employment with American Care Team, LLC and for one (1) year after the termination of my employment with American Care Team, LLC.</p>
                  <p>I declare that I have sustained no injury on this assigned job.</p>
                  <p>By signing this time sheet, I certify that all services have been provided in accordance with the Patient's healthcare assessment and I have delivered all service hours shown on the time sheet.</p>
                  <p className="font-semibold">In order to be paid, I understand this time sheet must be completed and signed by both me and the patient.</p>
                  <p className="font-semibold text-red-600">All completed time sheets must be submitted daily after shift.</p>
                </CardContent>
              </Card>

              {/* Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5" /> Signatures
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Employee Signature</h4>
                    <SignatureCanvas
                      ref={ref => setSigPadEmp(ref)}
                      canvasProps={{ className: "border-2 border-dashed rounded-lg w-full h-32 bg-gray-50" }}
                      onEnd={() => setValue("employeeSignature", sigPadEmp!.toDataURL())}
                    />
                    <Controller
                      name="employeeDate"
                      control={control}
                      render={({ field }) => <Input type="date" {...field} />}
                    />
                    {errors.employeeSignature && <p className="text-sm text-red-600 mt-1">{errors.employeeSignature.message}</p>}
                    {errors.employeeDate && <p className="text-sm text-red-600 mt-1">{errors.employeeDate.message}</p>}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        sigPadEmp?.clear();
                        setValue("employeeSignature", "");
                      }}
                    >
                      Clear
                    </Button>
                  </div>

                  {/* Patient */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Patient Signature</h4>
                    <SignatureCanvas
                      ref={ref => setSigPadPat(ref)}
                      canvasProps={{ className: "border-2 border-dashed rounded-lg w-full h-32 bg-gray-50" }}
                      onEnd={() => setValue("patientSignature", sigPadPat!.toDataURL())}
                    />
                    <Controller
                      name="patientDate"
                      control={control}
                      render={({ field }) => <Input type="date" {...field} />}
                    />
                    {errors.patientSignature && <p className="text-sm text-red-600 mt-1">{errors.patientSignature.message}</p>}
                    {errors.patientDate && <p className="text-sm text-red-600 mt-1">{errors.patientDate.message}</p>}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        sigPadPat?.clear();
                        setValue("patientSignature", "");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-center gap-4 pt-6">
                <Button type="button" variant="outline" size="lg">
                  Save as Draft
                </Button>
                <Button type="submit" size="lg" className="bg-gradient-primary text-white hover:opacity-90">
                  Submit Timesheet
                </Button>
              </div>
            </form>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
