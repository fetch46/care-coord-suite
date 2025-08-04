import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, UserPlus, Bed, Save } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const admissionSchema = z.object({
  patient_id: z.string().min(1, "Please select a patient"),
  room_id: z.string().min(1, "Please select a room"),
  admission_type: z.string().default("regular"),
  attending_physician: z.string().min(1, "Attending physician is required"),
  admission_notes: z.string().optional(),
  insurance_authorization: z.string().optional(),
  estimated_length_of_stay: z.number().min(1, "Please enter estimated length of stay").optional(),
  care_level: z.string().optional(),
  special_requirements: z.string().optional(),
  emergency_contact_notified: z.boolean().default(false),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  status: string;
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  status: string;
  capacity: number;
}

export default function PatientAdmission() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  
  const preselectedPatientId = searchParams.get('patient_id');

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      patient_id: preselectedPatientId || "",
      room_id: "",
      admission_type: "regular",
      attending_physician: "",
      admission_notes: "",
      insurance_authorization: "",
      care_level: "",
      special_requirements: "",
      emergency_contact_notified: false,
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, roomsRes] = await Promise.all([
        supabase
          .from("patients")
          .select("id, first_name, last_name, date_of_birth, status")
          .eq("status", "Active")
          .order("last_name"),
        supabase
          .from("rooms")
          .select("*")
          .eq("status", "available")
          .order("room_number"),
      ]);

      if (patientsRes.data) setPatients(patientsRes.data);
      if (roomsRes.data) setRooms(roomsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load admission data",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: AdmissionFormData) => {
    setLoading(true);
    try {
      // Create admission record
      const { data: admission, error: admissionError } = await supabase
        .from("admissions")
        .insert({
          patient_id: data.patient_id,
          room_id: data.room_id,
          admission_type: data.admission_type,
          attending_physician: data.attending_physician,
          admission_notes: data.admission_notes,
          insurance_authorization: data.insurance_authorization,
          estimated_length_of_stay: data.estimated_length_of_stay,
          care_level: data.care_level,
          special_requirements: data.special_requirements,
          emergency_contact_notified: data.emergency_contact_notified,
          admission_status: "admitted",
        })
        .select()
        .single();

      if (admissionError) throw admissionError;

      // Update room status to occupied
      await supabase
        .from("rooms")
        .update({ status: "occupied" })
        .eq("id", data.room_id);

      // Update patient status to admitted
      await supabase
        .from("patients")
        .update({ status: "Admitted" })
        .eq("id", data.patient_id);

      toast({
        title: "Success",
        description: "Patient admitted successfully",
      });

      // Navigate to patient details or admissions list
      navigate("/patients");
    } catch (error) {
      console.error("Error creating admission:", error);
      toast({
        title: "Error",
        description: "Failed to admit patient",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-primary" />
                <h1 className="text-3xl font-bold">Patient Admission</h1>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    Admission Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="patient_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {patients.map((patient) => (
                                    <SelectItem key={patient.id} value={patient.id}>
                                      {patient.last_name}, {patient.first_name}
                                      <Badge variant="secondary" className="ml-2">
                                        DOB: {new Date(patient.date_of_birth).toLocaleDateString()}
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="room_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Room *</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select room" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {rooms.map((room) => (
                                    <SelectItem key={room.id} value={room.id}>
                                      Room {room.room_number} ({room.room_type})
                                      <Badge variant="outline" className="ml-2">
                                        Capacity: {room.capacity}
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="admission_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Admission Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="regular">Regular</SelectItem>
                                  <SelectItem value="emergency">Emergency</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="transfer">Transfer</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="attending_physician"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Attending Physician *</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter physician name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="care_level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Care Level</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select care level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="basic">Basic Care</SelectItem>
                                  <SelectItem value="intermediate">Intermediate Care</SelectItem>
                                  <SelectItem value="intensive">Intensive Care</SelectItem>
                                  <SelectItem value="critical">Critical Care</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="estimated_length_of_stay"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Estimated Length of Stay (days)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="Enter days" 
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="insurance_authorization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Authorization Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter authorization number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="special_requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter any special requirements or accommodations" 
                                rows={3}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="admission_notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admission Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter admission notes and observations" 
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          {loading ? "Admitting..." : "Admit Patient"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => navigate("/patients")}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}