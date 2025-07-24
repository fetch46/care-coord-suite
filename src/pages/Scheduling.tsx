import { useState } from "react";
import { Calendar, Clock, Plus, Filter, Search, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppHeader } from "@/components/ui/app-header";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const mockAppointments = [
  {
    id: "1",
    patient_name: "John Smith",
    caregiver_name: "Dr. Sarah Johnson",
    title: "Routine Checkup",
    appointment_date: new Date(2024, 1, 15, 9, 0),
    duration_minutes: 30,
    status: "scheduled",
    appointment_type: "checkup"
  },
  {
    id: "2",
    patient_name: "Emily Davis",
    caregiver_name: "Nurse Mike Wilson",
    title: "Medication Review",
    appointment_date: new Date(2024, 1, 15, 10, 30),
    duration_minutes: 45,
    status: "confirmed",
    appointment_type: "medication"
  },
  {
    id: "3",
    patient_name: "Robert Brown",
    caregiver_name: "Dr. Lisa Chen",
    title: "Physical Therapy",
    appointment_date: new Date(2024, 1, 16, 14, 0),
    duration_minutes: 60,
    status: "completed",
    appointment_type: "therapy"
  }
];

const statusColors = {
  scheduled: "bg-blue-500/10 text-blue-700 border-blue-200",
  confirmed: "bg-green-500/10 text-green-700 border-green-200",
  completed: "bg-gray-500/10 text-gray-700 border-gray-200",
  cancelled: "bg-red-500/10 text-red-700 border-red-200",
  no_show: "bg-orange-500/10 text-orange-700 border-orange-200"
};

const typeColors = {
  consultation: "bg-purple-500/10 text-purple-700 border-purple-200",
  treatment: "bg-blue-500/10 text-blue-700 border-blue-200",
  checkup: "bg-green-500/10 text-green-700 border-green-200",
  therapy: "bg-teal-500/10 text-teal-700 border-teal-200",
  medication: "bg-orange-500/10 text-orange-700 border-orange-200",
  emergency: "bg-red-500/10 text-red-700 border-red-200"
};

export default function Scheduling() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const getWeekDays = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const filteredAppointments = mockAppointments.filter(appointment => {
    const matchesSearch = appointment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.caregiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
    const matchesType = typeFilter === "all" || appointment.appointment_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(apt => 
      isSameDay(new Date(apt.appointment_date), date)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Scheduling</h1>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar with Calendar and Filters */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border-0"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search appointments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="checkup">Checkup</SelectItem>
                      <SelectItem value="therapy">Therapy</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <Tabs defaultValue="week" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="week">Week View</TabsTrigger>
                <TabsTrigger value="day">Day View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="week" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Week of {format(selectedDate, "MMMM d, yyyy")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                      {getWeekDays(selectedDate).map((day, index) => (
                        <div key={index} className="border rounded-lg p-3 min-h-32">
                          <div className="font-medium text-sm mb-2">
                            {format(day, "EEE d")}
                          </div>
                          <div className="space-y-1">
                            {getAppointmentsForDate(day).map((apt) => (
                              <div
                                key={apt.id}
                                className="text-xs p-1 rounded bg-primary/10 text-primary border border-primary/20"
                              >
                                {format(new Date(apt.appointment_date), "HH:mm")} - {apt.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="day" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getAppointmentsForDate(selectedDate).length > 0 ? (
                        getAppointmentsForDate(selectedDate).map((appointment) => (
                          <div key={appointment.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-sm font-medium text-muted-foreground">
                                  {format(new Date(appointment.appointment_date), "HH:mm")}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{appointment.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {appointment.patient_name} with {appointment.caregiver_name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={typeColors[appointment.appointment_type as keyof typeof typeColors]}>
                                  {appointment.appointment_type}
                                </Badge>
                                <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                                  {appointment.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p>No appointments scheduled for this day</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5" />
                      All Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                          <div key={appointment.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <h3 className="font-semibold">{appointment.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.patient_name} with {appointment.caregiver_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(appointment.appointment_date), "EEEE, MMMM d, yyyy 'at' HH:mm")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={typeColors[appointment.appointment_type as keyof typeof typeColors]}>
                                  {appointment.appointment_type}
                                </Badge>
                                <Badge className={statusColors[appointment.status as keyof typeof statusColors]}>
                                  {appointment.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                          <p>No appointments found matching your filters</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}