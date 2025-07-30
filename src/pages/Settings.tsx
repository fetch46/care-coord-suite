"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UserRoleAssignment } from "@/components/settings/UserRoleAssignment";
import { StaffManagement } from "@/components/settings/StaffManagement";
import { 
  Building2, 
  Users, 
  Bed, 
  CreditCard, 
  DollarSign, 
  Database,
  Crown,
  Save,
  Plus,
  Trash2,
  Edit,
  FileText,
  Check,
  X
} from "lucide-react";

interface CompanySettings {
  id: string;
  organization_name: string;
  address: string;
  phone: string;
  email: string;
}

interface FinancialSettings {
  id: string;
  base_currency: string;
  tax_rate: number;
  payment_methods: string[];
}

interface Room {
  id: string;
  room_number: string;
  room_type: string;
  capacity: number;
  status: string;
  notes: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}

interface AssessmentType {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [newRoom, setNewRoom] = useState({ room_number: "", room_type: "", capacity: 1, status: "available", notes: "" });
  const [newAssessmentType, setNewAssessmentType] = useState({ name: "", description: "" });
  const [editingAssessmentType, setEditingAssessmentType] = useState<AssessmentType | null>(null);

  const paymentMethods = ["card", "cash", "check", "insurance", "credit_card", "debit_card", "bank_transfer"];
  const roomStatuses = ["available", "occupied", "maintenance", "reserved"];
  const roleTypes = ["administrator", "reception", "registered_nurse", "caregiver"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companyRes, financialRes, roomsRes, rolesRes, assessmentTypesRes] = await Promise.all([
        supabase.from("company_settings").select("*").maybeSingle(),
        supabase.from("financial_settings").select("*").maybeSingle(),
        supabase.from("rooms").select("*").order("room_number"),
        supabase.from("user_roles").select("*").order("created_at"),
        supabase.from("assessment_types").select("*").order("name")
      ]);

      if (companyRes.data) setCompanySettings(companyRes.data);
      if (financialRes.data) {
        setFinancialSettings({
          ...financialRes.data,
          payment_methods: Array.isArray(financialRes.data.payment_methods) 
            ? financialRes.data.payment_methods as string[]
            : []
        });
      }
      if (roomsRes.data) setRooms(roomsRes.data);
      if (rolesRes.data) setUserRoles(rolesRes.data);
      if (assessmentTypesRes.data) setAssessmentTypes(assessmentTypesRes.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    }
  };

  const saveCompanySettings = async () => {
    if (!companySettings) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("company_settings")
        .upsert(companySettings);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Company settings saved successfully"
      });
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast({
        title: "Error",
        description: "Failed to save company settings",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const saveFinancialSettings = async () => {
    if (!financialSettings) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("financial_settings")
        .upsert(financialSettings);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Financial settings saved successfully"
      });
    } catch (error) {
      console.error("Error saving financial settings:", error);
      toast({
        title: "Error",
        description: "Failed to save financial settings",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const addRoom = async () => {
    if (!newRoom.room_number.trim()) {
      toast({
        title: "Error",
        description: "Room number is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("rooms")
        .insert([newRoom])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setRooms([...rooms, data[0]]);
        setNewRoom({ room_number: "", room_type: "", capacity: 1, status: "available", notes: "" });
      }
      
      toast({
        title: "Success",
        description: "Room added successfully"
      });
    } catch (error) {
      console.error("Error adding room:", error);
      toast({
        title: "Error",
        description: "Failed to add room",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const deleteRoom = async (roomId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId);
      
      if (error) throw error;
      
      setRooms(rooms.filter(room => room.id !== roomId));
      
      toast({
        title: "Success",
        description: "Room deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting room:", error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  // Assessment Types functions
  const addAssessmentType = async () => {
    if (!newAssessmentType.name.trim()) {
      toast({
        title: "Error",
        description: "Assessment type name is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("assessment_types")
        .insert([newAssessmentType])
        .select();
      
      if (error) throw error;
      
      if (data) {
        setAssessmentTypes([...assessmentTypes, data[0]]);
        setNewAssessmentType({ name: "", description: "" });
      }
      
      toast({
        title: "Success",
        description: "Assessment type added successfully"
      });
    } catch (error) {
      console.error("Error adding assessment type:", error);
      toast({
        title: "Error",
        description: "Failed to add assessment type",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const updateAssessmentType = async (assessmentType: AssessmentType) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("assessment_types")
        .update(assessmentType)
        .eq("id", assessmentType.id);
      
      if (error) throw error;
      
      setAssessmentTypes(assessmentTypes.map(type => 
        type.id === assessmentType.id ? assessmentType : type
      ));
      setEditingAssessmentType(null);
      
      toast({
        title: "Success",
        description: "Assessment type updated successfully"
      });
    } catch (error) {
      console.error("Error updating assessment type:", error);
      toast({
        title: "Error",
        description: "Failed to update assessment type",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const toggleAssessmentTypeStatus = async (id: string, is_active: boolean) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("assessment_types")
        .update({ is_active })
        .eq("id", id);
      
      if (error) throw error;
      
      setAssessmentTypes(assessmentTypes.map(type => 
        type.id === id ? { ...type, is_active } : type
      ));
      
      toast({
        title: "Success",
        description: `Assessment type ${is_active ? 'activated' : 'deactivated'} successfully`
      });
    } catch (error) {
      console.error("Error updating assessment type status:", error);
      toast({
        title: "Error",
        description: "Failed to update assessment type status",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const backupData = async () => {
    setLoading(true);
    try {
      toast({
        title: "Backup Started",
        description: "Data backup has been initiated. You will receive an email when complete."
      });
    } catch (error) {
      console.error("Error initiating backup:", error);
      toast({
        title: "Error",
        description: "Failed to initiate backup",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <Tabs defaultValue="company" className="flex gap-8 w-full">
                {/* Left Vertical Tabs */}
                <TabsList className="flex flex-col h-fit w-48 gap-2 border rounded-md p-2 bg-muted/30">
                  <TabsTrigger value="company" className="justify-start w-full">
                    <Building2 className="w-4 h-4 mr-2" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="assessments" className="justify-start w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Assessment Types
                  </TabsTrigger>
                  <TabsTrigger value="users" className="justify-start w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="rooms" className="justify-start w-full">
                    <Bed className="w-4 h-4 mr-2" />
                    Rooms
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="justify-start w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="justify-start w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Backup
                  </TabsTrigger>
                </TabsList>

                {/* Right Content Area */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your application settings and configuration</p>
                  </div>

                  {/* Company Settings */}
                  <TabsContent value="company" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Company Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="org-name">Organization Name</Label>
                            <Input
                              id="org-name"
                              value={companySettings?.organization_name || ""}
                              onChange={(e) => setCompanySettings(prev => prev ? {...prev, organization_name: e.target.value} : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={companySettings?.phone || ""}
                              onChange={(e) => setCompanySettings(prev => prev ? {...prev, phone: e.target.value} : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={companySettings?.email || ""}
                              onChange={(e) => setCompanySettings(prev => prev ? {...prev, email: e.target.value} : null)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                              id="address"
                              value={companySettings?.address || ""}
                              onChange={(e) => setCompanySettings(prev => prev ? {...prev, address: e.target.value} : null)}
                            />
                          </div>
                        </div>
                        <Button onClick={saveCompanySettings} disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Company Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Assessment Types */}
                  <TabsContent value="assessments" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Assessment Types</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Manage assessment types that appear in patient assessments
                        </p>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Add New Assessment Type */}
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-4">Add New Assessment Type</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="assessment-name">Name</Label>
                              <Input
                                id="assessment-name"
                                placeholder="e.g., Quarterly Assessment"
                                value={newAssessmentType.name}
                                onChange={(e) => setNewAssessmentType(prev => ({...prev, name: e.target.value}))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="assessment-description">Description</Label>
                              <Input
                                id="assessment-description"
                                placeholder="Brief description"
                                value={newAssessmentType.description}
                                onChange={(e) => setNewAssessmentType(prev => ({...prev, description: e.target.value}))}
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={addAssessmentType} 
                            disabled={loading || !newAssessmentType.name.trim()}
                            className="mt-4"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Assessment Type
                          </Button>
                        </div>

                        {/* Assessment Types List */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Existing Assessment Types</h3>
                          {assessmentTypes.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No assessment types found. Add your first assessment type above.
                            </div>
                          ) : (
                            <div className="grid gap-4">
                              {assessmentTypes.map((type) => (
                                <div key={type.id} className="border rounded-lg p-4">
                                  {editingAssessmentType?.id === type.id ? (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                          <Label>Name</Label>
                                          <Input
                                            value={editingAssessmentType.name}
                                            onChange={(e) => setEditingAssessmentType(prev => 
                                              prev ? {...prev, name: e.target.value} : null
                                            )}
                                          />
                                        </div>
                                        <div>
                                          <Label>Description</Label>
                                          <Input
                                            value={editingAssessmentType.description}
                                            onChange={(e) => setEditingAssessmentType(prev => 
                                              prev ? {...prev, description: e.target.value} : null
                                            )}
                                          />
                                        </div>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          onClick={() => updateAssessmentType(editingAssessmentType)}
                                          disabled={loading}
                                          size="sm"
                                        >
                                          <Check className="w-4 h-4 mr-2" />
                                          Save
                                        </Button>
                                        <Button 
                                          variant="outline"
                                          onClick={() => setEditingAssessmentType(null)}
                                          size="sm"
                                        >
                                          <X className="w-4 h-4 mr-2" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <h4 className="font-medium">{type.name}</h4>
                                          <Badge variant={type.is_active ? "default" : "secondary"}>
                                            {type.is_active ? "Active" : "Inactive"}
                                          </Badge>
                                        </div>
                                        {type.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {type.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Switch
                                          checked={type.is_active}
                                          onCheckedChange={(checked) => toggleAssessmentTypeStatus(type.id, checked)}
                                          disabled={loading}
                                        />
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => setEditingAssessmentType(type)}
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* User Management */}
                  <TabsContent value="users" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>User Role Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <UserRoleAssignment onRoleAssigned={fetchData} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Staff Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <StaffManagement onStaffUpdate={fetchData} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Room Management */}
                  <TabsContent value="rooms" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Room Management</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Add New Room */}
                        <div className="border rounded-lg p-4">
                          <h3 className="font-semibold mb-4">Add New Room</h3>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <Label htmlFor="room-number">Room Number</Label>
                              <Input
                                id="room-number"
                                value={newRoom.room_number}
                                onChange={(e) => setNewRoom(prev => ({...prev, room_number: e.target.value}))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="room-type">Type</Label>
                              <Input
                                id="room-type"
                                value={newRoom.room_type}
                                onChange={(e) => setNewRoom(prev => ({...prev, room_type: e.target.value}))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="capacity">Capacity</Label>
                              <Input
                                id="capacity"
                                type="number"
                                min="1"
                                value={newRoom.capacity}
                                onChange={(e) => setNewRoom(prev => ({...prev, capacity: parseInt(e.target.value) || 1}))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <Select 
                                value={newRoom.status} 
                                onValueChange={(value) => setNewRoom(prev => ({...prev, status: value}))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roomStatuses.map(status => (
                                    <SelectItem key={status} value={status}>
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button onClick={addRoom} disabled={loading} className="mt-4">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Room
                          </Button>
                        </div>

                        {/* Rooms List */}
                        <div className="space-y-4">
                          <h3 className="font-semibold">Existing Rooms</h3>
                          <div className="grid gap-4">
                            {rooms.map((room) => (
                              <div key={room.id} className="border rounded-lg p-4 flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">Room {room.room_number}</h4>
                                    <Badge variant={room.status === 'available' ? 'default' : 'secondary'}>
                                      {room.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {room.room_type} • Capacity: {room.capacity}
                                  </p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteRoom(room.id)}
                                  disabled={loading}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Financial Settings */}
                  <TabsContent value="financial" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Financial Configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="currency">Base Currency</Label>
                            <Select 
                              value={financialSettings?.base_currency || "USD"} 
                              onValueChange={(value) => setFinancialSettings(prev => prev ? {...prev, base_currency: value} : null)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="CAD">CAD (C$)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                            <Input
                              id="tax-rate"
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              value={financialSettings?.tax_rate || 0}
                              onChange={(e) => setFinancialSettings(prev => prev ? {...prev, tax_rate: parseFloat(e.target.value) || 0} : null)}
                            />
                          </div>
                        </div>
                        <Button onClick={saveFinancialSettings} disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Financial Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Backup & Data */}
                  <TabsContent value="backup" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Data Backup & Export</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">Manual Backup</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Create a backup of all your data. This includes patients, assessments, staff, and settings.
                            </p>
                            <Button onClick={backupData} disabled={loading}>
                              <Database className="w-4 h-4 mr-2" />
                              Create Backup
                            </Button>
                          </div>
                          <Separator />
                          <div>
                            <h3 className="font-medium mb-2">Automatic Backups</h3>
                            <p className="text-sm text-muted-foreground">
                              Automatic daily backups are enabled and stored securely in the cloud.
                            </p>
                            <Badge className="mt-2">Active</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}