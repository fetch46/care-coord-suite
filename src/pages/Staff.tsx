import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, UserCheck, Clock, Phone, Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [shiftFilter, setShiftFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCaregivers(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchCaregivers = async (query = "") => {
    setLoading(true);
    setError(null);
    try {
      let request = supabase.from("caregivers").select("*").order("last_name");

      if (query) {
        request = request.or(
          `first_name.ilike.%${query}%,last_name.ilike.%${query}%,role.ilike.%${query}%,specialization.ilike.%${query}%`
        );
      }

      const { data, error } = await request;
      if (error) throw error;
      setCaregivers(data || []);
    } catch (err) {
      console.error("Error fetching caregivers:", err);
      setError("Failed to load staff. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCaregivers = useMemo(() => {
    return caregivers.filter(c =>
      (!roleFilter || c.role === roleFilter) &&
      (!shiftFilter || c.shift === shiftFilter) &&
      (!statusFilter || c.status === statusFilter)
    );
  }, [caregivers, roleFilter, shiftFilter, statusFilter]);

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
        <div className="flex h-screen w-screen">
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
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full space-y-8">

              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
                  <p className="text-muted-foreground mt-1">Manage caregivers and healthcare staff</p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6 flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search staff by name, role, or specialization..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setRoleFilter(null)}>All Roles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("Doctor")}>Doctors</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("Nurse")}>Nurses</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("Therapist")}>Therapists</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRoleFilter("Administrator")}>Administrators</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShiftFilter("Day")}>Day Shift</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShiftFilter("Night")}>Night Shift</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShiftFilter("Rotating")}>Rotating Shift</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>Inactive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>

              {/* Error State */}
              {error && (
                <Card>
                  <CardContent className="p-6 text-center text-red-600 flex items-center justify-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </CardContent>
                </Card>
              )}

              {/* Staff Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCaregivers.map((caregiver) => (
                  <Card
                    key={caregiver.id}
                    className="hover:shadow-lg transition-shadow border rounded-lg overflow-hidden bg-white"
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                      <Avatar className="w-20 h-20 shadow-md border-2 border-gray-100">
                        <AvatarImage src={caregiver.profile_image_url} />
                        <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-lg">
                          {caregiver.first_name[0]}{caregiver.last_name[0]}
                        </AvatarFallback>
                      </Avatar>

                      <h3 className="font-semibold text-lg">{caregiver.first_name} {caregiver.last_name}</h3>
                      <Badge className={getRoleColor(caregiver.role)}>{caregiver.role}</Badge>

                      {caregiver.specialization && (
                        <p className="text-sm text-muted-foreground">{caregiver.specialization}</p>
                      )}

                      <div className="w-full space-y-2">
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

                      <div className="flex items-center gap-2 mt-2">
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <Badge 
                          variant={caregiver.status === "Active" ? "default" : "secondary"}
                          className={caregiver.status === "Active" ? "bg-green-100 text-green-800" : ""}
                        >
                          {caregiver.status}
                        </Badge>
                      </div>

                      <Link to={`/staff/${caregiver.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCaregivers.length === 0 && !error && (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center text-muted-foreground">
                      {searchTerm || roleFilter || shiftFilter || statusFilter 
                        ? "No staff found matching your filters." 
                        : "No staff found."}
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
