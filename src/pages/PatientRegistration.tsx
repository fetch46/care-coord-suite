import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

// Validation schemas
const clientInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  middleName: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  dob: z.string().min(1, "Date of birth is required"),
  sex: z.string().min(1, "Sex is required"),
  race: z.string().min(1, "Race is required"),
  ssn: z.string().min(1, "SSN is required"),
  referralSource: z.string().optional(),
  dateOfDischarge: z.string().optional(),
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnosis: z.string().optional(),
  allergies: z.string().optional(),
  planOfCare: z.string().optional(),
});

const insuranceSchema = z.object({
  company: z.string().optional(),
  memberNumber: z.string().optional(),
  groupNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  medicaidNumber: z.string().optional(),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
  cellPhone: z.string().min(1, "At least one phone number is required"),
  address: z.string().optional(),
});

const physicianSchema = z.object({
  primaryPhysicianName: z.string().min(1, "Primary physician name is required"),
  physicianPhone: z.string().optional(),
  npiNumber: z.string().optional(),
  physicianAddress: z.string().optional(),
});

const registrationSchema = z.object({
  clientInfo: clientInfoSchema,
  insuranceDetails: insuranceSchema,
  emergencyContacts: z.array(emergencyContactSchema).min(1, "At least one emergency contact is required"),
  physicianInfo: physicianSchema,
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function PatientRegistration() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [currentTab, setCurrentTab] = useState("client-info");
  
  const tabOrder = ["client-info", "insurance", "health-history", "emergency", "physician"];

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

  
  // Form validation
  const validateCurrentTab = () => {
    const errors = [];
    
    switch (currentTab) {
      case "client-info":
        if (!formData.clientInfo.firstName) errors.push("First name is required");
        if (!formData.clientInfo.lastName) errors.push("Last name is required");
        if (!formData.clientInfo.address) errors.push("Address is required");
        if (!formData.clientInfo.dob) errors.push("Date of birth is required");
        if (!formData.clientInfo.sex) errors.push("Sex is required");
        if (!formData.clientInfo.race) errors.push("Race is required");
        if (!formData.clientInfo.ssn) errors.push("SSN is required");
        break;
      case "emergency":
        const validContacts = formData.emergencyContacts.filter(contact => contact.name);
        if (validContacts.length === 0) errors.push("At least one emergency contact is required");
        validContacts.forEach((contact, index) => {
          if (!contact.cellPhone && !contact.homePhone && !contact.workPhone) {
            errors.push(`Emergency contact ${index + 1} needs at least one phone number`);
          }
        });
        break;
      case "physician":
        if (!formData.physicianInfo.primaryPhysicianName) {
          errors.push("Primary physician name is required");
        }
        break;
    }
    
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Navigation functions
  const goToNextTab = () => {
    if (!validateCurrentTab()) return;
    
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex < tabOrder.length - 1) {
      setCurrentTab(tabOrder[currentIndex + 1]);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabOrder.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabOrder[currentIndex - 1]);
    }
  };

  const isFirstTab = () => tabOrder.indexOf(currentTab) === 0;
  const isLastTab = () => tabOrder.indexOf(currentTab) === tabOrder.length - 1;

  // Database operations
  const savePatientRegistration = async (status = 'draft') => {
    if (!formData.clientInfo.firstName || !formData.clientInfo.lastName) {
      toast({
        title: "Missing Information",
        description: "First name and last name are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Save main patient record
      const patientData = {
        first_name: formData.clientInfo.firstName,
        last_name: formData.clientInfo.lastName,
        middle_name: formData.clientInfo.middleName || null,
        address: formData.clientInfo.address || null,
        date_of_birth: formData.clientInfo.dob || null,
        sex: formData.clientInfo.sex || null,
        race: formData.clientInfo.race || null,
        ssn: formData.clientInfo.ssn || null,
        referral_source: formData.clientInfo.referralSource || null,
        date_of_discharge: formData.clientInfo.dateOfDischarge || null,
        primary_diagnosis: formData.clientInfo.primaryDiagnosis || null,
        secondary_diagnosis: formData.clientInfo.secondaryDiagnosis || null,
        plan_of_care: formData.clientInfo.planOfCare || null,
        registration_status: status,
      };

      let currentPatientId = patientId;
      
      if (patientId) {
        // Update existing patient
        const { error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', patientId);
        
        if (error) throw error;
      } else {
        // Create new patient
        const { data, error } = await supabase
          .from('patients')
          .insert(patientData)
          .select()
          .single();
        
        if (error) throw error;
        currentPatientId = data.id;
        setPatientId(currentPatientId);
      }

      // Save allergies if any
      if (formData.clientInfo.allergies && currentPatientId) {
        const allergies = formData.clientInfo.allergies.split(',').map(allergy => allergy.trim()).filter(Boolean);
        
        for (const allergyName of allergies) {
          await supabase
            .from('patient_allergies')
            .upsert({
              patient_id: currentPatientId,
              allergy_name: allergyName,
            });
        }
      }

      // Save insurance details
      if (currentPatientId && (formData.insuranceDetails.company || formData.insuranceDetails.memberNumber)) {
        await supabase
          .from('patient_insurance')
          .upsert([{
            patient_id: currentPatientId,
            provider_name: formData.insuranceDetails.company || 'Unknown Provider',
            policy_number: formData.insuranceDetails.memberNumber || null,
            group_number: formData.insuranceDetails.groupNumber || null,
            company: formData.insuranceDetails.company || null,
            member_number: formData.insuranceDetails.memberNumber || null,
            phone_number: formData.insuranceDetails.phoneNumber || null,
            medicaid_number: formData.insuranceDetails.medicaidNumber || null,
          }]);
      }

      // Save surgeries
      if (currentPatientId && formData.pastHealthHistory.surgeries.length > 0) {
        for (const surgery of formData.pastHealthHistory.surgeries) {
          if (surgery.name) {
            await supabase
              .from('patient_surgeries')
              .insert({
                patient_id: currentPatientId,
                surgery_name: surgery.name,
                surgery_date: surgery.date || null,
              });
          }
        }
      }

      // Save emergency contacts
      if (currentPatientId) {
        for (let i = 0; i < formData.emergencyContacts.length; i++) {
          const contact = formData.emergencyContacts[i];
          if (contact.name) {
            await supabase
              .from('patient_emergency_contacts')
              .insert({
                patient_id: currentPatientId,
                name: contact.name,
                relationship: contact.relationship || null,
                home_phone: contact.homePhone || null,
                work_phone: contact.workPhone || null,
                cell_phone: contact.cellPhone || null,
                address: contact.address || null,
                is_primary: i === 0,
              });
          }
        }
      }

      // Save physician info
      if (currentPatientId && formData.physicianInfo.primaryPhysicianName) {
        await supabase
          .from('patient_physicians')
          .insert({
            patient_id: currentPatientId,
            physician_name: formData.physicianInfo.primaryPhysicianName,
            physician_phone: formData.physicianInfo.physicianPhone || null,
            npi_number: formData.physicianInfo.npiNumber || null,
            physician_address: formData.physicianInfo.physicianAddress || null,
            is_primary: true,
          });
      }

      toast({
        title: "Success",
        description: `Patient registration ${status === 'completed' ? 'completed' : 'saved as draft'} successfully.`,
      });

    } catch (error) {
      console.error('Error saving patient registration:', error);
      toast({
        title: "Error",
        description: "Failed to save patient registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    savePatientRegistration('completed');
  };

  const handleSaveDraft = () => {
    savePatientRegistration('draft');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full max-w-screen-2xl mx-auto space-y-8">
              {/* Header with Back Button */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/patients')}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Patients
                </Button>
              </div>
              
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Patient Registration
                </h1>
                <p className="text-muted-foreground">
                  Complete all sections to register a new patient
                </p>
              </div>

              <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
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

              {/* Form Navigation */}
              <div className="flex justify-between items-center pt-6">
                <div className="flex gap-2">
                  {!isFirstTab() && (
                    <Button
                      variant="outline"
                      onClick={goToPreviousTab}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {!isLastTab() ? (
                    <Button
                      onClick={goToNextTab}
                      className="bg-gradient-primary text-white hover:opacity-90 flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Draft
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-primary text-white hover:opacity-90 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit Registration
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
