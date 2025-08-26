import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Package, Check, Users, HardDrive, Star } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_type: string;
  user_limit: number;
  storage_gb: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

interface PackageAssignmentProps {
  organizationId: string;
  organizationName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPackageId?: string;
}

export function SuperAdminPackageAssignment({
  organizationId,
  organizationName,
  isOpen,
  onClose,
  onSuccess,
  currentPackageId
}: PackageAssignmentProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetchingPackages, setFetchingPackages] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchPackages();
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentPackageId) {
      setSelectedPackageId(currentPackageId);
    }
  }, [currentPackageId]);

  const fetchPackages = async () => {
    try {
      setFetchingPackages(true);
      const { data, error } = await supabase
        .from("organization_packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;

      const transformedData = (data || []).map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description || "",
        price: pkg.price,
        billing_type: pkg.billing_type,
        user_limit: pkg.user_limit || 0,
        storage_gb: pkg.storage_gb || 0,
        features: Array.isArray(pkg.features) 
          ? pkg.features.filter((f): f is string => typeof f === 'string')
          : [],
        is_popular: pkg.is_popular || false,
        is_active: pkg.is_active || false
      }));

      setPackages(transformedData);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive"
      });
    } finally {
      setFetchingPackages(false);
    }
  };

  const handleAssignPackage = async () => {
    if (!selectedPackageId) {
      toast({
        title: "Validation Error",
        description: "Please select a package",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // First, deactivate any existing package assignments
      const { error: deactivateError } = await supabase
        .from('organization_package_assignments')
        .update({ is_active: false })
        .eq('organization_id', organizationId);

      if (deactivateError) throw deactivateError;

      // Create new package assignment
      const { error: assignError } = await supabase
        .from('organization_package_assignments')
        .insert({
          organization_id: organizationId,
          package_id: selectedPackageId,
          is_active: true,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
        });

      if (assignError) throw assignError;

      // Update organization subscription status
      const { error: orgUpdateError } = await supabase
        .from('organizations')
        .update({ 
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', organizationId);

      if (orgUpdateError) throw orgUpdateError;

      toast({
        title: "Success",
        description: `Package assigned to ${organizationName} successfully`,
      });

      setSelectedPackageId("");
      onClose();
      onSuccess();
    } catch (error: any) {
      console.error('Error assigning package:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to assign package",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const selectedPackage = packages.find(pkg => pkg.id === selectedPackageId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Package to Organization</DialogTitle>
          <DialogDescription>
            Assign a subscription package to {organizationName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="package">Select Package *</Label>
            <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a package" />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    <div className="flex items-center gap-2">
                      <span>{pkg.name}</span>
                      <span className="text-muted-foreground">- {formatCurrency(pkg.price)}/{pkg.billing_type}</span>
                      {pkg.is_popular && <Star className="w-3 h-3 text-yellow-500" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPackage && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {selectedPackage.name}
                    {selectedPackage.is_popular && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{formatCurrency(selectedPackage.price)}</div>
                    <div className="text-sm text-muted-foreground">per {selectedPackage.billing_type}</div>
                  </div>
                </div>
                <CardDescription>{selectedPackage.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {selectedPackage.user_limit === -1 ? 'Unlimited' : selectedPackage.user_limit} Users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{selectedPackage.storage_gb} GB Storage</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Features:</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {selectedPackage.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAssignPackage} disabled={loading || !selectedPackageId}>
            {loading ? "Assigning..." : "Assign Package"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}