import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import LogInForm from "@/components/auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import VerifyOtp from "../auth/VerifyOtp";
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

import { ArrowRight } from "lucide-react";
import { Spinner } from "../ui/spinner";
import toast from "react-hot-toast";
import ForgotPassword from "../auth/ForgotPassword";
import ProfileDropdown from "./ProfileDropdownMenu";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, cancelSignup, loading } = useContext(AuthContext);
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
    setTimeout(() => {
      setForm("signup");
    }, 500);
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
          className={"size-10 fixed top-0 bottom-0 left-0 right-0 m-auto"}
        />
      ) : (
        <div className="fixed top-0 z-50 flex items-center justify-between w-full h-20 px-10 border-b bg-secondary">
          <div className="text-lg font-bold">Logo</div>
          {!user ? (
            //No user / user logged out
            <div>
              <Button
                className={"mr-5 hover:bg-background"}
                variant={"ghost"}
                size={"lg"}
              >
                I'm a Homeowner
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <Button size={"lg"} className="font-bold">
                    Signup
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
            </div>
          ) : (
            //User Logged In
            <ProfileDropdown />
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
