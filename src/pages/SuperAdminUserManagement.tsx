import { useState, useEffect } from "react"
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Plus, Search, Users, UserCheck, UserX, Shield, Key, LogIn, UserPlus } from "lucide-react"

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  email_confirmed_at: string | null
  profiles: {
    first_name: string | null
    last_name: string | null
    phone: string | null
  } | null
  user_roles: {
    role: string
  }[]
  organizations: {
    company_name: string
  }[]
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  superAdmins: number
}

export default function SuperAdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    superAdmins: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "caregiver"
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Fetch all profiles with user roles for super admin view
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch user roles for each user
      const userIds = profilesData?.map(p => p.id) || [];
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (rolesError) throw rolesError;

      // Transform to user format
      const transformedUsers: User[] = (profilesData || []).map(profile => {
        const userRoles = rolesData?.filter(r => r.user_id === profile.id) || [];
        return {
          id: profile.id,
          email: profile.email || '',
          created_at: profile.created_at,
          last_sign_in_at: null,
          email_confirmed_at: new Date().toISOString(),
          profiles: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone
          },
          user_roles: userRoles.map(r => ({ role: r.role })),
          organizations: [{ company_name: 'System User' }]
        };
      });

      setUsers(transformedUsers);
      calculateStats(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: User[]) => {
    const totalUsers = data.length
    const activeUsers = data.filter(user => user.last_sign_in_at).length
    const superAdmins = data.filter(user => 
      user.user_roles.some(role => role.role === 'administrator')
    ).length

    setStats({
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      superAdmins
    })
  }

  const filteredUsers = users.filter(user => {
    const fullName = `${user.profiles?.first_name || ''} ${user.profiles?.last_name || ''}`.trim()
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fullName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const userRole = user.user_roles[0]?.role || 'none'
    const matchesRole = roleFilter === "all" || userRole === roleFilter
    
    return matchesSearch && matchesRole
  })

  const getUserDisplayName = (user: User) => {
    if (user.profiles?.first_name || user.profiles?.last_name) {
      return `${user.profiles.first_name || ''} ${user.profiles.last_name || ''}`.trim()
    }
    return user.email
  }

  const getUserRole = (user: User) => {
    return user.user_roles[0]?.role || 'No Role'
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'administrator': return 'destructive'
      case 'registered_nurse': return 'default'
      case 'caregiver': return 'secondary'
      default: return 'outline'
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeactivateUser = async (userId: string) => {
    toast({
      title: "Deactivate User",
      description: `Deactivating user ${userId}`
    })
  }

  const handleAddStaff = async () => {
    if (!newStaff.first_name.trim() || !newStaff.last_name.trim() || !newStaff.email.trim()) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + "Aa1!";

      // Create the user account via the password-reset edge function
      const { data: authData, error: authError } = await supabase.functions.invoke('password-reset', {
        body: {
          action: 'create-staff-user',
          email: newStaff.email,
          password: tempPassword,
          firstName: newStaff.first_name,
          lastName: newStaff.last_name,
          role: newStaff.role,
          phone: newStaff.phone
        }
      });

      if (authError) throw authError;

      toast({
        title: "Success",
        description: `Staff member added successfully. Temporary password: ${tempPassword}`,
      });

      setNewStaff({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "caregiver"
      });
      setIsAddDialogOpen(false);
      await fetchUsers();
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: "Failed to add staff member.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('password-reset', {
        body: {
          action: 'admin-reset-password',
          userId: userId
        }
      });

      if (error) throw error;

      toast({
        title: "Password Reset Successful",
        description: `Temporary password: ${data.temporaryPassword}`,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive"
      });
    }
  }

  const handleMasqueradeUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('masquerade', {
        body: {
          action: 'start',
          targetUserId: userId
        }
      });

      if (error) throw error;

      // Open masquerade session in new tab
      if (data.loginUrl) {
        window.open(data.loginUrl, '_blank');
        toast({
          title: "Masquerade Started",
          description: "Login link opened in new tab"
        });
      }
    } catch (error) {
      console.error('Error starting masquerade:', error);
      toast({
        title: "Error",
        description: "Failed to start masquerade session",
        variant: "destructive"
      });
    }
  }

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: `Deleting user ${userId}`
    })
  }

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across all organizations and their permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Across all organizations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Recently signed in</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
              <p className="text-xs text-muted-foreground">Need activation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.superAdmins}</div>
              <p className="text-xs text-muted-foreground">System administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage all system users</CardDescription>
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
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="registered_nurse">Registered Nurse</SelectItem>
                    <SelectItem value="caregiver">Caregiver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                      Create a new staff member and user account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">First Name *</Label>
                        <Input
                          id="first_name"
                          value={newStaff.first_name}
                          onChange={(e) => setNewStaff(prev => ({ ...prev, first_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Last Name *</Label>
                        <Input
                          id="last_name"
                          value={newStaff.last_name}
                          onChange={(e) => setNewStaff(prev => ({ ...prev, last_name: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newStaff.phone}
                        onChange={(e) => setNewStaff(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={newStaff.role} onValueChange={(value) => setNewStaff(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                  <SelectItem value="registered_nurse">Registered Nurse</SelectItem>
                  <SelectItem value="caregiver">Caregiver</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStaff} disabled={loading}>
                      Add Staff Member
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getUserDisplayName(user)}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(getUserRole(user))}>
                          {getUserRole(user)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.organizations?.[0]?.company_name || 'No Organization'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                          {user.email_confirmed_at ? "Active" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user.id)}>
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMasqueradeUser(user.id)}>
                              <LogIn className="w-4 h-4 mr-2" />
                              Login as User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeactivateUser(user.id)}>
                              <UserX className="w-4 h-4 mr-2" />
                              Deactivate User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive"
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={selectedUser.email} disabled />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={selectedUser.profiles?.first_name || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={selectedUser.profiles?.last_name || ''} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={getUserRole(selectedUser)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="registered_nurse">Registered Nurse</SelectItem>
                      <SelectItem value="caregiver">Caregiver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsEditDialogOpen(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayout>
  )
}