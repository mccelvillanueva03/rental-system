import React, { useEffect, useState } from "react";

import LogInForm from "@/components/LogInForm";
import SignupForm from "./SignupForm";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  Bell,
  Heart,
  HelpCircle,
  MessageSquare,
  Plane,
  Settings,
  User,
  UserCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [signup, setSignup] = useState("false")
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState("login"); // 'login' or 'signup'

  const handleOpenSignup = () => setForm("signup");
  const handleOpenLogin = () => setForm("login");

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if (!token) {
      setUser(null)
      return
    }
  }, [])

  const handleLogout = () => {
    setUser("null");
    localStorage.removeItem("token");
  };

  return (
    <div className="w-full flex justify-between items-center p-6 border-b bg-secondary">
      <div className="font-bold text-lg">Logo</div>
      {!user ? (
        //No user / user logged out
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"} className="font-bold">
              Rent Now
              <ArrowRight />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-transparent shadow-none border-none p-0">
            <DialogHeader className={"sr-only"}>
              <DialogTitle>
                {form === "login" ? "Login Form" : "Signup Form"}
              </DialogTitle>
              <DialogDescription>
                {form === "login" ? "Login Form" : "Signup Form"}
              </DialogDescription>
            </DialogHeader>
            {form === "login" ? (
              <LogInForm
                onSignupClick={handleOpenSignup}
                onSuccessLogin={setUser}
              />
            ) : (
              <SignupForm onLoginClick={handleOpenLogin} />
            )}
          </DialogContent>
        </Dialog>
      ) : (
        //User Logged In
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Profile</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={"w-2xs"} align="start">
            <DropdownMenuItem>
              <Heart />
              Wishlists
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Plane /> Trips
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare />
              Messages
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserCircle2 />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Bell />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle />
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                variant={"ghost hover:bg-transparent"}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default NavBar;
