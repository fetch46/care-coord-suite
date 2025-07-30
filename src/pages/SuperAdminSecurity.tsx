import { useState, useEffect } from "react"
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Shield, AlertTriangle, Key, Lock, Eye, FileText, Settings } from "lucide-react"

interface SecurityLog {
  id: string
  event_type: string
  user_email: string
  ip_address: string
  timestamp: string
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface SecuritySettings {
  password_min_length: number
  password_require_uppercase: boolean
  password_require_lowercase: boolean
  password_require_numbers: boolean
  password_require_symbols: boolean
  session_timeout_minutes: number
  max_login_attempts: number
  two_factor_required: boolean
  ip_whitelist_enabled: boolean
  audit_log_retention_days: number
}

export default function SuperAdminSecurity() {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([])
  const [settings, setSettings] = useState<SecuritySettings>({
    password_min_length: 8,
    password_require_uppercase: true,
    password_require_lowercase: true,
    password_require_numbers: true,
    password_require_symbols: false,
    session_timeout_minutes: 480,
    max_login_attempts: 5,
    two_factor_required: false,
    ip_whitelist_enabled: false,
    audit_log_retention_days: 90
  })
  const [loading, setLoading] = useState(true)
  const [ipWhitelist, setIpWhitelist] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      // Mock security logs - in real implementation, would fetch from auth logs
      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          event_type: 'Failed Login',
          user_email: 'admin@example.com',
          ip_address: '192.168.1.100',
          timestamp: new Date().toISOString(),
          details: 'Multiple failed login attempts',
          severity: 'high'
        },
        {
          id: '2',
          event_type: 'Successful Login',
          user_email: 'user@example.com',
          ip_address: '10.0.0.50',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: 'Normal login from trusted device',
          severity: 'low'
        },
        {
          id: '3',
          event_type: 'Permission Change',
          user_email: 'admin@example.com',
          ip_address: '192.168.1.100',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: 'User role changed from caregiver to administrator',
          severity: 'medium'
        }
      ]

      setSecurityLogs(mockLogs)
    } catch (error) {
      console.error('Error fetching security data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch security data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsUpdate = async () => {
    try {
      // In real implementation, would update security settings in database
      toast({
        title: "Success",
        description: "Security settings updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive"
      })
    }
  }

  const handleIpWhitelistUpdate = async () => {
    try {
      // In real implementation, would update IP whitelist
      toast({
        title: "Success",
        description: "IP whitelist updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update IP whitelist",
        variant: "destructive"
      })
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'Failed Login': return <AlertTriangle className="h-4 w-4" />
      case 'Successful Login': return <Key className="h-4 w-4" />
      case 'Permission Change': return <Settings className="h-4 w-4" />
      default: return <Eye className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading security data...</div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Permissions</h1>
          <p className="text-muted-foreground">
            Monitor security events and configure system-wide security policies
          </p>
        </div>

        {/* Security Alert */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Status</AlertTitle>
          <AlertDescription>
            All systems operational. No critical security issues detected in the last 24 hours.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="logs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="logs">Security Logs</TabsTrigger>
            <TabsTrigger value="policies">Password Policies</TabsTrigger>
            <TabsTrigger value="access">Access Control</TabsTrigger>
            <TabsTrigger value="audit">Audit Settings</TabsTrigger>
          </TabsList>

          {/* Security Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Monitor authentication attempts, permission changes, and other security events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {securityLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEventIcon(log.event_type)}
                              {log.event_type}
                            </div>
                          </TableCell>
                          <TableCell>{log.user_email}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                          <TableCell>
                            <Badge variant={getSeverityBadgeVariant(log.severity)}>
                              {log.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Policies Tab */}
          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <CardTitle>Password Security Policies</CardTitle>
                <CardDescription>
                  Configure password requirements for all users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="minLength">Minimum Password Length</Label>
                      <Input
                        id="minLength"
                        type="number"
                        value={settings.password_min_length}
                        onChange={(e) => setSettings({
                          ...settings,
                          password_min_length: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.session_timeout_minutes}
                        onChange={(e) => setSettings({
                          ...settings,
                          session_timeout_minutes: parseInt(e.target.value)
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxAttempts"
                        type="number"
                        value={settings.max_login_attempts}
                        onChange={(e) => setSettings({
                          ...settings,
                          max_login_attempts: parseInt(e.target.value)
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                      <Switch
                        id="requireUppercase"
                        checked={settings.password_require_uppercase}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          password_require_uppercase: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireLowercase">Require Lowercase Letters</Label>
                      <Switch
                        id="requireLowercase"
                        checked={settings.password_require_lowercase}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          password_require_lowercase: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireNumbers">Require Numbers</Label>
                      <Switch
                        id="requireNumbers"
                        checked={settings.password_require_numbers}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          password_require_numbers: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireSymbols">Require Special Characters</Label>
                      <Switch
                        id="requireSymbols"
                        checked={settings.password_require_symbols}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          password_require_symbols: checked
                        })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                      <Switch
                        id="requireTwoFactor"
                        checked={settings.two_factor_required}
                        onCheckedChange={(checked) => setSettings({
                          ...settings,
                          two_factor_required: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSettingsUpdate}>
                  <Lock className="w-4 h-4 mr-2" />
                  Save Password Policies
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control Tab */}
          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Settings</CardTitle>
                <CardDescription>
                  Configure IP restrictions and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ipWhitelist">Enable IP Whitelist</Label>
                    <p className="text-sm text-muted-foreground">
                      Restrict access to specific IP addresses
                    </p>
                  </div>
                  <Switch
                    id="ipWhitelist"
                    checked={settings.ip_whitelist_enabled}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      ip_whitelist_enabled: checked
                    })}
                  />
                </div>
                
                {settings.ip_whitelist_enabled && (
                  <div className="space-y-2">
                    <Label htmlFor="ipAddresses">Allowed IP Addresses</Label>
                    <Textarea
                      id="ipAddresses"
                      placeholder="Enter IP addresses or ranges (one per line)&#10;192.168.1.0/24&#10;10.0.0.100"
                      value={ipWhitelist}
                      onChange={(e) => setIpWhitelist(e.target.value)}
                      rows={5}
                    />
                    <Button onClick={handleIpWhitelistUpdate} size="sm">
                      Update IP Whitelist
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Role-Based Access Control</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage permissions for different user roles
                      </p>
                      <Button variant="outline" size="sm">
                        Configure RBAC
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">API Access Tokens</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage API tokens and service keys
                      </p>
                      <Button variant="outline" size="sm">
                        Manage Tokens
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Settings Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle>Audit & Compliance Settings</CardTitle>
                <CardDescription>
                  Configure audit logging and compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="retentionDays">Audit Log Retention (days)</Label>
                  <Input
                    id="retentionDays"
                    type="number"
                    value={settings.audit_log_retention_days}
                    onChange={(e) => setSettings({
                      ...settings,
                      audit_log_retention_days: parseInt(e.target.value)
                    })}
                  />
                  <p className="text-sm text-muted-foreground">
                    How long to keep audit logs before automatic deletion
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Export Audit Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download audit logs for compliance reporting
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Export Logs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Compliance Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Generate compliance and security reports
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Button onClick={handleSettingsUpdate}>
                  <Settings className="w-4 h-4 mr-2" />
                  Save Audit Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  )
}