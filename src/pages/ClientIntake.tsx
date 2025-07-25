import { useState } from "react";
import {
  Plus, Trash2, Save, Send, User,
  Shield, History, Phone, Stethoscope,
} from "lucide-react";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { value: "client-info", label: "Client Info", icon: User },
  { value: "insurance", label: "Insurance", icon: Shield },
  { value: "health-history", label: "Health History", icon: History },
  { value: "emergency", label: "Emergency Contacts", icon: Phone },
  { value: "physician", label: "Physician Info", icon: Stethoscope },
];

export default function ClientIntake() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [clientInfo, setClientInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    dateOfBirth: "",
    sex: "",
  });

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Client intake form has been saved as draft.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Client intake form submitted successfully.",
    });
  };

  const validateStep = () => {
    if (steps[step].value === "client-info") {
      const { firstName, lastName, address, dateOfBirth, sex } = clientInfo;
      return firstName && lastName && address && dateOfBirth && sex;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-screen-2xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Patient registration form</h1>
                  <p className="text-muted-foreground mt-1">Step {step + 1} of {steps.length}</p>
                </div>
                <Button className="bg-gradient-primary text-white hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </div>

              {/* Steps Navigation */}
              <Tabs value={steps[step].value} className="w-full">
                <TabsList className="flex flex-wrap gap-2 mb-6">
                  {steps.map((s, idx) => (
                    <TabsTrigger
                      key={s.value}
                      value={s.value}
                      disabled={step !== idx}
                    >
                      <s.icon className="w-4 h-4 mr-1" />
                      {s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Step 1: Client Info */}
                <TabsContent value="client-info">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>First Name *</Label>
                          <Input
                            value={clientInfo.firstName}
                            onChange={(e) =>
                              setClientInfo({ ...clientInfo, firstName: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Last Name *</Label>
                          <Input
                            value={clientInfo.lastName}
                            onChange={(e) =>
                              setClientInfo({ ...clientInfo, lastName: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Date of Birth *</Label>
                          <Input
                            type="date"
                            value={clientInfo.dateOfBirth}
                            onChange={(e) =>
                              setClientInfo({ ...clientInfo, dateOfBirth: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Address *</Label>
                        <Textarea
                          value={clientInfo.address}
                          onChange={(e) =>
                            setClientInfo({ ...clientInfo, address: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label>Sex *</Label>
                        <Select
                          value={clientInfo.sex}
                          onValueChange={(value) =>
                            setClientInfo({ ...clientInfo, sex: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Future Steps */}
                <TabsContent value="insurance">
                  <Card>
                    <CardHeader><CardTitle>Insurance Info</CardTitle></CardHeader>
                    <CardContent> {/* Add form fields */} </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="health-history">
                  <Card>
                    <CardHeader><CardTitle>Health History</CardTitle></CardHeader>
                    <CardContent> {/* Add form fields */} </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="emergency">
                  <Card>
                    <CardHeader><CardTitle>Emergency Contacts</CardTitle></CardHeader>
                    <CardContent> {/* Add form fields */} </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="physician">
                  <Card>
                    <CardHeader><CardTitle>Physician Info</CardTitle></CardHeader>
                    <CardContent> {/* Add form fields */} </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {step > 0 && (
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                )}
                {step < steps.length - 1 ? (
                  <Button onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-gradient-primary text-white">
                    Submit Form
                  </Button>
                )}
              </div>

              {/* Save as Draft */}
              <div className="pt-4 flex justify-center">
                <Button
                  onClick={handleSaveDraft}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
