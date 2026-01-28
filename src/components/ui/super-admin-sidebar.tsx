import { useState } from "react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
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
  Package,
  Settings,
  Shield,
  Users,
  ArrowLeft,
  ChevronDown,
  FileText,
  UserPlus,
  ChevronRight,
  Sparkles,
  Activity,
} from "lucide-react"

// Navigation items configuration
const superAdminNavigationItems = [
  { title: "Dashboard", url: "/super-admin", icon: LayoutDashboard, badge: null },
  { 
    title: "Organizations", 
    url: "/super-admin/organizations", 
    icon: Building2,
    badge: null,
    subItems: [
      { title: "All Organizations", url: "/super-admin/organizations", icon: Building2 },
      { title: "New Signups", url: "/super-admin/organization-signups", icon: UserPlus, badge: "3" }
    ]
  },
  { title: "Packages", url: "/super-admin/packages", icon: Package, badge: null },
  { title: "Subscriptions", url: "/super-admin/subscriptions", icon: CreditCard, badge: "2" },
  { title: "User Management", url: "/super-admin/users", icon: Users, badge: null },
  { title: "System Settings", url: "/super-admin/settings", icon: Settings, badge: null },
  { title: "Security", url: "/super-admin/security", icon: Shield, badge: null },
  { title: "Communication", url: "/super-admin/communication", icon: Mail, badge: null },
  { title: "Content Management", url: "/super-admin/cms", icon: FileText, badge: null },
]

export function SuperAdminSidebar() {
  const { state } = useSidebar()
  const { signOut } = useAuth()
  const { getDisplayName } = useUserProfile()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isCollapsed = state === "collapsed"
  const [expandedItems, setExpandedItems] = useState<string[]>(["Organizations"])

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
  const getNavCls = (path: string, isSubItem = false) => {
    const baseClasses = `flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${isSubItem ? 'text-xs' : ''}`
    if (isActive(path)) {
      return `${baseClasses} bg-gradient-to-r from-purple-600 to-purple-500 text-white font-medium shadow-md`
    }
    return `${baseClasses} text-muted-foreground hover:bg-purple-50 hover:text-purple-700`
  }

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <Sidebar variant="sidebar" className="border-r bg-gradient-to-b from-background to-muted/20" collapsible="icon">
      <SidebarHeader className="border-b p-4 bg-gradient-to-r from-purple-600 to-purple-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0 shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-white tracking-tight">Super Admin</span>
              <span className="text-xs text-purple-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Command Center
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Quick Stats - Only show when expanded */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b bg-muted/30">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-green-500 animate-pulse" />
              <span className="text-muted-foreground">System Status:</span>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">
              All Systems Operational
            </Badge>
          </div>
        </div>
      )}

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-muted-foreground text-[11px] uppercase tracking-wider font-semibold mb-3 px-3">
              Navigation
            </SidebarGroupLabel>
          )}
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {superAdminNavigationItems.map((item: any) => (
                <SidebarMenuItem key={item.title}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <SidebarMenuButton asChild>
                        <button 
                          onClick={() => toggleExpanded(item.title)}
                          className={getNavCls(item.url)}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="ml-3 truncate flex-1 text-left">{item.title}</span>
                              <ChevronRight 
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  expandedItems.includes(item.title) ? 'rotate-90' : ''
                                }`} 
                              />
                            </>
                          )}
                        </button>
                      </SidebarMenuButton>
                      {!isCollapsed && expandedItems.includes(item.title) && (
                        <div className="ml-4 pl-4 border-l-2 border-purple-100 space-y-1 animate-fade-in">
                          {item.subItems.map((subItem: any) => (
                            <SidebarMenuButton key={subItem.title} asChild>
                              <NavLink 
                                to={subItem.url}
                                className={getNavCls(subItem.url, true)}
                              >
                                <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                <span className="ml-2 truncate flex-1">{subItem.title}</span>
                                {subItem.badge && (
                                  <Badge className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0">
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </NavLink>
                            </SidebarMenuButton>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/super-admin"}
                        className={getNavCls(item.url)}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3 truncate flex-1">{item.title}</span>
                            {item.badge && (
                              <Badge className="bg-orange-100 text-orange-700 text-[10px] px-1.5 py-0">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3 bg-muted/20">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-2 h-auto py-2.5 hover:bg-purple-50">
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-9 w-9 shrink-0 ring-2 ring-purple-200 ring-offset-2">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
                      {getDisplayName().split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{getDisplayName()}</p>
                    <p className="text-[11px] text-purple-600 font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Super Administrator
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover" side="top">
              <DropdownMenuItem onClick={handleBackToMain} className="cursor-pointer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Main App
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col gap-1 items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleBackToMain}
              className="w-9 h-9 hover:bg-purple-50 hover:text-purple-700"
              title="Back to Main App"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignOut}
              className="w-9 h-9 text-destructive hover:text-destructive hover:bg-red-50"
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
