import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { ArrowLeft, Phone, Mail, Clock, MapPin, Calendar, User, FileText, Users, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Caregiver } from "@shared/schema";

interface PatientAssignment {
  id: string;
  patientId: string;
  assignmentDate: string;
  isPrimary: boolean;
  notes?: string;
  patient: {
    firstName: string;
    lastName: string;
    roomNumber: string;
    careLevel: string;
  };
}

interface AvailabilityData {
  caregiverId: string;
  dayOfWeek: string;
  shift: string;
  isAvailable: boolean;
}

interface TimesheetSubmission {
  id: string;
  date: string;
  patientName: string;
  checkIn: string;
  checkOut: string;
  status: string;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const shifts = ["7-3", "3-11", "11-7"];

export default function StaffDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<{[key: string]: string[]}>({});

  // Fetch caregiver details
  const { data: caregiver, isLoading: caregiverLoading } = useQuery({
    queryKey: ["/api/caregivers", id],
    queryFn: () => apiRequest(`/api/caregivers/${id}`),
    enabled: !!id,
  });

  // Fetch patient assignments
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/caregivers", id, "assignments"],
    queryFn: () => apiRequest(`/api/caregivers/${id}/assignments`),
    enabled: !!id,
  });

  // Fetch availability
  const { data: availability = [], isLoading: availabilityLoading } = useQuery({
    queryKey: ["/api/caregivers", id, "availability"],
    queryFn: () => apiRequest(`/api/caregivers/${id}/availability`),
    enabled: !!id,
  });

  // Fetch timesheet submissions
  const { data: timesheets = [], isLoading: timesheetsLoading } = useQuery({
    queryKey: ["/api/caregivers", id, "timesheets"],
    queryFn: () => apiRequest(`/api/caregivers/${id}/timesheets`),
    enabled: !!id,
  });

  // Save availability mutation
  const saveAvailability = useMutation({
    mutationFn: (availabilityData: AvailabilityData[]) => 
      apiRequest(`/api/caregivers/${id}/availability`, {
        method: "POST",
        body: JSON.stringify({ availability: availabilityData }),
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/caregivers", id, "availability"] });
      setAvailabilityDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    },
  });

  const handleAvailabilityChange = (day: string, shift: string) => {
    setSelectedAvailability(prev => {
      const dayShifts = prev[day] || [];
      const newShifts = dayShifts.includes(shift)
        ? dayShifts.filter(s => s !== shift)
        : [...dayShifts, shift];
      
      return { ...prev, [day]: newShifts };
    });
  };

  const handleSaveAvailability = () => {
    const availabilityData: AvailabilityData[] = [];
    
    daysOfWeek.forEach(day => {
      shifts.forEach(shift => {
        const isAvailable = selectedAvailability[day]?.includes(shift) || false;
        availabilityData.push({
          caregiverId: id!,
          dayOfWeek: day,
          shift,
          isAvailable,
        });
      });
    });

    saveAvailability.mutate(availabilityData);
  };

  // Initialize availability state
  useEffect(() => {
    if (availability.length > 0) {
      const availMap: {[key: string]: string[]} = {};
      availability.forEach((item: any) => {
        if (item.isAvailable) {
          if (!availMap[item.dayOfWeek]) {
            availMap[item.dayOfWeek] = [];
          }
          availMap[item.dayOfWeek].push(item.shift);
        }
      });
      setSelectedAvailability(availMap);
    }
  }, [availability]);

  if (caregiverLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Loading staff details...</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  if (!caregiver) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset>
            <AppHeader />
            <div className="flex items-center justify-center h-full">
              <div className="text-center">Staff member not found</div>
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
            <div className="w-full space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <Link href="/staff">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Staff
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Staff Details</h1>
              </div>

              {/* Staff Profile Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={caregiver.profileImageUrl} />
                        <AvatarFallback className="text-xl">
                          {caregiver.firstName?.[0]}{caregiver.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {caregiver.firstName} {caregiver.lastName}
                        </h2>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{caregiver.role}</Badge>
                          <Badge variant="outline">{caregiver.specialization}</Badge>
                          <Badge variant="outline">{caregiver.shift}</Badge>
                          <Badge 
                            variant={caregiver.status === "Active" ? "default" : "destructive"}
                          >
                            {caregiver.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{caregiver.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{caregiver.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>Shift: {caregiver.shift}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span>Timesheets: {timesheets.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Availability Button */}
                    <div className="flex-shrink-0">
                      <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Set Availability
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Set Staff Availability</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid gap-4">
                              {daysOfWeek.map(day => (
                                <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                                  <Label className="font-medium">{day}</Label>
                                  <div className="flex gap-2">
                                    {shifts.map(shift => (
                                      <div key={shift} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`${day}-${shift}`}
                                          checked={selectedAvailability[day]?.includes(shift) || false}
                                          onCheckedChange={() => handleAvailabilityChange(day, shift)}
                                        />
                                        <Label htmlFor={`${day}-${shift}`} className="text-sm">
                                          {shift}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => setAvailabilityDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleSaveAvailability}
                                disabled={saveAvailability.isPending}
                              >
                                {saveAvailability.isPending ? "Saving..." : "Save Availability"}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="assignments" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="assignments" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Assignments</span>
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Availability</span>
                  </TabsTrigger>
                  <TabsTrigger value="timesheets" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Timesheets</span>
                  </TabsTrigger>
                  <TabsTrigger value="assessments" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Assessments</span>
                  </TabsTrigger>
                </TabsList>

                {/* Patient Assignments Tab */}
                <TabsContent value="assignments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assignmentsLoading ? (
                        <div className="text-center py-4">Loading assignments...</div>
                      ) : assignments.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No patient assignments found
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Care Level</TableHead>
                              <TableHead>Assignment Date</TableHead>
                              <TableHead>Primary</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {assignments.map((assignment: PatientAssignment) => (
                              <TableRow key={assignment.id}>
                                <TableCell className="font-medium">
                                  {assignment.patient.firstName} {assignment.patient.lastName}
                                </TableCell>
                                <TableCell>{assignment.patient.roomNumber}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{assignment.patient.careLevel}</Badge>
                                </TableCell>
                                <TableCell>
                                  {new Date(assignment.assignmentDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {assignment.isPrimary ? (
                                    <Badge variant="default">Primary</Badge>
                                  ) : (
                                    <Badge variant="secondary">Secondary</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Availability Tab */}
                <TabsContent value="availability">
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Availability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {availabilityLoading ? (
                        <div className="text-center py-4">Loading availability...</div>
                      ) : (
                        <div className="space-y-4">
                          {daysOfWeek.map(day => {
                            const dayAvailability = availability.filter((item: any) => 
                              item.dayOfWeek === day && item.isAvailable
                            );
                            return (
                              <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                                <Label className="font-medium">{day}</Label>
                                <div className="flex gap-2">
                                  {dayAvailability.length > 0 ? (
                                    dayAvailability.map((item: any) => (
                                      <Badge key={item.shift} variant="default">
                                        {item.shift}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Not available</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Timesheets Tab */}
                <TabsContent value="timesheets">
                  <Card>
                    <CardHeader>
                      <CardTitle>Submitted Timesheets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {timesheetsLoading ? (
                        <div className="text-center py-4">Loading timesheets...</div>
                      ) : timesheets.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No timesheets submitted yet
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Patient</TableHead>
                              <TableHead>Check In</TableHead>
                              <TableHead>Check Out</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {timesheets.map((timesheet: TimesheetSubmission) => (
                              <TableRow key={timesheet.id}>
                                <TableCell>
                                  {new Date(timesheet.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{timesheet.patientName}</TableCell>
                                <TableCell>{timesheet.checkIn}</TableCell>
                                <TableCell>{timesheet.checkOut}</TableCell>
                                <TableCell>
                                  <Badge variant={timesheet.status === "Approved" ? "default" : "secondary"}>
                                    {timesheet.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assessments Tab */}
                <TabsContent value="assessments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Assessments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-4 text-muted-foreground">
                        Assessment functionality coming soon
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
