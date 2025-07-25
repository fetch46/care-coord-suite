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

  // State to manage all form data
  const [formData, setFormData] = useState({
    clientInfo: {
      lastName: "",
      firstName: "",
      middleName: "",
      address: "",
      dob: "",
      sex: "",
      race: "",
      ssn: "",
      referralSource: "",
      dateOfDischarge: "",
      primaryDiagnosis: "",
      secondaryDiagnosis: "",
      allergies: "",
      planOfCare: "",
    },
    insuranceDetails: {
      company: "",
      memberNumber: "",
      groupNumber: "",
      phoneNumber: "",
      medicaidNumber: "",
    },
    pastHealthHistory: {
      surgeries: [], // Array for dynamic surgery entries
    },
    emergencyContacts: [
      { name: "", relationship: "", homePhone: "", workPhone: "", cellPhone: "", address: "" },
      { name: "", relationship: "", homePhone: "", workPhone: "", cellPhone: "", address: "" },
    ],
    physicianInfo: {
      primaryPhysicianName: "",
      physicianPhone: "",
      npiNumber: "",
      physicianAddress: "",
    },
  });

  // Generic handler for input changes
  const handleInputChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  // Handlers for dynamic Past Surgeries
  const handleAddSurgery = () => {
    setFormData((prevData) => ({
      ...prevData,
      pastHealthHistory: {
        ...prevData.pastHealthHistory,
        surgeries: [...prevData.pastHealthHistory.surgeries, { name: "", date: "" }],
      },
    }));
  };

  const handleRemoveSurgery = (index) => {
    setFormData((prevData) => {
      const updatedSurgeries = prevData.pastHealthHistory.surgeries.filter((_, i) => i !== index);
      return {
        ...prevData,
        pastHealthHistory: {
          ...prevData.pastHealthHistory,
          surgeries: updatedSurgeries,
        },
      };
    });
  };

  const handleSurgeryChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedSurgeries = [...prevData.pastHealthHistory.surgeries];
      updatedSurgeries[index] = { ...updatedSurgeries[index], [field]: value };
      return {
        ...prevData,
        pastHealthHistory: {
          ...prevData.pastHealthHistory,
          surgeries: updatedSurgeries,
        },
      };
    });
  };

  // Handler for emergency contact changes
  const handleEmergencyContactChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedContacts = [...prevData.emergencyContacts];
      updatedContacts[index] = { ...updatedContacts[index], [field]: value };
      return {
        ...prevData,
        emergencyContacts: updatedContacts,
      };
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
                  <TabsTrigger value="insurance">Insurance Details</TabsTrigger>
                  <TabsTrigger value="health-history">
                    Past Health History
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <Label htmlFor="middleName">Middle Name</Label>
                          <Input
                            id="middleName"
                            placeholder="Enter middle name"
                            value={formData.clientInfo.middleName}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "middleName", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Current Address</Label>
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
                          <Label htmlFor="sex">Sex</Label>
                          <Select
                            value={formData.clientInfo.sex}
                            onValueChange={(value) =>
                              handleInputChange("clientInfo", "sex", value)
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
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="race">Race</Label>
                          <Select
                            value={formData.clientInfo.race}
                            onValueChange={(value) =>
                              handleInputChange("clientInfo", "race", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select race" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asian">Asian</SelectItem>
                              <SelectItem value="black">Black or African American</SelectItem>
                              <SelectItem value="white">White</SelectItem>
                              <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                              <SelectItem value="native_american">Native American or Alaska Native</SelectItem>
                              <SelectItem value="pacific_islander">Native Hawaiian or Pacific Islander</SelectItem>
                              <SelectItem value="two_or_more">Two or More Races</SelectItem>
                              <SelectItem value="unknown">Unknown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="ssn">SSN</Label>
                          <Input
                            id="ssn"
                            placeholder="XXX-XX-XXXX" // Masking would be implemented here in a real app
                            value={formData.clientInfo.ssn}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "ssn", e.target.value)
                            }
                            maxLength={11} // Example for basic length control
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="referralSource">Referral Source</Label>
                        <Input
                          id="referralSource"
                          placeholder="e.g., Doctor, Friend, Advertisement"
                          value={formData.clientInfo.referralSource}
                          onChange={(e) =>
                            handleInputChange("clientInfo", "referralSource", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfDischarge">Date of Discharge from a facility</Label>
                        <Input
                          id="dateOfDischarge"
                          type="date"
                          value={formData.clientInfo.dateOfDischarge}
                          onChange={(e) =>
                            handleInputChange("clientInfo", "dateOfDischarge", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                          <Input
                            id="primaryDiagnosis"
                            placeholder="Enter primary diagnosis"
                            value={formData.clientInfo.primaryDiagnosis}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "primaryDiagnosis", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondaryDiagnosis">Secondary Diagnosis</Label>
                          <Input
                            id="secondaryDiagnosis"
                            placeholder="Enter secondary diagnosis (optional)"
                            value={formData.clientInfo.secondaryDiagnosis}
                            onChange={(e) =>
                              handleInputChange("clientInfo", "secondaryDiagnosis", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          placeholder="List any allergies"
                          rows={3}
                          value={formData.clientInfo.allergies}
                          onChange={(e) =>
                            handleInputChange("clientInfo", "allergies", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="planOfCare">POC (Plan of Care)</Label>
                        <Textarea
                          id="planOfCare"
                          placeholder="Enter plan of care details"
                          rows={3}
                          value={formData.clientInfo.planOfCare}
                          onChange={(e) =>
                            handleInputChange("clientInfo", "planOfCare", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Insurance Details Tab Content */}
                <TabsContent value="insurance">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Insurance Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="insuranceCompany">Insurance Company</Label>
                        <Input
                          id="insuranceCompany"
                          placeholder="Enter insurance company"
                          value={formData.insuranceDetails.company}
                          onChange={(e) =>
                            handleInputChange("insuranceDetails", "company", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="memberNumber">Member #</Label>
                        <Input
                          id="memberNumber"
                          placeholder="Enter member number"
                          value={formData.insuranceDetails.memberNumber}
                          onChange={(e) =>
                            handleInputChange("insuranceDetails", "memberNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupNumber">Group #</Label>
                        <Input
                          id="groupNumber"
                          placeholder="Enter group number"
                          value={formData.insuranceDetails.groupNumber}
                          onChange={(e) =>
                            handleInputChange("insuranceDetails", "groupNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurancePhoneNumber">Phone #</Label>
                        <Input
                          id="insurancePhoneNumber"
                          placeholder="Enter insurance company phone number"
                          value={formData.insuranceDetails.phoneNumber}
                          onChange={(e) =>
                            handleInputChange("insuranceDetails", "phoneNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicaidNumber">Medicaid #</Label>
                        <Input
                          id="medicaidNumber"
                          placeholder="Enter Medicaid number (optional)"
                          value={formData.insuranceDetails.medicaidNumber}
                          onChange={(e) =>
                            handleInputChange("insuranceDetails", "medicaidNumber", e.target.value)
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Past Health History Tab Content */}
                <TabsContent value="health-history">
                  <Card className="shadow-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Past Health History
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="mb-2 block">Past Surgeries</Label>
                        {formData.pastHealthHistory.surgeries.map((surgery, index) => (
                          <div key={index} className="flex items-end gap-4 mb-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`surgeryName-${index}`}>Surgery Name</Label>
                                <Input
                                  id={`surgeryName-${index}`}
                                  placeholder="e.g., Appendectomy"
                                  value={surgery.name}
                                  onChange={(e) => handleSurgeryChange(index, "name", e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor={`surgeryDate-${index}`}>Date</Label>
                                <Input
                                  id={`surgeryDate-${index}`}
                                  type="date"
                                  value={surgery.date}
                                  onChange={(e) => handleSurgeryChange(index, "date", e.target.value)}
                                />
                              </div>
                            </div>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => handleRemoveSurgery(index)}
                              className="shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddSurgery}
                          className="mt-4"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Surgery
                        </Button>
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
                      {formData.emergencyContacts.map((contact, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-semibold mb-4">Contact {index + 1}</h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor={`emergencyName-${index}`}>Name</Label>
                              <Input
                                id={`emergencyName-${index}`}
                                placeholder="Enter full name"
                                value={contact.name}
                                onChange={(e) => handleEmergencyContactChange(index, "name", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`emergencyRelationship-${index}`}>Relationship</Label>
                              <Input
                                id={`emergencyRelationship-${index}`}
                                placeholder="e.g., Parent, Spouse"
                                value={contact.relationship}
                                onChange={(e) => handleEmergencyContactChange(index, "relationship", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`emergencyHomePhone-${index}`}>Home Phone</Label>
                              <Input
                                id={`emergencyHomePhone-${index}`}
                                placeholder="Enter home phone number"
                                value={contact.homePhone}
                                onChange={(e) => handleEmergencyContactChange(index, "homePhone", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`emergencyWorkPhone-${index}`}>Work Phone</Label>
                              <Input
                                id={`emergencyWorkPhone-${index}`}
                                placeholder="Enter work phone number"
                                value={contact.workPhone}
                                onChange={(e) => handleEmergencyContactChange(index, "workPhone", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`emergencyCellPhone-${index}`}>Cell Phone</Label>
                              <Input
                                id={`emergencyCellPhone-${index}`}
                                placeholder="Enter cell phone number"
                                value={contact.cellPhone}
                                onChange={(e) => handleEmergencyContactChange(index, "cellPhone", e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`emergencyAddress-${index}`}>Address</Label>
                              <Textarea
                                id={`emergencyAddress-${index}`}
                                placeholder="Enter contact's address"
                                rows={2}
                                value={contact.address}
                                onChange={(e) => handleEmergencyContactChange(index, "address", e.target.value)}
                              />
                            </div>
                          </div>
                          {index === 0 && <Separator className="my-6" />}
                        </div>
                      ))}
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
                        <Label htmlFor="primaryPhysicianName">Primary Physician Name</Label>
                        <Input
                          id="primaryPhysicianName"
                          placeholder="Enter physician's full name"
                          value={formData.physicianInfo.primaryPhysicianName}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "primaryPhysicianName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="physicianPhone">Physician Phone #</Label>
                        <Input
                          id="physicianPhone"
                          placeholder="Enter physician's phone number"
                          value={formData.physicianInfo.physicianPhone}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "physicianPhone", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="npiNumber">NPI #</Label>
                        <Input
                          id="npiNumber"
                          placeholder="Enter NPI number"
                          value={formData.physicianInfo.npiNumber}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "npiNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="physicianAddress">Physician Address</Label>
                        <Textarea
                          id="physicianAddress"
                          placeholder="Enter physician's address"
                          rows={3}
                          value={formData.physicianInfo.physicianAddress}
                          onChange={(e) =>
                            handleInputChange("physicianInfo", "physicianAddress", e.target.value)
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
                      Submit
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
