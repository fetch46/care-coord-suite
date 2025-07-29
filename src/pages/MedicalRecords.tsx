import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface MedicalRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  record_date: string;
  diagnosis: string;
  treatment: string;
  doctor_name: string;
  status: string;
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    // Dummy medical records for development
    const dummyData: MedicalRecord[] = [
      {
        id: "record-1",
        patient_id: "patient-1",
        patient_name: "John Doe",
        record_date: "2025-07-20",
        diagnosis: "Hypertension",
        treatment: "Prescribed medication and lifestyle changes",
        doctor_name: "Dr. Adams",
        status: "Open",
      },
      {
        id: "record-2",
        patient_id: "patient-1",
        patient_name: "John Doe",
        record_date: "2025-06-15",
        diagnosis: "Diabetes Type 2",
        treatment: "Insulin therapy initiated",
        doctor_name: "Dr. Lee",
        status: "Closed",
      },
      {
        id: "record-3",
        patient_id: "patient-2",
        patient_name: "Jane Smith",
        record_date: "2025-07-22",
        diagnosis: "Asthma",
        treatment: "Inhaler prescribed",
        doctor_name: "Dr. Patel",
        status: "Open",
      },
      {
        id: "record-4",
        patient_id: "patient-2",
        patient_name: "Jane Smith",
        record_date: "2025-05-10",
        diagnosis: "Allergic Rhinitis",
        treatment: "Antihistamines and nasal spray",
        doctor_name: "Dr. Brown",
        status: "Closed",
      },
    ];

    setRecords(dummyData);
    setTotalRecords(dummyData.length);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredRecords = records.filter((record) =>
    record.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const paginatedRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);

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
                  <h1 className="text-3xl font-bold text-foreground">Medical Records</h1>
                  <p className="text-muted-foreground mt-1">
                    View and manage patient medical records
                  </p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90" asChild>
                  <Link to="/medical-records/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Record
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
                        placeholder="Search by patient, diagnosis, or doctor..."
                        value={searchTerm}
                        onChange={(e) => {
                          setPage(1);
                          setSearchTerm(e.target.value);
                        }}
                        className="pl-10"
                        aria-label="Search medical records"
                      />
                    </div>
                    <Button variant="outline" aria-label="Filter medical records">
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
                        <Skeleton className="h-4 w-1/4 rounded" />
                        <Skeleton className="h-4 w-1/6 rounded" />
                        <Skeleton className="h-4 w-1/6 rounded" />
                        <Skeleton className="h-4 w-1/6 rounded" />
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
                          <TableHead>Date</TableHead>
                          <TableHead>Diagnosis</TableHead>
                          <TableHead>Treatment</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRecords.map((record) => (
                          <TableRow key={record.id} className="hover:bg-muted/50">
                            <TableCell>{record.patient_name}</TableCell>
                            <TableCell>{formatDate(record.record_date)}</TableCell>
                            <TableCell className="max-w-[200px] truncate" title={record.diagnosis}>
                              {record.diagnosis}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={record.treatment}>
                              {record.treatment}
                            </TableCell>
                            <TableCell>{record.doctor_name}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/medical-records/${record.id}`}>
                                  View Details
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {paginatedRecords.length === 0 && !loading && (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchTerm
                          ? "No medical records found matching your search."
                          : "No medical records found."}
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
