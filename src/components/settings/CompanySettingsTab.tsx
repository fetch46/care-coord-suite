import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Mail, Phone, MapPin, Globe, Save, Upload } from "lucide-react";

interface CompanySettings {
  id: string;
  organization_name: string;
  address: string;
  phone: string;
  email: string;
  logo_url?: string;
  website?: string;
}

interface CompanySettingsTabProps {
  settings: CompanySettings | null;
  onUpdate: (settings: CompanySettings) => void;
  loading?: boolean;
}

export function CompanySettingsTab({ settings, onUpdate, loading = false }: CompanySettingsTabProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<CompanySettings | null>(settings);

  // Sync with parent when settings change
  if (settings && (!localSettings || settings.id !== localSettings.id)) {
    setLocalSettings(settings);
  }

  const handleSave = async () => {
    if (!localSettings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("company_settings")
        .upsert(localSettings);
      
      if (error) throw error;
      
      onUpdate(localSettings);
      toast({
        title: "Settings saved",
        description: "Company information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving company settings:", error);
      toast({
        title: "Error",
        description: "Failed to save company settings",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle>Company Information</CardTitle>
          </div>
          <CardDescription>
            Manage your organization's basic information that appears across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload Section */}
          <div className="flex items-start gap-6 pb-6 border-b">
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/50">
              {localSettings?.logo_url ? (
                <img 
                  src={localSettings.logo_url} 
                  alt="Company logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="h-8 w-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label>Company Logo</Label>
              <p className="text-sm text-muted-foreground">
                Upload your company logo. Recommended size: 200x200px
              </p>
              <Input
                placeholder="Enter logo URL"
                value={localSettings?.logo_url || ""}
                onChange={(e) => setLocalSettings(prev => prev ? {...prev, logo_url: e.target.value} : null)}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="org-name" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Organization Name
              </Label>
              <Input
                id="org-name"
                placeholder="Enter organization name"
                value={localSettings?.organization_name || ""}
                onChange={(e) => setLocalSettings(prev => prev ? {...prev, organization_name: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={localSettings?.phone || ""}
                onChange={(e) => setLocalSettings(prev => prev ? {...prev, phone: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="contact@company.com"
                value={localSettings?.email || ""}
                onChange={(e) => setLocalSettings(prev => prev ? {...prev, email: e.target.value} : null)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://www.company.com"
                value={localSettings?.website || ""}
                onChange={(e) => setLocalSettings(prev => prev ? {...prev, website: e.target.value} : null)}
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Business Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street, City, State, ZIP"
                value={localSettings?.address || ""}
                onChange={(e) => setLocalSettings(prev => prev ? {...prev, address: e.target.value} : null)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
