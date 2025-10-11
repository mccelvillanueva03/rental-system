import React, { useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "@/contexts/AuthContext";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BellIcon,
  HeartIcon,
  HelpCircleIcon,
  HouseIcon,
  LogOutIcon,
  MessagesSquareIcon,
  SettingsIcon,
  UserCircleIcon,
  UserIcon,
} from "lucide-react";

const ProfileDropdownMenu = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const handleMenuClick = (tabName) => {
    navigate("/account", { state: { selectedTab: tabName } });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className={"cursor-pointer shadow-md"}>
            <AvatarImage />
            <AvatarFallback className={"text-background bg-primary"}>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={"w-3xs mr-8"}
          align="start"
          sideOffset={"1"}
        >
          <DropdownMenuItem onClick={() => handleMenuClick("Account")}>
            <UserCircleIcon />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BellIcon />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HouseIcon />
            Past Rent
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HeartIcon />
            Saved Homes
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessagesSquareIcon />
            Messages
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SettingsIcon />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircleIcon />
            Help Center
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropdownMenu;
