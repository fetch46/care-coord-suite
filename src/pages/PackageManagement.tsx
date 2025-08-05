import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Plus, Edit, Trash2, DollarSign, Clock, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const packageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be non-negative"),
  billing_type: z.enum(["monthly", "daily", "hourly", "one-time"]),
  duration_hours: z.number().optional(),
  includes_services: z.array(z.string()).default([]),
});

type PackageFormData = z.infer<typeof packageSchema>;

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_type: string;
  duration_hours: number;
  includes_services: any;
  is_active: boolean;
  created_at: string;
}

const serviceOptions = [
  "Personal Care",
  "Medication Management",
  "Meal Preparation",
  "Light Housekeeping",
  "Transportation",
  "Companionship",
  "Medical Appointments",
  "Grocery Shopping",
  "Physical Therapy",
  "Occupational Therapy",
  "Speech Therapy",
  "Wound Care",
  "Vital Signs Monitoring",
  "Emergency Response",
];

export default function PackageManagement() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      billing_type: "monthly",
      duration_hours: undefined,
      includes_services: [],
    },
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) {
        const formattedPackages = data.map(pkg => ({
          ...pkg,
          includes_services: Array.isArray(pkg.includes_services) ? pkg.includes_services : []
        }));
        setPackages(formattedPackages);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editingPackage) {
        // Update existing package
        const { error } = await supabase
          .from("packages")
          .update(data)
          .eq("id", editingPackage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Package updated successfully",
        });
      } else {
        // Create new package
        const { error } = await supabase
          .from("packages")
          .insert(data);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Package created successfully",
        });
      }

      form.reset();
      setEditingPackage(null);
      setDialogOpen(false);
      fetchPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    form.reset({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price,
      billing_type: pkg.billing_type as any,
      duration_hours: pkg.duration_hours || undefined,
      includes_services: Array.isArray(pkg.includes_services) ? pkg.includes_services : [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const { error } = await supabase
        .from("packages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const togglePackageStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("packages")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;

      setPackages(packages.map(pkg => 
        pkg.id === id ? { ...pkg, is_active: isActive } : pkg
      ));

      toast({
        title: "Success",
        description: `Package ${isActive ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error("Error toggling package status:", error);
      toast({
        title: "Error",
        description: "Failed to update package status",
        variant: "destructive",
      });
    }
  };

  const getBillingTypeIcon = (type: string) => {
    switch (type) {
      case "hourly":
        return <Clock className="w-4 h-4" />;
      case "daily":
        return <Calendar className="w-4 h-4" />;
      case "monthly":
        return <Calendar className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatPrice = (price: number, type: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);

    switch (type) {
      case "hourly":
        return `${formattedPrice}/hour`;
      case "daily":
        return `${formattedPrice}/day`;
      case "monthly":
        return `${formattedPrice}/month`;
      default:
        return formattedPrice;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl font-bold">Package Management</h1>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingPackage(null);
                      form.reset();
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Package
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingPackage ? "Edit Package" : "Create New Package"}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Package Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter package name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="billing_type"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Billing Type *</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="one-time">One-time</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.01"
                                    placeholder="0.00" 
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    value={field.value}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("billing_type") === "hourly" && (
                            <FormField
                              control={form.control}
                              name="duration_hours"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration (Hours)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number"
                                      placeholder="Hours"
                                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                      value={field.value || ""}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Enter package description" 
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="includes_services"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Included Services</FormLabel>
                              <div className="grid grid-cols-2 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto">
                                {serviceOptions.map((service) => (
                                  <label key={service} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={field.value.includes(service)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          field.onChange([...field.value, service]);
                                        } else {
                                          field.onChange(field.value.filter(s => s !== service));
                                        }
                                      }}
                                    />
                                    <span className="text-sm">{service}</span>
                                  </label>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-4 pt-4">
                          <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : editingPackage ? "Update Package" : "Create Package"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => (
                  <Card key={pkg.id} className={`relative ${!pkg.is_active ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={pkg.is_active}
                            onCheckedChange={(checked) => togglePackageStatus(pkg.id, checked)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pkg)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pkg.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getBillingTypeIcon(pkg.billing_type)}
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(pkg.price, pkg.billing_type)}
                        </span>
                      </div>
                      <Badge variant={pkg.is_active ? "default" : "secondary"}>
                        {pkg.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {pkg.description && (
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      )}

                      {pkg.duration_hours && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{pkg.duration_hours} hours</span>
                        </div>
                      )}

                      {Array.isArray(pkg.includes_services) && pkg.includes_services.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Included Services:</h4>
                          <div className="flex flex-wrap gap-1">
                            {pkg.includes_services.slice(0, 3).map((service: string) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {pkg.includes_services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{pkg.includes_services.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {packages.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No packages found</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first service package to get started.
                    </p>
                    <Button onClick={() => setDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Package
                    </Button>
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