"use client";

import { useEffect, useState } from "react"; import { useParams, Link } from "react-router-dom"; import { supabase } from "@/integrations/supabase/client"; import { AppSidebar } from "@/components/ui/app-sidebar"; import { AppHeader } from "@/components/ui/app-header"; import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"; import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"; import { AlertTriangle, Phone, Mail, User } from "lucide-react"; import { AlertDescription } from "@/components/ui/alert"; import { Button } from "@/components/ui/button";

export default function PatientDetails() { const { id } = useParams(); const [patient, setPatient] = useState<any>(null); const [allergies, setAllergies] = useState<any[]>([]); const [activeTab, setActiveTab] = useState("details");

useEffect(() => { async function fetchData() { const { data, error } = await supabase .from("patients") .select("*, allergies (id, allergy_name)") .eq("id", id) .single();

if (!error && data) {
    setPatient(data);
    setAllergies(data.allergies || []);
  }
}

fetchData();

}, [id]);

if (!patient) { return <div className="p-8">Loading patient details...</div>; }

return ( <SidebarProvider> <div className="flex min-h-screen"> <AppSidebar /> <div className="flex-1"> <AppHeader /> <SidebarInset> <div className="p-6 max-w-6xl mx-auto"> <Card className="mb-6"> <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8"> <Avatar className="w-20 h-20"> <AvatarImage src={patient.photo_url} alt={patient.full_name} /> <AvatarFallback> {patient.full_name?.charAt(0)} </AvatarFallback> </Avatar> <div className="flex-1 w-full"> <CardTitle className="text-xl font-bold">{patient.full_name}</CardTitle> <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1"> <User className="w-4 h-4" /> {patient.gender} - {patient.age} years </div> <div className="text-sm text-muted-foreground flex items-center gap-2"> <Phone className="w-4 h-4" /> {patient.phone_number} </div> <div className="text-sm text-muted-foreground flex items-center gap-2"> <Mail className="w-4 h-4" /> {patient.email} </div> </div> </CardHeader> </Card>

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
                  <Button variant="ghost" className="text-sm px-3 py-1 border border-muted-foreground">
                    Actions
                  </Button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-200 z-50">
                    <ul className="py-1 text-sm text-gray-700">
                      <li>
                        <Link to={`/patients/${id}/edit`} className="block px-4 py-2 hover:bg-gray-100">
                          Edit Patient
                        </Link>
                      </li>
                      <li>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => alert("Discharge logic here")}>Discharge Patient</button>
                      </li>
                      <li>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => alert("Print logic here")}>Print Patient Records</button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="justify-start gap-2 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="caregivers">Caregivers</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Medical Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Treatment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-05-01</TableCell>
                        <TableCell>Flu</TableCell>
                        <TableCell>Paracetamol</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="caregivers">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Caregivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">List of assigned caregivers will go here.</p>
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
                    Assessments for patient ID: <strong>{id}</strong> will appear here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Billing records will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </div>
  </div>
</SidebarProvider>

); }

