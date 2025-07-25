import { useState } from "react";
import { Plus, Trash2, Save, Send, User, Shield, History, Phone, Stethoscope } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Surgery {
  id: string;
  name: string;
  date: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phoneHome: string;
  phoneWork: string;
  phoneCell: string;
  address: string;
}

export default function ClientIntake() {
  const { toast } = useToast();
  
  // Client Information State
  const [clientInfo, setClientInfo] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    address: "",
    dateOfBirth: "",
    sex: "",
    race: "",
    ssn: "",
    referralSource: "",
    dischargeDate: "",
    primaryDiagnosis: "",
    secondaryDiagnosis: "",
    allergies: "",
    planOfCare: ""
  });

  // Insurance Details State
  const [insurance, setInsurance] = useState({
    company: "",
    memberNumber: "",
    groupNumber: "",
    phone: "",
    medicaidNumber: ""
  });

  // Past Surgeries State
  const [surgeries, setSurgeries] = useState<Surgery[]>([]);

  // Emergency Contacts State
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: "", relationship: "", phoneHome: "", phoneWork: "", phoneCell: "", address: "" },
    { name: "", relationship: "", phoneHome: "", phoneWork: "", phoneCell: "", address: "" }
  ]);

  // Physician Information State
  const [physician, setPhysician] = useState({
    name: "",
    phone: "",
    npi: "",
    address: ""
  });

  const addSurgery = () => {
    setSurgeries([...surgeries, { id: Date.now().toString(), name: "", date: "" }]);
  };

  const removeSurgery = (id: string) => {
    setSurgeries(surgeries.filter(surgery => surgery.id !== id));
  };

  const updateSurgery = (id: string, field: string, value: string) => {
    setSurgeries(surgeries.map(surgery => 
      surgery.id === id ? { ...surgery, [field]: value } : surgery
    ));
  };

  const updateEmergencyContact = (index: number, field: string, value: string) => {
    const updated = [...emergencyContacts];
    updated[index] = { ...updated[index], [field]: value };
    setEmergencyContacts(updated);
  };

  const handleSubmit = () => {
    toast({
      title: "Form Submitted",
      description: "Client intake form has been submitted successfully.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Client intake form has been saved as draft.",
    });
  };

  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Client Intake Form</h1>
                <p className="text-muted-foreground">Complete all sections to register a new client</p>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {/* Client Information */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Client Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={clientInfo.lastName}
                          onChange={(e) => setClientInfo({...clientInfo, lastName: e.target.value})}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={clientInfo.firstName}
                          onChange={(e) => setClientInfo({...clientInfo, firstName: e.target.value})}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="middleName">Middle Name</Label>
                        <Input
                          id="middleName"
                          value={clientInfo.middleName}
                          onChange={(e) => setClientInfo({...clientInfo, middleName: e.target.value})}
                          placeholder="Enter middle name"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <Label htmlFor="address">Current Address *</Label>
                      <Textarea
                        id="address"
                        value={clientInfo.address}
                        onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                        placeholder="Enter complete address including street, city, state, and ZIP code"
                        rows={3}
                        required
                      />
                    </div>

                    {/* Personal Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={clientInfo.dateOfBirth}
                          onChange={(e) => setClientInfo({...clientInfo, dateOfBirth: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="sex">Sex *</Label>
                        <Select value={clientInfo.sex} onValueChange={(value) => setClientInfo({...clientInfo, sex: value})}>
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
                      <div>
                        <Label htmlFor="race">Race</Label>
                        <Select value={clientInfo.race} onValueChange={(value) => setClientInfo({...clientInfo, race: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select race" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="american-indian">American Indian or Alaska Native</SelectItem>
                            <SelectItem value="asian">Asian</SelectItem>
                            <SelectItem value="black">Black or African American</SelectItem>
                            <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                            <SelectItem value="pacific-islander">Native Hawaiian or Other Pacific Islander</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ssn">Social Security Number</Label>
                        <Input
                          id="ssn"
                          value={clientInfo.ssn}
                          onChange={(e) => setClientInfo({...clientInfo, ssn: formatSSN(e.target.value)})}
                          placeholder="XXX-XX-XXXX"
                          maxLength={11}
                        />
                      </div>
                      <div>
                        <Label htmlFor="referralSource">Referral Source</Label>
                        <Input
                          id="referralSource"
                          value={clientInfo.referralSource}
                          onChange={(e) => setClientInfo({...clientInfo, referralSource: e.target.value})}
                          placeholder="Enter referral source"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dischargeDate">Date of Discharge from Facility</Label>
                      <Input
                        id="dischargeDate"
                        type="date"
                        value={clientInfo.dischargeDate}
                        onChange={(e) => setClientInfo({...clientInfo, dischargeDate: e.target.value})}
                      />
                    </div>

                    {/* Medical Information */}
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Medical Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="primaryDiagnosis">Primary Diagnosis</Label>
                          <Input
                            id="primaryDiagnosis"
                            value={clientInfo.primaryDiagnosis}
                            onChange={(e) => setClientInfo({...clientInfo, primaryDiagnosis: e.target.value})}
                            placeholder="Enter primary diagnosis"
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondaryDiagnosis">Secondary Diagnosis</Label>
                          <Input
                            id="secondaryDiagnosis"
                            value={clientInfo.secondaryDiagnosis}
                            onChange={(e) => setClientInfo({...clientInfo, secondaryDiagnosis: e.target.value})}
                            placeholder="Enter secondary diagnosis"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="allergies">Allergies</Label>
                        <Textarea
                          id="allergies"
                          value={clientInfo.allergies}
                          onChange={(e) => setClientInfo({...clientInfo, allergies: e.target.value})}
                          placeholder="List all known allergies and reactions"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="planOfCare">Plan of Care (POC)</Label>
                        <Textarea
                          id="planOfCare"
                          value={clientInfo.planOfCare}
                          onChange={(e) => setClientInfo({...clientInfo, planOfCare: e.target.value})}
                          placeholder="Enter plan of care details"
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance Details */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-healthcare-teal" />
                      Insurance Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insuranceCompany">Insurance Company</Label>
                        <Input
                          id="insuranceCompany"
                          value={insurance.company}
                          onChange={(e) => setInsurance({...insurance, company: e.target.value})}
                          placeholder="Enter insurance company name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="insurancePhone">Insurance Phone #</Label>
                        <Input
                          id="insurancePhone"
                          value={insurance.phone}
                          onChange={(e) => setInsurance({...insurance, phone: e.target.value})}
                          placeholder="Enter insurance phone number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="memberNumber">Member #</Label>
                        <Input
                          id="memberNumber"
                          value={insurance.memberNumber}
                          onChange={(e) => setInsurance({...insurance, memberNumber: e.target.value})}
                          placeholder="Enter member number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupNumber">Group #</Label>
                        <Input
                          id="groupNumber"
                          value={insurance.groupNumber}
                          onChange={(e) => setInsurance({...insurance, groupNumber: e.target.value})}
                          placeholder="Enter group number"
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicaidNumber">Medicaid #</Label>
                        <Input
                          id="medicaidNumber"
                          value={insurance.medicaidNumber}
                          onChange={(e) => setInsurance({...insurance, medicaidNumber: e.target.value})}
                          placeholder="Enter Medicaid number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Past Health History */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="w-5 h-5 text-healthcare-coral" />
                      Past Health History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Past Surgeries</h3>
                      <Button onClick={addSurgery} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Surgery
                      </Button>
                    </div>
                    {surgeries.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No surgeries recorded. Click "Add Surgery" to add one.</p>
                    ) : (
                      <div className="space-y-3">
                        {surgeries.map((surgery) => (
                          <div key={surgery.id} className="flex gap-4 items-end">
                            <div className="flex-1">
                              <Label>Surgery Name</Label>
                              <Input
                                value={surgery.name}
                                onChange={(e) => updateSurgery(surgery.id, 'name', e.target.value)}
                                placeholder="Enter surgery name"
                              />
                            </div>
                            <div className="w-40">
                              <Label>Date</Label>
                              <Input
                                type="date"
                                value={surgery.date}
                                onChange={(e) => updateSurgery(surgery.id, 'date', e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={() => removeSurgery(surgery.id)}
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-healthcare-warning" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          {index === 0 ? "Primary" : "Secondary"} Emergency Contact
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input
                              value={contact.name}
                              onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                              placeholder="Enter contact name"
                            />
                          </div>
                          <div>
                            <Label>Relationship</Label>
                            <Input
                              value={contact.relationship}
                              onChange={(e) => updateEmergencyContact(index, 'relationship', e.target.value)}
                              placeholder="Enter relationship"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label>Home Phone</Label>
                            <Input
                              value={contact.phoneHome}
                              onChange={(e) => updateEmergencyContact(index, 'phoneHome', e.target.value)}
                              placeholder="Enter home phone"
                            />
                          </div>
                          <div>
                            <Label>Work Phone</Label>
                            <Input
                              value={contact.phoneWork}
                              onChange={(e) => updateEmergencyContact(index, 'phoneWork', e.target.value)}
                              placeholder="Enter work phone"
                            />
                          </div>
                          <div>
                            <Label>Cell Phone</Label>
                            <Input
                              value={contact.phoneCell}
                              onChange={(e) => updateEmergencyContact(index, 'phoneCell', e.target.value)}
                              placeholder="Enter cell phone"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Address</Label>
                          <Textarea
                            value={contact.address}
                            onChange={(e) => updateEmergencyContact(index, 'address', e.target.value)}
                            placeholder="Enter complete address"
                            rows={2}
                          />
                        </div>
                        {index === 0 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Physician Information */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-healthcare-success" />
                      Physician Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="physicianName">Primary Physician Name</Label>
                        <Input
                          id="physicianName"
                          value={physician.name}
                          onChange={(e) => setPhysician({...physician, name: e.target.value})}
                          placeholder="Enter physician name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="physicianPhone">Physician Phone #</Label>
                        <Input
                          id="physicianPhone"
                          value={physician.phone}
                          onChange={(e) => setPhysician({...physician, phone: e.target.value})}
                          placeholder="Enter physician phone"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="npiNumber">NPI #</Label>
                      <Input
                        id="npiNumber"
                        value={physician.npi}
                        onChange={(e) => setPhysician({...physician, npi: e.target.value})}
                        placeholder="Enter NPI number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="physicianAddress">Physician Address</Label>
                      <Textarea
                        id="physicianAddress"
                        value={physician.address}
                        onChange={(e) => setPhysician({...physician, address: e.target.value})}
                        placeholder="Enter physician's complete address"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button onClick={handleSaveDraft} variant="outline" size="lg" className="min-w-40">
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button onClick={handleSubmit} size="lg" className="min-w-40 bg-gradient-primary text-white hover:opacity-90">
                    <Send className="w-4 h-4 mr-2" />
                    Submit Form
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}