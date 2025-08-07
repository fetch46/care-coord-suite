import { useState, useEffect } from "react"
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Mail, Send, MessageSquare, Bell, Settings, Plus, Eye, Trash2 } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'welcome' | 'notification' | 'reminder' | 'alert'
  is_active: boolean
  created_at: string
}

interface NotificationSettings {
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean
  notification_frequency: 'immediate' | 'daily' | 'weekly'
  send_welcome_emails: boolean
  send_password_reset_emails: boolean
  send_system_alerts: boolean
}

interface CommunicationLog {
  id: string
  type: 'email' | 'sms' | 'push'
  recipient: string
  subject: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sent_at: string
  template_name?: string
}

export default function SuperAdminCommunication() {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([])
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    notification_frequency: 'immediate',
    send_welcome_emails: true,
    send_password_reset_emails: true,
    send_system_alerts: true
  })
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchCommunicationData()
  }, [])

  const fetchCommunicationData = async () => {
    try {
      // Mock data - in real implementation, would fetch from database
      const mockTemplates: EmailTemplate[] = [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to our Healthcare System',
          content: 'Dear {{user_name}}, welcome to our healthcare management system...',
          type: 'welcome',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Password Reset',
          subject: 'Reset Your Password',
          content: 'You have requested to reset your password. Click the link below...',
          type: 'notification',
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Appointment Reminder',
          subject: 'Upcoming Appointment Reminder',
          content: 'This is a reminder about your upcoming appointment on {{appointment_date}}...',
          type: 'reminder',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ]

      const mockLogs: CommunicationLog[] = [
        {
          id: '1',
          type: 'email',
          recipient: 'user@example.com',
          subject: 'Welcome to our Healthcare System',
          status: 'delivered',
          sent_at: new Date().toISOString(),
          template_name: 'Welcome Email'
        },
        {
          id: '2',
          type: 'email',
          recipient: 'admin@example.com',
          subject: 'System Alert: High CPU Usage',
          status: 'sent',
          sent_at: new Date(Date.now() - 3600000).toISOString(),
          template_name: 'System Alert'
        },
        {
          id: '3',
          type: 'sms',
          recipient: '+1234567890',
          subject: 'Appointment reminder',
          status: 'failed',
          sent_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]

      setEmailTemplates(mockTemplates)
      setCommunicationLogs(mockLogs)
    } catch (error) {
      console.error('Error fetching communication data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch communication data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      // In real implementation, would save to database
      toast({
        title: "Success",
        description: "Communication settings saved successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      })
    }
  }

  const handleSaveTemplate = async () => {
    try {
      // In real implementation, would save template to database
      toast({
        title: "Success",
        description: "Email template saved successfully"
      })
      setIsTemplateDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      // In real implementation, would delete from database
      setEmailTemplates(templates => templates.filter(t => t.id !== templateId))
      toast({
        title: "Success",
        description: "Email template deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive"
      })
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      })
      return
    }

    try {
      // In real implementation, would send test email
      toast({
        title: "Success",
        description: `Test email sent to ${testEmail}`
      })
      setTestEmail("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      })
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'default'
      case 'sent': return 'secondary'
      case 'failed': return 'destructive'
      case 'pending': return 'outline'
      default: return 'secondary'
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'welcome': return 'default'
      case 'notification': return 'secondary'
      case 'reminder': return 'outline'
      case 'alert': return 'destructive'
      default: return 'secondary'
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading communication settings...</div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Center</h1>
          <p className="text-muted-foreground">
            Manage email templates, notifications, and communication logs
          </p>
        </div>

        <Tabs defaultValue="templates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="templates">Email Templates</TabsTrigger>
            <TabsTrigger value="settings">Notification Settings</TabsTrigger>
            <TabsTrigger value="logs">Communication Logs</TabsTrigger>
            <TabsTrigger value="test">Test & Preview</TabsTrigger>
          </TabsList>

          {/* Email Templates Tab */}
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>
                      Manage automated email templates for system communications
                    </CardDescription>
                  </div>
                  <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Create Email Template</DialogTitle>
                        <DialogDescription>
                          Create a new email template for automated communications
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="templateName">Template Name</Label>
                            <Input id="templateName" placeholder="e.g., Welcome Email" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="templateType">Type</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="welcome">Welcome</SelectItem>
                                <SelectItem value="notification">Notification</SelectItem>
                                <SelectItem value="reminder">Reminder</SelectItem>
                                <SelectItem value="alert">Alert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject Line</Label>
                          <Input id="subject" placeholder="Email subject" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="content">Email Content</Label>
                          <Textarea 
                            id="content" 
                            placeholder="Email content with {{variables}}"
                            rows={8}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="active" />
                          <Label htmlFor="active">Active template</Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveTemplate}>
                            Save Template
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Template Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {emailTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell className="font-medium">{template.name}</TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(template.type)}>
                              {template.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{template.subject}</TableCell>
                          <TableCell>
                            <Badge variant={template.is_active ? "default" : "secondary"}>
                              {template.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(template.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure system-wide notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Communication Channels</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={settings.email_notifications}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          email_notifications: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={settings.sms_notifications}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          sms_notifications: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Send push notifications to mobile apps</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={settings.push_notifications}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          push_notifications: checked
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Automated Communications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="welcomeEmails">Welcome Emails</Label>
                      <Switch
                        id="welcomeEmails"
                        checked={settings.send_welcome_emails}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          send_welcome_emails: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passwordResetEmails">Password Reset Emails</Label>
                      <Switch
                        id="passwordResetEmails"
                        checked={settings.send_password_reset_emails}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          send_password_reset_emails: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="systemAlerts">System Alerts</Label>
                      <Switch
                        id="systemAlerts"
                        checked={settings.send_system_alerts}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          send_system_alerts: checked
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Notification Frequency</Label>
                  <Select 
                    value={settings.notification_frequency} 
                    onValueChange={(value: string) => setSettings({
                      ...settings,
                      notification_frequency: value
                    })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Communication Logs</CardTitle>
                <CardDescription>
                  View the history of all sent communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {communicationLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {log.type === 'email' && <Mail className="w-4 h-4" />}
                              {log.type === 'sms' && <MessageSquare className="w-4 h-4" />}
                              {log.type === 'push' && <Bell className="w-4 h-4" />}
                              <span className="capitalize">{log.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.recipient}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.subject}</TableCell>
                          <TableCell>{log.template_name || 'Custom'}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(log.status)}>
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(log.sent_at).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test & Preview Tab */}
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle>Test & Preview</CardTitle>
                <CardDescription>
                  Test email templates and communication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Send Test Email</h3>
                  <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="testEmail">Test Email Address</Label>
                      <Input
                        id="testEmail"
                        type="email"
                        placeholder="test@example.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSendTestEmail}>
                      <Send className="w-4 h-4 mr-2" />
                      Send Test
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Template Preview</h3>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template to preview" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      Select a template above to preview its content
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  )
}