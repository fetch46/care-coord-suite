import { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  Send,
  User,
  Shield,
  History,
  Phone,
  Stethoscope,
} from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClientIntake() {
  const { toast } = useToast();

  // State to manage form data for each section
  const [formData, setFormData] = useState({
    clientInfo: {
      firstName: "",
      lastName: "",
      dob: "",
      address: "",
      phone: "",
      email: "",
    },
    insurance: {
      provider: "",
      policyNumber: "",
      groupNumber: "",
      insurancePhone: "",
    },
    healthHistory: {
      allergies: "",
      medications: "",
      medicalConditions: "",
      pastSurgeries: "",
      familyHistory: "",
    },
    emergencyContacts: [
      { name: "", relationship: "", phone: "" },
      { name: "", relationship: "", phone: "" },
    ],
    physicianInfo: {
      name: "",
      specialty: "",
      phone: "",
      address: "",
    },
  });

  // Handle input changes for all fields
  const handleInputChange = (section, field, value, index = null) => {
    setFormData((prevData) => {
      if (index !== null) {
        const updatedArray = [...prevData[section]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        return {
          ...prevData,
          [section]: updatedArray,
        };
      } else {
        return {
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: value,
          },
        };
      }
    });
  };

  const handleSubmit = () => {
    // In a real application, you would send formData to a backend
    console.log("Submitting form data:", formData);
    toast({
      title: "Form Submitted",
      description: "Client intake form has been submitted successfully.",
    });
  };

  const handleSaveDraft = () => {
    // In a real application, you would save formData to local storage or a backend
    console.log("Saving draft:", formData);
    toast({
      title: "Draft Saved",
      description: "Client intake form has been saved as draft.",
    });
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full max-w-screen-2xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Client Intake Form
                </h1>
                <p className="text-muted-foreground">
                  Complete all sections to register a new client
                </p>
              </div>

              <Tabs defaultValue="client-info" className="w-full">
                <TabsList className="mb-6 flex flex-wrap gap-2">
                  <TabsTrigger value="client-info">Client Info</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="health-history">
                    Health History
                  </TabsTrigger>
                  <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                  <TabsTrigger value="physician">Physician Info</TabsTrigger>
                </TabsList>

                {/* Client Information Tab Content */}
                <TabsContent value="client-info">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Client Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter first name"
                            value={formData.clientInfo.firstName}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "firstName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter last name"
                            value={formData.clientInfo.lastName}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "lastName", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData.clientInfo.dob}
                          onChange={(e) =>
                            handleInputChange("clientInfo", "dob", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          placeholder="Enter full address"
                          rows={3}
                          value={formData.clientInfo.address}
                          onChange={(e) =>
                            handleInputChange("clientInfo", "address", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="Enter phone number"
                            value={formData.clientInfo.phone}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "phone", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            placeholder="Enter email"
                            type="email"
                            value={formData.clientInfo.email}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "email", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Insurance Tab Content */}
                <TabsContent value="insurance">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Insurance Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                        <Input
                          id="insuranceProvider"
                          placeholder="Enter insurance provider"
                          value={formData.insurance.provider}
                          onChange={(e) =>
                            handleInputChange("insurance", "provider", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="policyNumber">Policy Number</Label>
                        <Input
                          id="policyNumber"
                          placeholder="Enter policy number"
                          value={formData.insurance.policyNumber}
                          onChange={(e) =>
                            handleInputChange("insurance", "policyNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupNumber">Group Number</Label>
                        <Input
                          id="groupNumber"
                          placeholder="Enter group number (optional)"
                          value={formData.insurance.groupNumber}
                          onChange={(e) =>
                            handleInputChange("insurance", "groupNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurancePhone">Insurance Phone Number</Label>
                        <Input
                          id="insurancePhone"
                          placeholder="Enter insurance company phone"
                          value={formData.insurance.insurancePhone}
                          onChange={(e) =>
                            handleInputChange("insurance", "insurancePhone", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Health History Tab Content */}
                <TabsContent value="health-history">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Health History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          placeholder="List any allergies"
                          rows={3}
                          value={formData.healthHistory.allergies}
                          onChange={(e) =>
                            handleInputChange("healthHistory", "allergies", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="medications">Current Medications</Label>
                        <Textarea
                          id="medications"
                          placeholder="List current medications"
                          rows={3}
                          value={formData.healthHistory.medications}
                          onChange={(e) =>
                            handleInputChange("healthHistory", "medications", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicalConditions">
                          Pre-existing Medical Conditions
                        </Label>
                        <Textarea
                          id="medicalConditions"
                          placeholder="List any pre-existing conditions"
                          rows={3}
                          value={formData.healthHistory.medicalConditions}
                          onChange={(e) =>
                            handleInputChange("healthHistory", "medicalConditions", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="pastSurgeries">Past Surgeries/Procedures</Label>
                        <Textarea
                          id="pastSurgeries"
                          placeholder="List any past surgeries or procedures"
                          rows={3}
                          value={formData.healthHistory.pastSurgeries}
                          onChange={(e) =>
                            handleInputChange("healthHistory", "pastSurgeries", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="familyHistory">Family Medical History</Label>
                        <Textarea
                          id="familyHistory"
                          placeholder="Provide relevant family medical history"
                          rows={3}
                          value={formData.healthHistory.familyHistory}
                          onChange={(e) =>
                            handleInputChange("healthHistory", "familyHistory", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Emergency Contacts Tab Content */}
                <TabsContent value="emergency">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary" />
                        Emergency Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Emergency Contact 1 */}
                      <div>
                        <Label htmlFor="emergencyName1">Contact 1 Name</Label>
                        <Input
                          id="emergencyName1"
                          placeholder="Enter full name"
                          value={formData.emergencyContacts[0].name}
                          onChange={(e) =>
                            handleInputChange("emergencyContacts", "name", e.target.value, 0)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyRelationship1">Relationship</Label>
                        <Input
                          id="emergencyRelationship1"
                          placeholder="e.g., Parent, Spouse"
                          value={formData.emergencyContacts[0].relationship}
                          onChange={(e) =>
                            handleInputChange("emergencyContacts", "relationship", e.target.value, 0)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone1">Contact 1 Phone Number</Label>
                        <Input
                          id="emergencyPhone1"
                          placeholder="Enter phone number"
                          value={formData.emergencyContacts[0].phone}
                          onChange={(e) =>
                            handleInputChange("emergencyContacts", "phone", e.target.value, 0)
                          }
                        />
                      </div>
                      <Separator />
                      {/* Emergency Contact 2 */}
                      <div>
                        <Label htmlFor="emergencyName2">Contact 2 Name (Optional)</Label>
                        <Input
                          id="emergencyName2"
                          placeholder="Enter full name"
                          value={formData.emergencyContacts[1].name}
                          onChange={(e) =>
                            handleInputChange("emergencyContacts", "name", e.target.value, 1)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyRelationship2">Relationship (Optional)</Label>
                        <Input
                          id="emergencyRelationship2"
                          placeholder="e.g., Sibling, Friend"
                          value={formData.emergencyContacts[1].relationship}
                          onChange={(e) =>
                            handleInputChange("emergencyContacts", "relationship", e.target.value, 1)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone2">Contact 2 Phone Number (Optional)</Label>
                        <Input
                          id="emergencyPhone2"
                          placeholder="Enter phone number"
                          value={formData.emergencyContacts[1].phone}
                          onChange={(e) =>
                            handleInputChange("emergencyContacts", "phone", e.target.value, 1)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Physician Information Tab Content */}
                <TabsContent value="physician">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-primary" />
                        Physician Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="physicianName">Primary Physician Name</Label>
                        <Input
                          id="physicianName"
                          placeholder="Enter physician's full name"
                          value={formData.physicianInfo.name}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="physicianSpecialty">Specialty</Label>
                        <Input
                          id="physicianSpecialty"
                          placeholder="e.g., General Practitioner, Cardiologist"
                          value={formData.physicianInfo.specialty}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "specialty", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="physicianPhone">Physician Phone Number</Label>
                        <Input
                          id="physicianPhone"
                          placeholder="Enter physician's phone number"
                          value={formData.physicianInfo.phone}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "phone", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="physicianAddress">Physician Address</Label>
                        <Textarea
                          id="physicianAddress"
                          placeholder="Enter physician's address"
                          rows={3}
                          value={formData.physicianInfo.address}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "address", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Form Buttons */}
              <div className="flex justify-between items-center pt-6">
                <Button
                  onClick={handleSaveDraft}
                  variant="outline"
                  size="lg"
                  className="min-w-40"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      className="min-w-40 bg-gradient-primary text-white hover:opacity-90"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Options
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSaveDraft}>
                      Save as Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSubmit}>
                      Submit
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
