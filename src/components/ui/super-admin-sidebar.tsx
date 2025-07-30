import { useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Crown,
  Building2,
  CreditCard,
  Mail,
  Shield,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useUserProfile } from "@/hooks/useUserProfile"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const { state } = useSidebar()
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getDisplayName } = useUserProfile()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const handleSignOut = async () => {
    await signOut()
  }

  const handleBackToMain = () => {
    navigate('/dashboard')
  }

  const isActive = (path: string) => {
    if (path === "/super-admin" && currentPath === "/super-admin") return true
    if (path !== "/super-admin" && currentPath.startsWith(path)) return true
    return false
  }

  const getNavCls = (path: string) => {
    const baseClasses = "transition-all duration-200 hover:bg-primary/10 hover:text-primary"
    return isActive(path) 
      ? `${baseClasses} bg-primary/15 text-primary font-medium border-r-2 border-primary` 
      : baseClasses
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-foreground">Super Admin</h2>
                <p className="text-xs text-muted-foreground">System Management Portal</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleBackToMain}
              className="mt-3 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              ← Back to Main App
            </button>
          )}
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : "text-muted-foreground text-xs uppercase tracking-wider mb-2"}>
            Super Admin Navigation
          </SidebarGroupLabel>

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
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Section */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{getDisplayName()}</p>
                    <p className="text-xs text-muted-foreground">Super Administrator</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleBackToMain}>
                  <User className="mr-2 h-4 w-4" />
                  Back to Main App
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