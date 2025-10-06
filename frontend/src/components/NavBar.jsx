import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import LogInForm from "@/components/LogInForm";
import SignupForm from "./SignupForm";
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
  UserCircle2,
} from "lucide-react";
import VerifyOtp from "./VerifyOtp";
import { Spinner } from "./ui/spinner";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, user, cancelSignup, loading } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState("signup"); // 'login' or 'signup' or 'verify'

  useEffect(() => {
    if (!user) {
      setOpen(false);
      setForm("signup");
    }
  }, [user]);

  const handleDialogChange = (isOpen) => {
    if (!isOpen) {
      setOpen(false);
      setForm("login");
      return;
    }
    setOpen(isOpen);
  };

  const handleCloseClick = () => {
    setOpen(false);
    setForm("signup");
  };

  const handleCancelSignup = () => {
    cancelSignup();
    setOpen(false);
    setForm("signup");
  };

  const handleOpenSignup = () => setForm("signup");
  const handleOpenLogin = () => setForm("login");
  const handleOpenVerify = () => setForm("verify");
  const handleSuccessVerify = () => setOpen(false);

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
        return (
          <VerifyOtp
            onCloseClick={handleCancelSignup}
            onSetLogin={handleSuccessVerify}
          />
        );
      default:
        break;
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner className={"size- fixed top-0 bottom-0 left-0 right-0 m-auto"} />
      ) : (
        <div className="w-full flex justify-between items-center p-6 border-b bg-secondary">
          <div className="font-bold text-lg">Logo</div>
          {!user ? (
            //No user / user logged out
            <Dialog open={open} onOpenChange={handleDialogChange}>
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
