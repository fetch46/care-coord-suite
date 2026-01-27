import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Puzzle, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  ClipboardCheck, 
  Clock,
  BarChart3,
  MessageSquare,
  Bell,
  Shield,
  Settings
} from "lucide-react";

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

interface ModulesSettingsTabProps {
  modules: Module[];
  onUpdate: (modules: Module[]) => void;
  loading?: boolean;
}

const MODULE_ICONS: Record<string, any> = {
  patients: Users,
  scheduling: Calendar,
  medical_records: FileText,
  billing: DollarSign,
  assessments: ClipboardCheck,
  timesheets: Clock,
  reports: BarChart3,
  communication: MessageSquare,
  notifications: Bell,
  security: Shield,
  settings: Settings,
};

const CATEGORY_COLORS: Record<string, string> = {
  core: "bg-blue-500",
  clinical: "bg-green-500",
  administrative: "bg-purple-500",
  financial: "bg-yellow-500",
  reporting: "bg-orange-500",
};

export function ModulesSettingsTab({ modules, onUpdate, loading = false }: ModulesSettingsTabProps) {
  const { toast } = useToast();
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleModule = async (moduleId: string, isEnabled: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    // Check dependencies
    if (isEnabled) {
      const missingDeps = module.dependencies.filter(depKey => {
        const depModule = modules.find(m => m.module_key === depKey);
        return depModule && !depModule.is_enabled;
      });

      if (missingDeps.length > 0) {
        toast({
          title: "Dependencies Required",
          description: `Enable these modules first: ${missingDeps.join(", ")}`,
          variant: "destructive"
        });
        return;
      }
    } else {
      // Check if other modules depend on this one
      const dependentModules = modules.filter(m => 
        m.is_enabled && m.dependencies.includes(module.module_key)
      );

      if (dependentModules.length > 0) {
        toast({
          title: "Cannot Disable",
          description: `These modules depend on ${module.display_name}: ${dependentModules.map(m => m.display_name).join(", ")}`,
          variant: "destructive"
        });
        return;
      }
    }

    setTogglingId(moduleId);
    try {
      const { error } = await supabase
        .from("modules")
        .update({ is_enabled: isEnabled })
        .eq("id", moduleId);

      if (error) throw error;

      onUpdate(modules.map(m => 
        m.id === moduleId ? { ...m, is_enabled: isEnabled } : m
      ));

      toast({
        title: isEnabled ? "Module Enabled" : "Module Disabled",
        description: `${module.display_name} has been ${isEnabled ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error("Error toggling module:", error);
      toast({
        title: "Error",
        description: "Failed to update module status",
        variant: "destructive"
      });
    }
    setTogglingId(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group modules by category
  const groupedModules = modules.reduce((acc, module) => {
    const category = module.category || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  const categoryLabels: Record<string, string> = {
    core: "Core Modules",
    clinical: "Clinical Modules",
    administrative: "Administrative Modules",
    financial: "Financial Modules",
    reporting: "Reporting & Analytics",
    other: "Other Modules",
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{modules.length}</div>
            <p className="text-xs text-muted-foreground">Total Modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {modules.filter(m => m.is_enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Enabled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-muted-foreground">
              {modules.filter(m => !m.is_enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">Disabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Modules by Category */}
      {Object.entries(groupedModules).map(([category, categoryModules]) => (
        <Card key={category}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-500'}`} />
              <CardTitle className="text-lg">{categoryLabels[category] || category}</CardTitle>
            </div>
            <CardDescription>
              {categoryModules.filter(m => m.is_enabled).length} of {categoryModules.length} modules enabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {categoryModules.map((module) => {
                const Icon = MODULE_ICONS[module.module_key] || Puzzle;
                const isToggling = togglingId === module.id;
                
                return (
                  <div
                    key={module.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                      module.is_enabled 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${module.is_enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`h-5 w-5 ${module.is_enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{module.display_name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {module.module_key}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {module.description || "No description available"}
                      </p>
                      
                      {module.dependencies.length > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Requires:</span>
                          {module.dependencies.map(dep => (
                            <Badge key={dep} variant="secondary" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Switch
                      checked={module.is_enabled}
                      onCheckedChange={(checked) => handleToggleModule(module.id, checked)}
                      disabled={isToggling}
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {modules.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Puzzle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium text-muted-foreground">No modules configured</p>
            <p className="text-sm text-muted-foreground">Modules will appear here once configured by your administrator</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
