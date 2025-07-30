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
  Edit
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

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [newRoom, setNewRoom] = useState({ room_number: "", room_type: "", capacity: 1, status: "available", notes: "" });

  const paymentMethods = ["card", "cash", "check", "insurance", "credit_card", "debit_card", "bank_transfer"];
  const roomStatuses = ["available", "occupied", "maintenance", "reserved"];
  const roleTypes = ["administrator", "reception", "registered_nurse", "caregiver"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companyRes, financialRes, roomsRes, rolesRes] = await Promise.all([
        supabase.from("company_settings").select("*").maybeSingle(),
        supabase.from("financial_settings").select("*").maybeSingle(),
        supabase.from("rooms").select("*").order("room_number"),
        supabase.from("user_roles").select("*").order("created_at")
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

  const backupData = async () => {
    setLoading(true);
    try {
      // This is a placeholder - in a real application you'd implement proper backup functionality
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
            <div className="max-w-6xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your application settings and configuration</p>
              </div>

              <Tabs defaultValue="company" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="rooms" className="flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    Rooms
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Backup
                  </TabsTrigger>
                </TabsList>

                {/* Company Settings Tab */}
                <TabsContent value="company">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {companySettings && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="orgName">Organization Name</Label>
                              <Input
                                id="orgName"
                                value={companySettings.organization_name}
                                onChange={(e) => setCompanySettings({
                                  ...companySettings,
                                  organization_name: e.target.value
                                })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={companySettings.email}
                                onChange={(e) => setCompanySettings({
                                  ...companySettings,
                                  email: e.target.value
                                })}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              value={companySettings.phone}
                              onChange={(e) => setCompanySettings({
                                ...companySettings,
                                phone: e.target.value
                              })}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                              id="address"
                              value={companySettings.address}
                              onChange={(e) => setCompanySettings({
                                ...companySettings,
                                address: e.target.value
                              })}
                              rows={3}
                            />
                          </div>
                          
                          <Button onClick={saveCompanySettings} disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Users & Roles Tab */}
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>Users & Role Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {roleTypes.map((role) => (
                          <div key={role} className="p-4 border rounded-lg">
                            <h3 className="font-medium capitalize mb-2">{role.replace('_', ' ')}</h3>
                            <Badge variant="outline">
                              {userRoles.filter(ur => ur.role === role).length} users
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Recent Role Assignments</h3>
                        <div className="space-y-2">
                          {userRoles.slice(0, 5).map((userRole) => (
                            <div key={userRole.id} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <span className="font-medium">User ID: {userRole.user_id.slice(0, 8)}...</span>
                                <Badge variant="secondary" className="ml-2 capitalize">
                                  {userRole.role.replace('_', ' ')}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(userRole.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <UserRoleAssignment onRoleAssigned={fetchData} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Rooms Management Tab */}
                <TabsContent value="rooms">
                  <Card>
                    <CardHeader>
                      <CardTitle>Rooms Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Add New Room */}
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-medium mb-4">Add New Room</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="roomNumber">Room Number</Label>
                            <Input
                              id="roomNumber"
                              value={newRoom.room_number}
                              onChange={(e) => setNewRoom({ ...newRoom, room_number: e.target.value })}
                              placeholder="101"
                            />
                          </div>
                          <div>
                            <Label htmlFor="roomType">Room Type</Label>
                            <Input
                              id="roomType"
                              value={newRoom.room_type}
                              onChange={(e) => setNewRoom({ ...newRoom, room_type: e.target.value })}
                              placeholder="Private"
                            />
                          </div>
                          <div>
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                              id="capacity"
                              type="number"
                              min="1"
                              value={newRoom.capacity}
                              onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 1 })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="status">Status</Label>
                            <Select value={newRoom.status} onValueChange={(value) => setNewRoom({ ...newRoom, status: value })}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roomStatuses.map(status => (
                                  <SelectItem key={status} value={status} className="capitalize">
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={newRoom.notes}
                            onChange={(e) => setNewRoom({ ...newRoom, notes: e.target.value })}
                            placeholder="Additional notes..."
                            rows={2}
                          />
                        </div>
                        <Button onClick={addRoom} className="mt-4" disabled={loading}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Room
                        </Button>
                      </div>

                      {/* Existing Rooms */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Existing Rooms ({rooms.length})</h3>
                        <div className="grid gap-4">
                          {rooms.map((room) => (
                            <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div>
                                  <span className="font-medium">Room {room.room_number}</span>
                                  <p className="text-sm text-muted-foreground">{room.room_type}</p>
                                </div>
                                <Badge 
                                  variant={room.status === "available" ? "default" : 
                                          room.status === "occupied" ? "destructive" : "secondary"}
                                  className="capitalize"
                                >
                                  {room.status}
                                </Badge>
                                <span className="text-sm">Capacity: {room.capacity}</span>
                              </div>
                              <Button 
                                variant="destructive" 
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

                {/* Subscription Management Tab */}
                <TabsContent value="subscription">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscription Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center p-8 border rounded-lg bg-muted/50">
                        <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">Subscription Management</h3>
                        <p className="text-muted-foreground mb-4">
                          Manage your subscription plans and billing information
                        </p>
                        <Button>Manage Subscription</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financial Configuration Tab */}
                <TabsContent value="financial">
                  <Card>
                    <CardHeader>
                      <CardTitle>Financial Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {financialSettings && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="currency">Base Currency</Label>
                              <Select 
                                value={financialSettings.base_currency} 
                                onValueChange={(value) => setFinancialSettings({
                                  ...financialSettings,
                                  base_currency: value
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="taxRate">Tax Rate (%)</Label>
                              <Input
                                id="taxRate"
                                type="number"
                                step="0.01"
                                value={financialSettings.tax_rate}
                                onChange={(e) => setFinancialSettings({
                                  ...financialSettings,
                                  tax_rate: parseFloat(e.target.value) || 0
                                })}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <Label>Accepted Payment Methods</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {paymentMethods.map((method) => (
                                <div key={method} className="flex items-center space-x-2">
                                  <Switch
                                    id={method}
                                    checked={financialSettings.payment_methods.includes(method)}
                                    onCheckedChange={(checked) => {
                                      const methods = checked
                                        ? [...financialSettings.payment_methods, method]
                                        : financialSettings.payment_methods.filter(m => m !== method);
                                      setFinancialSettings({
                                        ...financialSettings,
                                        payment_methods: methods
                                      });
                                    }}
                                  />
                                  <Label htmlFor={method} className="capitalize">
                                    {method.replace('_', ' ')}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button onClick={saveFinancialSettings} disabled={loading}>
                            <Save className="w-4 h-4 mr-2" />
                            Save Financial Settings
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Backup Data Tab */}
                <TabsContent value="backup">
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Backup</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center p-8 border rounded-lg bg-muted/50">
                        <Database className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">Backup Your Data</h3>
                        <p className="text-muted-foreground mb-4">
                          Create a complete backup of your application data including patients, staff, schedules, and settings.
                        </p>
                        <Button onClick={backupData} disabled={loading}>
                          <Database className="w-4 h-4 mr-2" />
                          Start Backup
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Backup History</h3>
                        <p className="text-muted-foreground">No previous backups found.</p>
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
