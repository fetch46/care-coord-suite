import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Plus, Search, Users, UserCheck, UserX, Mail, Check, X } from "lucide-react"

interface OrganizationUser {
  id: string
  organization_id: string
  user_id: string
  role: 'administrator' | 'reception' | 'registered_nurse' | 'caregiver' | 'owner' | 'admin' | 'staff'
  is_confirmed: boolean
  invited_at: string
  confirmed_at: string | null
  invited_by: string | null
  profiles: {
    first_name: string | null
    last_name: string | null
    email: string | null
    phone: string | null
  } | null
}

interface NewUser {
  email: string
  first_name: string
  last_name: string
  role: string
}

interface OrganizationUserManagementProps {
  organizationId: string
  organizationName: string
}

export function OrganizationUserManagement({ organizationId, organizationName }: OrganizationUserManagementProps) {
  const [users, setUsers] = useState<OrganizationUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    email: "",
    first_name: "",
    last_name: "",
    role: "staff"
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchOrganizationUsers()
  }, [organizationId])

  const fetchOrganizationUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('organization_users')
        .select(`
          *,
          profiles (first_name, last_name, email, phone)
        `)
        .eq('organization_id', organizationId)
        .order('invited_at', { ascending: false })

      if (error) throw error
      setUsers((data || []) as OrganizationUser[])
    } catch (error) {
      console.error('Error fetching organization users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch organization users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const fullName = `${user.profiles?.first_name || ''} ${user.profiles?.last_name || ''}`.trim()
    const email = user.profiles?.email || ''
    
    const matchesSearch = 
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const getUserDisplayName = (user: OrganizationUser) => {
    if (user.profiles?.first_name || user.profiles?.last_name) {
      return `${user.profiles.first_name || ''} ${user.profiles.last_name || ''}`.trim()
    }
    return user.profiles?.email || 'Unknown User'
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'destructive'
      case 'admin': return 'default'
      case 'staff': return 'secondary'
      default: return 'outline'
    }
  }

  const handleInviteUser = async () => {
    if (!newUser.email.trim() || !newUser.first_name.trim() || !newUser.last_name.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create the user via the password-reset edge function
      const { data: authData, error: authError } = await supabase.functions.invoke('password-reset', {
        body: {
          action: 'create-organization-user',
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          role: newUser.role,
          organizationId: organizationId
        }
      });

      if (authError) throw authError;

      toast({
        title: "Success",
        description: `User invited successfully. They will receive an email with login instructions.`,
      });

      setNewUser({
        email: "",
        first_name: "",
        last_name: "",
        role: "staff"
      });
      setIsInviteDialogOpen(false);
      await fetchOrganizationUsers();
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to invite user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('organization_users')
        .update({ 
          is_confirmed: true,
          confirmed_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User confirmed successfully",
      })

      await fetchOrganizationUsers()
    } catch (error) {
      console.error('Error confirming user:', error)
      toast({
        title: "Error",
        description: "Failed to confirm user",
        variant: "destructive",
      })
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('organization_users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User removed from organization",
      })

      await fetchOrganizationUsers()
    } catch (error) {
      console.error('Error removing user:', error)
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRole = async (userId: string, newRole: 'administrator' | 'reception' | 'registered_nurse' | 'caregiver' | 'owner' | 'admin' | 'staff') => {
    try {
      const { error } = await supabase
        .from('organization_users')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Success",
        description: "User role updated successfully",
      })

      await fetchOrganizationUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Organization Users</span>
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invite User to {organizationName}</DialogTitle>
                <DialogDescription>
                  Invite a new user to join this organization
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      value={newUser.first_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, first_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      value={newUser.last_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, last_name: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteUser} disabled={loading}>
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription>
          Manage users and their roles within {organizationName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Confirmed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{getUserDisplayName(user)}</div>
                        <div className="text-sm text-muted-foreground">{user.profiles?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.is_confirmed ? "default" : "secondary"}>
                        {user.is_confirmed ? "Confirmed" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.invited_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.confirmed_at ? new Date(user.confirmed_at).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!user.is_confirmed && (
                            <DropdownMenuItem onClick={() => handleConfirmUser(user.id)}>
                              <Check className="mr-2 h-4 w-4" />
                              Confirm User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, user.role === 'staff' ? 'admin' : 'staff')}>
                            <Users className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-destructive"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}