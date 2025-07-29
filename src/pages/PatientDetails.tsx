"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import {
  AlertTriangle,
  Phone,
  Mail,
  User,
  Calendar,
  Heart,
  ArrowLeft,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/ui/app-header";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  gender: string;
  date_of_birth: string;
  status: string;
  avatar_url: string | null;
}

interface Allergy {
  allergy_name: string;
}

interface Caregiver {
  id: string;
  full_name: string;
  phone_number: string;
}

export default function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [activeTab, setActiveTab] = useState("records");

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();
      if (data) setPatient(data);
    };

    const fetchAllergies = async () => {
      const { data } = await supabase
        .from("patient_allergies")
        .select("allergy_name")
        .eq("patient_id", id);
      if (data) setAllergies(data);
    };

    const fetchCaregivers = async () => {
      const { data } = await supabase
        .from("patient_assignments")
        .select("caregiver_id, caregivers(full_name, phone_number)")
        .eq("patient_id", id);

      if (data) {
        const caregiversList = data.map((item: any) => ({
          id: item.caregiver_id,
          full_name: item.caregivers.full_name,
          phone_number: item.caregivers.phone_number,
        }));
        setCaregivers(caregiversList);
      }
    };

    fetchPatient();
    fetchAllergies();
    fetchCaregivers();
  }, [id]);

  if (!patient) {
    return <div className="p-8 text-center">Loading patient data...</div>;
  }

  return (
    <SidebarProvider>
      <AppHeader />
      <AppSidebar />

      <SidebarInset>
        <div className="p-6 space-y-6">
          <Link
            to="/patients"
            className="inline-flex items-center text-sm text-muted-foreground hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to patients
          </Link>

          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={patient.avatar_url || undefined} />
                  <AvatarFallback>
                    {patient.first_name[0]}
                    {patient.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold">
                    {patient.first_name} {patient.last_name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground flex gap-2 items-center">
                    <User className="h-4 w-4" />
                    {patient.gender} • <Calendar className="h-4 w-4" />
                    {new Date(patient.date_of_birth).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-sm px-3 py-1 rounded-full",
                  patient.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
                )}
              >
                {patient.status}
              </Badge>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {patient.phone_number}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {patient.email}
              </div>
            </CardContent>
          </Card>

          {allergies.length > 0 && (
            <div className="mt-6 border rounded-md border-red-200 bg-red-50 p-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <AlertDescription className="text-sm">
                    <strong>Allergies:</strong>{" "}
                    {allergies.map((a) => a.allergy_name).join(", ")}
                  </AlertDescription>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    className="text-sm px-3 py-1 border border-muted-foreground"
                  >
                    Actions
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-200 z-50">
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <Link
                          to={`/patients/${id}/edit`}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Edit Patient
                        </Link>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => alert("Discharge logic here")}
                        >
                          Discharge Patient
                        </button>
                      </li>
                      <li>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => alert("Print logic here")}
                        >
                          Print Patient Records
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex justify-start overflow-x-auto rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="records" className="rounded-none border-b-2">
                Medical Records
              </TabsTrigger>
              <TabsTrigger value="caregivers" className="rounded-none border-b-2">
                Assigned Caregivers
              </TabsTrigger>
              <TabsTrigger value="assessments" className="rounded-none border-b-2">
                Assessments
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-none border-b-2">
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="records">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="caregivers">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Caregivers</CardTitle>
                </CardHeader>
                <CardContent>
                  {caregivers.length === 0 ? (
                    <p className="text-muted-foreground">No caregivers assigned.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {caregivers.map((caregiver) => (
                          <TableRow key={caregiver.id}>
                            <TableCell>{caregiver.full_name}</TableCell>
                            <TableCell>{caregiver.phone_number}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessments">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Assessment feature coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Billing data not available yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
