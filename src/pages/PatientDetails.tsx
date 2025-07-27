"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, AlertTriangle, User, Calendar, Heart, ArrowLeftCircle } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { PatientAssessments } from "@/components/assessments/patient-assessments";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  admission_date: string;
  room_number: string;
  care_level: string;
  status: string;
  profile_image_url?: string;
}

interface Allergy {
  id: string;
  allergy_name: string;
  severity: string;
  reaction: string;
  notes?: string;
}

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  specialization: string;
  phone: string;
  email: string;
  shift: string;
  profile_image_url?: string;
  is_primary: boolean;
}

interface MedicalRecord {
  id: string;
  record_type: string;
  title: string;
  description: string;
  recorded_by: string;
  recorded_date: string;
}

const tabs = ["overview", "medical-records", "caregivers", "assessments"];

export default function PatientDetails() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    try {
      const { data: patientData, error: patientError } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();

      if (patientError) throw patientError;
      setPatient(patientData);

      const { data: allergiesData, error: allergiesError } = await supabase
        .from("patient_allergies")
        .select("*")
        .eq("patient_id", id);

      if (allergiesError) throw allergiesError;
      setAllergies(allergiesData || []);

      const { data: caregiversData, error: caregiversError } = await supabase
        .from("patient_caregivers")
        .select(`
          is_primary,
          caregivers (
            id,
            first_name,
            last_name,
            role,
            specialization,
            phone,
            email,
            shift,
            profile_image_url
          )
        `)
        .eq("patient_id", id);

      if (caregiversError) throw caregiversError;
      const caregiversWithPrimary = caregiversData?.map(item => ({
        ...item.caregivers,
        is_primary: item.is_primary
      })) || [];
      setCaregivers(caregiversWithPrimary);

      const { data: recordsData, error: recordsError } = await supabase
        .from("medical_records")
        .select("*")
        .eq("patient_id", id)
        .order("recorded_date", { ascending: false });

      if (recordsError) throw recordsError;
      setMedicalRecords(recordsData || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({ title: "Error", description: "Failed to fetch patient data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const ageDifMs = Date.now() - birth.getTime();
    return Math.floor(ageDifMs / (1000 * 60 * 60 * 24 * 365.25));
  };

  const getCareLevelColor = (level: string) => {
    return {
      Critical: "bg-red-100 text-red-800 border-red-200",
      High: "bg-orange-100 text-orange-800 border-orange-200",
      Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Low: "bg-green-100 text-green-800 border-green-200"
    }[level] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getSeverityColor = (severity: string) => {
    return {
      "Life-threatening": "bg-red-100 text-red-800",
      Severe: "bg-orange-100 text-orange-800",
      Moderate: "bg-yellow-100 text-yellow-800",
      Mild: "bg-green-100 text-green-800"
    }[severity] || "bg-gray-100 text-gray-800";
  };

  const handlePrevious = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <Skeleton className="w-1/2 h-8" />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!patient) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Patient not found
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
            <div className="max-w-none w-full space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patients">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Patients
                  </Link>
                </Button>
                {activeTab !== "overview" && (
                  <Button variant="secondary" size="sm" onClick={handlePrevious}>
                    <ArrowLeftCircle className="w-4 h-4 mr-1" /> Previous Tab
                  </Button>
                )}
              </div>
              {/* ...rest of the component remains unchanged... */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="text-left">
                <TabsList className="flex flex-col items-start space-y-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
                  <TabsTrigger value="caregivers">Caregivers</TabsTrigger>
                  <TabsTrigger value="assessments">Assessments</TabsTrigger>
                </TabsList>
                {/* ...TabsContent remains the same... */}
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
