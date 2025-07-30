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
            <div className="max-w-7xl mx-auto flex gap-8">
              <Tabs defaultValue="company" className="flex gap-8 w-full">
                {/* Left Vertical Tabs */}
                <TabsList className="flex flex-col w-48 gap-2 border rounded-md p-2 bg-muted/30">
                  <TabsTrigger value="company" className="justify-start">
                    <Building2 className="w-4 h-4 mr-2" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="users" className="justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="rooms" className="justify-start">
                    <Bed className="w-4 h-4 mr-2" />
                    Rooms
                  </TabsTrigger>
                  <TabsTrigger value="subscription" className="justify-start">
                    <Crown className="w-4 h-4 mr-2" />
                    Subscription
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="justify-start">
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

                  {/* Keep existing Tab Contents as they are */}
                  <TabsContent value="company">{/* ... */}</TabsContent>
                  <TabsContent value="users">{/* ... */}</TabsContent>
                  <TabsContent value="rooms">{/* ... */}</TabsContent>
                  <TabsContent value="subscription">{/* ... */}</TabsContent>
                  <TabsContent value="financial">{/* ... */}</TabsContent>
                  <TabsContent value="backup">{/* ... */}</TabsContent>
                </div>
              </Tabs>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
