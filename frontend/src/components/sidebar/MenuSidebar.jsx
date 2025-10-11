import React, { useContext } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  BellIcon,
  HeartIcon,
  HelpCircleIcon,
  HomeIcon,
  User,
  UserCogIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { AuthContext } from "@/contexts/AuthContext";

const MenuSidebar = ({ onProfileClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Sidebar collapsible="icon" className={"mt-20"}>
        <SidebarHeader className={"inset-shadow-2xs"}>
          <SidebarMenuButton
            onClick={onProfileClick}
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer "
          >
            <Avatar className={"shadow-md"}>
              <AvatarImage />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">{`${user?.firstName} ${user?.lastName}`}</p>
          </SidebarMenuButton>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Manage Profile</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem key={"Notifications"}>
                  <SidebarMenuButton className={"cursor-pointer"}>
                    <BellIcon />
                    Notifications
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key={"Past Rent"}>
                  <SidebarMenuButton className={"cursor-pointer"}>
                    <HomeIcon />
                    Past Rent
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key={"Saved Homes"}>
                  <SidebarMenuButton className={"cursor-pointer"}>
                    <HeartIcon />
                    Saved Homes
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key={"Messages"}>
                  <SidebarMenuButton className={"cursor-pointer"}>
                    <UserCogIcon />
                    Messages
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Settings & Privacy</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem key={"Account Settings"}>
                  <SidebarMenuButton className={"cursor-pointer"}>
                    <UserCogIcon />
                    Account Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key={"Help Center"}>
                  <SidebarMenuButton className={"cursor-pointer"}>
                    <HelpCircleIcon />
                    Help Center
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default MenuSidebar;
