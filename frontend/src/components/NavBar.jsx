import React, { useState, useContext, useEffect, use } from "react";
import { useNavigate } from "react-router";
import LogInForm from "@/components/auth/LogInForm";
import SignupForm from "./auth/SignupForm";
import VerifyOtp from "./auth/VerifyOtp";
import { AuthContext } from "@/contexts/AuthContext";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowRight,
  Bell,
  Heart,
  HelpCircle,
  LogOutIcon,
  MessageSquare,
  Plane,
  Settings,
  UserCircle,
  UserIcon,
} from "lucide-react";
import { Spinner } from "./ui/spinner";
import toast from "react-hot-toast";
import ForgotPassword from "./auth/forgotPassword";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, user, cancelSignup, loading } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState("signup");

  useEffect(() => {
    if (!user) {
      setIsDialogOpen(false);
      setForm("signup");
    }
  }, [user]);

  const handleDialogChange = (isOpen) => {
    if (!isOpen) {
      setIsDialogOpen(false);
      setForm("login");
      return;
    }
    setIsDialogOpen(isOpen);
  };

  const handleCloseClick = () => {
    setIsDialogOpen(false);
    setForm("login");
  };

  const handleCancelSignup = () => {
    cancelSignup();
    setIsDialogOpen(false);
    setForm("signup");
    toast.success("Signup cancelled.");
    navigate("/");
  };

  const handleOpenSignup = () => setForm("signup");
  const handleOpenLogin = () => setForm("login");
  const handleOpenVerify = () => setForm("verify");
  const handleOpenForgotPassword = () => setForm("forgotPassword");

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const renderForm = () => {
    switch (form) {
      case "login":
        return (
          <LogInForm
            onSignupClick={handleOpenSignup}
            onCloseClick={handleCloseClick}
            onForgotPasswordClick={handleOpenForgotPassword}
          />
        );
      case "signup":
        return (
          <SignupForm
            onLoginClick={handleOpenLogin}
            setVerifyOpen={handleOpenVerify}
            onCloseClick={handleCloseClick}
            onGoogleLogin={user}
          />
        );
      case "verify":
        return <VerifyOtp onCloseClick={handleCancelSignup} />;
      case "forgotPassword":
        return (
          <ForgotPassword
            onCloseClick={handleCloseClick}
            onSignupClick={handleOpenSignup}
            onLoginClick={handleOpenLogin}
            onSuccessResetPassword={handleOpenLogin}
          />
        );
      default:
        break;
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner
          className={"size- fixed top-0 bottom-0 left-0 right-0 m-auto"}
        />
      ) : (
        <div className="w-full flex justify-between items-center p-6 border-b bg-secondary">
          <div className="font-bold text-lg">Logo</div>
          {!user ? (
            //No user / user logged out
            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button size={"lg"} className="font-bold">
                  Rent Now
                  <ArrowRight />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-transparent shadow-none border-none p-0 [&>button]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
              >
                {/* For screen readers */}
                <DialogHeader className={"sr-only"}>
                  <DialogTitle>
                    {form === "login" ? "Login Form" : "Signup Form"}
                  </DialogTitle>
                  <DialogDescription>
                    {form === "login" ? "Login Form" : "Signup Form"}
                  </DialogDescription>
                </DialogHeader>
                {renderForm()}
              </DialogContent>
            </Dialog>
          ) : (
            //User Logged In
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className={"cursor-pointer shadow-md"}>
                  <AvatarImage />
                  <AvatarFallback className={"text-primary"}>
                    <UserIcon />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={"w-2xs"} align="start">
                <DropdownMenuItem>
                  <UserCircle />
                  Profile
                </DropdownMenuItem>
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
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOutIcon />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
