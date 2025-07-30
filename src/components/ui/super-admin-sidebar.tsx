import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useToast } from "@/hooks/use-toast"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Building2,
  CreditCard,
  Crown,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Shield,
  Users,
  ArrowLeft,
  ChevronDown,
} from "lucide-react"

// Navigation items configuration
const superAdminNavigationItems = [
  { title: "Dashboard", url: "/super-admin", icon: LayoutDashboard },
  { title: "Clients (Tenants)", url: "/super-admin/clients", icon: Building2 },
  { title: "Subscriptions", url: "/super-admin/subscriptions", icon: CreditCard },
  { title: "User Management", url: "/super-admin/users", icon: Users },
  { title: "System Settings", url: "/super-admin/settings", icon: Settings },
  { title: "Security & Permissions", url: "/super-admin/security", icon: Shield },
  { title: "Communication", url: "/super-admin/communication", icon: Mail },
]

export function SuperAdminSidebar() {
  console.log('SuperAdminSidebar rendering')
  
  const { state } = useSidebar()
  const { signOut } = useAuth()
  const { getDisplayName } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth')
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of the super admin portal"
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      })
    }
  }

  const handleBackToMain = () => {
    navigate('/dashboard')
  }

  // Helper to determine if a nav item is active
  const isActive = (path: string) => {
    if (path === "/super-admin") {
      return location.pathname === "/super-admin"
    }
    return location.pathname.startsWith(path)
  }

  // Helper to get nav item classes
  const getNavCls = (path: string) => {
    const baseClasses = "flex items-center w-full px-3 py-2 text-sm rounded-md transition-all duration-200"
    if (isActive(path)) {
      return `${baseClasses} bg-purple-100 text-purple-900 font-medium border-l-4 border-purple-600`
    }
    return `${baseClasses} text-muted-foreground hover:bg-muted hover:text-foreground`
  }

  return (
    <Sidebar variant="sidebar" className="border-r bg-background" collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm text-foreground">Super Admin</span>
              <span className="text-xs text-muted-foreground">Portal</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {superAdminNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/super-admin"}
                      className={getNavCls(item.url)}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3 truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 h-auto py-2">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                      {getDisplayName().split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="top">
              <DropdownMenuItem onClick={handleBackToMain}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main App
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBackToMain}
              className="w-8 h-8"
              title="Back to Main App"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              className="w-8 h-8 text-destructive hover:text-destructive"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}