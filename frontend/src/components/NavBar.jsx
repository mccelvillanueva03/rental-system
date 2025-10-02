import React, { useState } from "react";

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

const NavBar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState("login"); // 'login' or 'signup'

  const handleOpenSignup = () => setForm("signup");
  const handleOpenLogin = () => setForm("login");

  return (
    <div className="w-full flex justify-between items-center p-6 border-b bg-secondary">
      <div className="font-bold text-lg">Logo</div>
      {!user ? (
        //No user
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size={"lg"} className="font-bold">
              Rent Now
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
            <Button variant={"ghost"}>Account</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={"w-xs"} align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                New Team
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default NavBar;
