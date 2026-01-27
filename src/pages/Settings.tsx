"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Tab Components
import { CompanySettingsTab } from "@/components/settings/CompanySettingsTab";
import { FinancialSettingsTab } from "@/components/settings/FinancialSettingsTab";
import { RoomsSettingsTab } from "@/components/settings/RoomsSettingsTab";
import { ModulesSettingsTab } from "@/components/settings/ModulesSettingsTab";
import { AssessmentTypesTab } from "@/components/settings/AssessmentTypesTab";
import { UserRoleAssignment } from "@/components/settings/UserRoleAssignment";
import { StaffManagement } from "@/components/settings/StaffManagement";
import { RolePermissions } from "@/components/settings/RolePermissions";

import { 
  Building2, 
  Users, 
  Bed, 
  DollarSign, 
  Database,
  Shield,
  FileText,
  Puzzle,
  HardDrive,
  Download
} from "lucide-react";

interface CompanySettings {
  id: string;
  organization_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  website?: string;
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
  room_type?: string;
  capacity?: number;
  status?: string;
  floor?: string;
  building?: string;
}

interface AssessmentType {
  id: string;
  name: string;
  description: string;
  category?: string;
  is_active: boolean;
}

interface Module {
  id: string;
  name: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  module_key: string;
  category: string;
  dependencies: string[];
}

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [financialSettings, setFinancialSettings] = useState<FinancialSettings | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [assessmentTypes, setAssessmentTypes] = useState<AssessmentType[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [companyRes, financialRes, roomsRes, assessmentTypesRes, modulesRes] = await Promise.all([
        supabase.from("company_settings").select("*").maybeSingle(),
        supabase.from("financial_settings").select("*").maybeSingle(),
        supabase.from("rooms").select("*").order("room_number"),
        supabase.from("assessment_types").select("*").order("name"),
        supabase.from("modules").select("*").order("category", { ascending: true })
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
      if (assessmentTypesRes.data) setAssessmentTypes(assessmentTypesRes.data);
      if (modulesRes.data) {
        const formattedModules = modulesRes.data.map(module => ({
          ...module,
          dependencies: Array.isArray(module.dependencies) ? module.dependencies : []
        }));
        setModules(formattedModules as Module[]);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleBackup = async () => {
    toast({
      title: "Backup Started",
      description: "Data backup has been initiated. You will receive a notification when complete."
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-full mx-auto">
              <Tabs defaultValue="company" className="flex gap-8 w-full">
                {/* Left Vertical Tabs */}
                <TabsList className="flex flex-col h-fit w-56 gap-1 border rounded-lg p-2 bg-muted/30 shrink-0">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Organization
                  </div>
                  <TabsTrigger value="company" className="justify-start w-full">
                    <Building2 className="w-4 h-4 mr-2" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="financial" className="justify-start w-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Financial
                  </TabsTrigger>
                  <TabsTrigger value="rooms" className="justify-start w-full">
                    <Bed className="w-4 h-4 mr-2" />
                    Rooms
                  </TabsTrigger>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                    Clinical
                  </div>
                  <TabsTrigger value="assessments" className="justify-start w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Assessment Types
                  </TabsTrigger>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                    Access Control
                  </div>
                  <TabsTrigger value="roles" className="justify-start w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Permissions
                  </TabsTrigger>
                  <TabsTrigger value="users" className="justify-start w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Users & Staff
                  </TabsTrigger>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                    System
                  </div>
                  <TabsTrigger value="modules" className="justify-start w-full">
                    <Puzzle className="w-4 h-4 mr-2" />
                    Modules
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="justify-start w-full">
                    <Database className="w-4 h-4 mr-2" />
                    Backup
                  </TabsTrigger>
                </TabsList>

                {/* Right Content Area */}
                <div className="flex-1 min-w-0">
                  {/* Page Header */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                      Manage your organization settings and configuration
                    </p>
                  </div>

                  {/* Company Settings */}
                  <TabsContent value="company" className="mt-0">
                    <CompanySettingsTab 
                      settings={companySettings}
                      onUpdate={setCompanySettings}
                      loading={loading}
                    />
                  </TabsContent>

                  {/* Financial Settings */}
                  <TabsContent value="financial" className="mt-0">
                    <FinancialSettingsTab 
                      settings={financialSettings}
                      onUpdate={setFinancialSettings}
                      loading={loading}
                    />
                  </TabsContent>

                  {/* Rooms Management */}
                  <TabsContent value="rooms" className="mt-0">
                    <RoomsSettingsTab 
                      rooms={rooms}
                      onUpdate={setRooms}
                      loading={loading}
                    />
                  </TabsContent>

                  {/* Assessment Types */}
                  <TabsContent value="assessments" className="mt-0">
                    <AssessmentTypesTab 
                      assessmentTypes={assessmentTypes}
                      onUpdate={setAssessmentTypes}
                      loading={loading}
                    />
                  </TabsContent>

                  {/* Role Permissions */}
                  <TabsContent value="roles" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <CardTitle>Role Permissions</CardTitle>
                        </div>
                        <CardDescription>
                          Configure what each role can view, create, edit, and delete
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RolePermissions onPermissionsUpdate={fetchData} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Users & Staff */}
                  <TabsContent value="users" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          <CardTitle>User Role Assignment</CardTitle>
                        </div>
                        <CardDescription>
                          Assign roles to users to control their access level
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <UserRoleAssignment onRoleAssigned={fetchData} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <CardTitle>Staff Management</CardTitle>
                        </div>
                        <CardDescription>
                          Manage staff members and their information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <StaffManagement onStaffUpdate={fetchData} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Modules */}
                  <TabsContent value="modules" className="mt-0">
                    <ModulesSettingsTab 
                      modules={modules}
                      onUpdate={setModules}
                      loading={loading}
                    />
                  </TabsContent>

                  {/* Backup */}
                  <TabsContent value="backup" className="mt-0 space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-primary" />
                          <CardTitle>Data Backup</CardTitle>
                        </div>
                        <CardDescription>
                          Create backups of your organization's data
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-muted/50 rounded-lg p-6 border">
                          <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-primary/10">
                              <HardDrive className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">Full Data Backup</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Export all your organization's data including patients, staff, 
                                assessments, invoices, and settings. The backup will be sent to 
                                your registered email address.
                              </p>
                              <Button onClick={handleBackup}>
                                <Download className="h-4 w-4 mr-2" />
                                Start Backup
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <h4 className="font-medium mb-2">Backup Information</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Last Backup:</span>
                              <span className="ml-2">Never</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Backup Format:</span>
                              <span className="ml-2">JSON / CSV</span>
                            </div>
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
