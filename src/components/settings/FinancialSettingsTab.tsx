import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Percent, CreditCard, Save, Banknote, Receipt } from "lucide-react";

interface FinancialSettings {
  id: string;
  base_currency: string;
  tax_rate: number;
  payment_methods: string[];
}

interface FinancialSettingsTabProps {
  settings: FinancialSettings | null;
  onUpdate: (settings: FinancialSettings) => void;
  loading?: boolean;
}

const AVAILABLE_PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "credit_card", label: "Credit Card", icon: CreditCard },
  { id: "debit_card", label: "Debit Card", icon: CreditCard },
  { id: "check", label: "Check", icon: Receipt },
  { id: "bank_transfer", label: "Bank Transfer", icon: DollarSign },
  { id: "insurance", label: "Insurance", icon: Receipt },
];

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
];

export function FinancialSettingsTab({ settings, onUpdate, loading = false }: FinancialSettingsTabProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<FinancialSettings | null>(settings);

  // Sync with parent when settings change
  if (settings && (!localSettings || settings.id !== localSettings.id)) {
    setLocalSettings(settings);
  }

  const handlePaymentMethodToggle = (methodId: string) => {
    if (!localSettings) return;
    
    const currentMethods = localSettings.payment_methods || [];
    const newMethods = currentMethods.includes(methodId)
      ? currentMethods.filter(m => m !== methodId)
      : [...currentMethods, methodId];
    
    setLocalSettings({
      ...localSettings,
      payment_methods: newMethods
    });
  };

  const handleSave = async () => {
    if (!localSettings) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("financial_settings")
        .upsert(localSettings);
      
      if (error) throw error;
      
      onUpdate(localSettings);
      toast({
        title: "Settings saved",
        description: "Financial settings have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving financial settings:", error);
      toast({
        title: "Error",
        description: "Failed to save financial settings",
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
              {[...Array(4)].map((_, i) => (
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

  const selectedCurrency = CURRENCIES.find(c => c.code === localSettings?.base_currency);

  return (
    <div className="space-y-6">
      {/* Currency & Tax Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <CardTitle>Currency & Tax</CardTitle>
          </div>
          <CardDescription>
            Configure your base currency and tax settings for billing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Base Currency
              </Label>
              <Select
                value={localSettings?.base_currency || "USD"}
                onValueChange={(value) => setLocalSettings(prev => prev ? {...prev, base_currency: value} : null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <span className="flex items-center gap-2">
                        <span className="font-mono">{currency.symbol}</span>
                        <span>{currency.name}</span>
                        <Badge variant="outline" className="ml-2">{currency.code}</Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This currency will be used for all invoices and payments
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax-rate" className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                Default Tax Rate
              </Label>
              <div className="relative">
                <Input
                  id="tax-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0.00"
                  className="pr-8"
                  value={localSettings?.tax_rate || 0}
                  onChange={(e) => setLocalSettings(prev => prev ? {...prev, tax_rate: parseFloat(e.target.value) || 0} : null)}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Applied automatically to all invoices unless overridden
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-sm font-medium mb-2">Preview</p>
            <p className="text-muted-foreground text-sm">
              Example invoice: {selectedCurrency?.symbol}100.00 + {localSettings?.tax_rate || 0}% tax = 
              <span className="font-semibold text-foreground ml-1">
                {selectedCurrency?.symbol}{(100 * (1 + (localSettings?.tax_rate || 0) / 100)).toFixed(2)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle>Accepted Payment Methods</CardTitle>
          </div>
          <CardDescription>
            Select which payment methods your organization accepts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {AVAILABLE_PAYMENT_METHODS.map((method) => {
              const isSelected = (localSettings?.payment_methods || []).includes(method.id);
              const Icon = method.icon;
              
              return (
                <div
                  key={method.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted hover:border-muted-foreground/25'
                  }`}
                  onClick={() => handlePaymentMethodToggle(method.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handlePaymentMethodToggle(method.id)}
                  />
                  <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={isSelected ? 'font-medium' : ''}>{method.label}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t">
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
