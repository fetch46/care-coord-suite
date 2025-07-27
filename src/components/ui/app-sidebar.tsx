import { useState } from "react"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Bell,
  UserCheck,
  Activity,
  UserPlus,
  ChevronDown,
  Heart
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { 
    title: "Patients", 
    url: "/patients", 
    icon: Users,
    submenu: [
      { title: "Patient Registration", url: "/patient-registration", icon: UserPlus }
    ]
  },
  { title: "Scheduling", url: "/scheduling", icon: Calendar },
  { title: "Staff", url: "/staff", icon: UserCheck },
  { 
    title: "Timesheets", 
    url: "/timesheets", 
    icon: Users,
    submenu: [
      { title: "Digital Timesheet", url: "/digital-timesheet", icon: FileText },
      { title: "Timesheet Reports", url: "/timesheet-reports", icon: Activity }
    ]
  },
  { title: "Assessments", url: "/assessments", icon: FileText },
  { title: "Reports", url: "/reports", icon: Activity },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

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

        {/* User Section */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-teal rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Dr. Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
