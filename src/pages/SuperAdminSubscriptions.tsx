import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SuperAdminLayout } from "@/components/layouts/SuperAdminLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { MoreHorizontal, Plus, Search, DollarSign, Users, TrendingUp, Calendar } from "lucide-react"

interface Subscription {
  id: string
  organization_id: string
  package_id?: string
  status: string
  billing_cycle: string
  amount: number
  starts_at: string
  ends_at: string | null
  organizations?: {
    company_name: string
    email?: string
  }
}

interface SubscriptionStats {
  totalRevenue: number
  activeSubscriptions: number
  expiredSubscriptions: number
  monthlyGrowth: number
}

export default function SuperAdminSubscriptions() {
  const navigate = useNavigate()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState<SubscriptionStats>({
    totalRevenue: 0,
    activeSubscriptions: 0,
    expiredSubscriptions: 0,
    monthlyGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          organizations (company_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setSubscriptions((data || []) as any)
      calculateStats((data || []) as any)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch subscriptions",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: Subscription[]) => {
    const activeSubscriptions = data.filter(sub => sub.status === 'active').length
    const expiredSubscriptions = data.filter(sub => sub.status === 'expired' || sub.status === 'canceled').length
    const totalRevenue = data
      .filter(sub => sub.status === 'active')
      .reduce((sum, sub) => sum + Number(sub.amount), 0)

    setStats({
      totalRevenue,
      activeSubscriptions,
      expiredSubscriptions,
      monthlyGrowth: 12.5 // Mock value - would calculate from historical data
    })
  }

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const companyName = subscription.organizations?.company_name || ''
    const email = subscription.organizations?.email || ''
    const matchesSearch = 
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'expired': return 'destructive'
      case 'canceled': return 'secondary'
      case 'trial': return 'outline'
      default: return 'secondary'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleViewDetails = async (subscriptionId: string) => {
    // Implement view details functionality
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', subscriptionId)
        .single()
      
      if (error) throw error
      
      toast({
        title: "Subscription Details",
        description: `Subscription for ${data.billing_cycle} billing`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch subscription details",
        variant: "destructive"
      })
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Subscription canceled successfully"
      })
      
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive"
      })
    }
  }

  const handleExtendSubscription = async (subscriptionId: string) => {
    try {
      // Add 30 days to the end date
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('ends_at')
        .eq('id', subscriptionId)
        .single()
      
      if (!subscription) throw new Error('Subscription not found')
      
      const currentEndDate = new Date(subscription.ends_at || new Date())
      const newEndDate = new Date(currentEndDate.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          ends_at: newEndDate.toISOString(),
          status: 'active'
        })
        .eq('id', subscriptionId)
      
      if (error) throw error
      
      toast({
        title: "Success",
        description: "Subscription extended by 30 days"
      })
      
      fetchSubscriptions() // Refresh the list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to extend subscription",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading subscriptions...</div>
        </div>
      </SuperAdminLayout>
    )
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all organization subscriptions and billing
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Currently paying</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired/Canceled</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.expiredSubscriptions}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>Manage all organization subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by company or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => navigate('/super-admin/subscriptions/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Subscription
              </Button>
            </div>

            {/* Subscriptions Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subscription.organizations?.company_name || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">{subscription.organizations?.email || '-'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">Active Plan</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(subscription.status)}>
                          {subscription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{subscription.billing_cycle}</TableCell>
                      <TableCell>{formatCurrency(Number(subscription.amount))}</TableCell>
                      <TableCell>{new Date(subscription.starts_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {subscription.ends_at ? new Date(subscription.ends_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(subscription.id)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleExtendSubscription(subscription.id)}>
                              Extend Subscription
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="text-destructive"
                            >
                              Cancel Subscription
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
      </div>
    </SuperAdminLayout>
  )
}