import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // You may need to create this component or use a library

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  room_number: string;
  care_level: string;
  status: string;
  profile_image_url?: string;
  patient_allergies: Array<{
    allergy_name: string;
    severity: string;
  }>;
}

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);

  useEffect(() => {
    fetchPatients();
  }, [searchTerm, page]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("patients")
        .select(
          `
          *,
          patient_allergies (
            allergy_name,
            severity
          )
        `,
          { count: "exact" }
        )
        .order("last_name")
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (searchTerm.trim()) {
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,room_number.ilike.%${searchTerm}%`
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setPatients(data || []);
      setTotalPatients(count || 0);
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCareLevelColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Life-threatening": return "bg-red-100 text-red-800";
      case "Severe": return "bg-orange-100 text-orange-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "Mild": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const totalPages = Math.ceil(totalPatients / pageSize);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-none w-full space-y-8">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Patients</h1>
                  <p className="text-muted-foreground mt-1">Manage patient information and care details</p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/patient-registration">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patient
                  </Link>
                </Button>
              </div>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-12">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search patients by name or room number..."
                        value={searchTerm}
                        onChange={(e) => {
                          setPage(1);
                          setSearchTerm(e.target.value);
                        }}
                        className="pl-10"
                        aria-label="Search patients"
                      />
                    </div>
                    <Button variant="outline" aria-label="Filter patients">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Error State */}
              {error && (
                <div className="text-red-600 text-center py-4">{error}</div>
              )}

              {/* Loading State */}
              {loading ? (
                <Card>
                  <CardContent className="p-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 py-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/6" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Age/Gender</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Care Level</TableHead>
                          <TableHead>Allergies</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients.map((patient) => (
                          <TableRow key={patient.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={patient.profile_image_url} />
                                  <AvatarFallback className="bg-gradient-teal text-white">
                                    {patient.first_name[0]}{patient.last_name[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">
                                    {patient.first_name} {patient.last_name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {patient.id.slice(0, 8)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{calculateAge(patient.date_of_birth)} years</div>
                                <div className="text-muted-foreground">{patient.gender}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {patient.room_number}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={getCareLevelColor(patient.care_level)}>
                                {patient.care_level}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {patient.patient_allergies.slice(0, 2).map((allergy, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className={`text-xs ${getSeverityColor(allergy.severity)}`}
                                  >
                                    {allergy.allergy_name}
                                  </Badge>
                                ))}
                                {patient.patient_allergies.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{patient.patient_allergies.length - 2} more
                                  </Badge>
                                )}
                                {patient.patient_allergies.length === 0 && (
                                  <span className="text-sm text-muted-foreground">None</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={patient.status === "Active" ? "default" : "secondary"}
                                className={patient.status === "Active" ? "bg-green-100 text-green-800" : ""}
                              >
                                {patient.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/patients/${patient.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {patients.length === 0 && !loading && (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No patients found matching your search." : "No patients found."}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
