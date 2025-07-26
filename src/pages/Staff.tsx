import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, UserCheck, Clock, Phone, Mail } from "lucide-react";
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

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  specialization: string;
  shift: string;
  status: string;
  phone: string;
  email: string;
  profile_image_url?: string;
}

export default function Staff() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaregivers();
  }, []);

  const fetchCaregivers = async () => {
    try {
      const { data, error } = await supabase
        .from("caregivers")
        .select("*")
        .order("last_name");

      if (error) throw error;
      setCaregivers(data || []);
    } catch (error) {
      console.error("Error fetching caregivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCaregivers = caregivers.filter(caregiver =>
    `${caregiver.first_name} ${caregiver.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caregiver.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Doctor": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Nurse": return "bg-green-100 text-green-800 border-green-200";
      case "Therapist": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Administrator": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case "Day": return "bg-yellow-100 text-yellow-800";
      case "Night": return "bg-indigo-100 text-indigo-800";
      case "Rotating": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading staff...</div>
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
            <div className="container mx-auto max-w-7xl space-y-6 sm:space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Staff Management</h1>
                  <p className="text-muted-foreground mt-1">Manage caregivers and healthcare staff</p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90 w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>

              {/* Search and Filter */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search staff by name, role, or specialization..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Staff Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredCaregivers.map((caregiver) => (
                  <Card key={caregiver.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={caregiver.profile_image_url} />
                          <AvatarFallback className="bg-gradient-teal text-white text-lg">
                            {caregiver.first_name[0]}{caregiver.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">
                            {caregiver.first_name} {caregiver.last_name}
                          </h3>
                          <Badge className={getRoleColor(caregiver.role)}>
                            {caregiver.role}
                          </Badge>
                          {caregiver.specialization && (
                            <p className="text-sm text-muted-foreground">
                              {caregiver.specialization}
                            </p>
                          )}
                        </div>

                        <div className="w-full space-y-3">
                          {caregiver.shift && (
                            <div className="flex items-center justify-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <Badge variant="secondary" className={getShiftColor(caregiver.shift)}>
                                {caregiver.shift} Shift
                              </Badge>
                            </div>
                          )}
                          
                          {caregiver.phone && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{caregiver.phone}</span>
                            </div>
                          )}
                          
                          {caregiver.email && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{caregiver.email}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-green-600" />
                          <Badge 
                            variant={caregiver.status === "Active" ? "default" : "secondary"}
                            className={caregiver.status === "Active" ? "bg-green-100 text-green-800" : ""}
                          >
                            {caregiver.status}
                          </Badge>
                        </div>

                        <Link to={`/staff/${caregiver.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCaregivers.length === 0 && (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center text-muted-foreground">
                      {searchTerm ? "No staff found matching your search." : "No staff found."}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
