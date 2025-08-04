import { useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  UserCheck,
  Activity,
  UserPlus,
  ChevronDown,
  Heart,
  Clock,
  User,
  LogOut,
  Crown,
  DollarSign,
  CreditCard,
  TrendingUp,
  Bed,
  Package,
} from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useUserProfile } from "@/hooks/useUserProfile"
import { useUserRole } from "@/hooks/useUserRole"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { 
    title: "Patients", 
    url: "/patients", 
    icon: Users,
    submenu: [
      { title: "Patient Registration", url: "/patient-registration", icon: UserPlus },
      { title: "Medical Records", url: "/medical-records", icon: FileText },
      { title: "Admissions", url: "/admissions", icon: Bed },
      { title: "Package Management", url: "/package-management", icon: Package },
    ]
  },
  
  { title: "Appointments", url: "/schedule", icon: Calendar },
  { 
    title: "Timesheets", 
    url: "/timesheets", 
    icon: Clock,
    submenu: [
      { title: "Submit Timesheet", url: "/digital-timesheet", icon: FileText },
    ]
  },
  { 
    title: "Billing & Finance", 
    url: "/billing", 
    icon: DollarSign,
    submenu: [
      { title: "Invoices", url: "/billing", icon: FileText },
      { title: "Payments", url: "/payments", icon: CreditCard },
      { title: "Financial Reports", url: "/financial-reports", icon: TrendingUp },
    ]
  },

  { 
  title: "Assessments", 
  url: "/assessments", 
  icon: FileText,
  submenu: [
    { title: "Skin Assessments", url: "/skin-assessment", icon: FileText },
    { title: "Patient Assessments", url: "/patient-assessment", icon: UserCheck },
  ]
},
  { 
  title: "Reports", 
  url: "/reports", 
  icon: Activity,
  submenu: [
    { title: "Patient Reports", url: "/patient-reports", icon: FileText },
    { title: "Assessment Reports", url: "/assessment-reports", icon: FileText },
    { title: "Staff Reports", url: "/patient-reports", icon: FileText },
    { title: "Timesheet Reports", url: "/timesheet-reports", icon: FileText }
  ]
},
  { title: "Settings", url: "/settings", icon: Settings },
  
]

export function AppSidebar() {
  const { state } = useSidebar()
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getDisplayName } = useUserProfile()
  const { userRole } = useUserRole()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    await signOut()
  }

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile page is under development"
    })
  }

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true
    if (path !== "/" && currentPath.startsWith(path)) return true
    return false
  }

  const getNavCls = (path: string) => {
    const baseClasses = "transition-all duration-200 hover:bg-primary/10 hover:text-primary"
    return isActive(path) 
      ? `${baseClasses} bg-primary/15 text-primary font-medium border-r-2 border-primary` 
      : baseClasses
  }

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-foreground">CareSync</h2>
                <p className="text-xs text-muted-foreground">Patient Care Management</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "text-muted-foreground text-xs uppercase tracking-wider mb-2"}>
            Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.submenu ? (
                    <Collapsible defaultOpen={item.submenu.some(sub => isActive(sub.url))}>
                      <div className="flex items-center">
                        <SidebarMenuButton asChild className="flex-1">
                          <NavLink 
                            to={item.url}
                            className={getNavCls(item.url)}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span className="ml-3">{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                        {!isCollapsed && (
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton size="sm" className="w-8 h-8 p-0">
                              <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                        )}
                      </div>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.submenu.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <NavLink 
                                  to={subItem.url}
                                  className={getNavCls(subItem.url)}
                                >
                                  <subItem.icon className="w-4 h-4 flex-shrink-0" />
                                  {!isCollapsed && <span className="ml-3">{subItem.title}</span>}
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/"}
                        className={getNavCls(item.url)}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="ml-3">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Super Admin Portal Link - Only visible to super admin users */}
        {userRole === 'administrator' && (
          <SidebarGroup className="px-2 py-2">
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to="/super-admin" 
                      className="transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 text-purple-600 border border-purple-200 rounded-md"
                    >
                      <Crown className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3 font-medium">Super Admin Portal</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Section */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors">
                  <div className="w-8 h-8 bg-gradient-teal rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">Staff Member</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
