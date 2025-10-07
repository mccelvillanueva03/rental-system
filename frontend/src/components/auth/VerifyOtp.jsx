import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
//shadcn components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import { InputOTP } from "../ui/input-otp";

const VerifyOtp = ({ onCloseClick, onSuccessSignup }) => {
  const { verifyOtp, resendOTP } = useContext(AuthContext);
  const length = 6;
  const [pendingEmail, setPendingEmail] = useState(null);
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const navigate = useNavigate();
  // Focus first empty on mount and get email from localStorage
  useEffect(() => {
    inputRefs.current[0]?.focus();
    const email = localStorage.getItem("pendingEmail");
    setPendingEmail(email);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await verifyOtp(otp);
    if (!success) return;
    // Clear state and localStorage
    localStorage.removeItem("pendingEmail");
    setOtp(Array(length).fill(""));
    onSuccessSignup();
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className={cn("p-5 m-auto w-md")}>
        <AlertDialog>
          <div className="flex w-full justify-end">
            <AlertDialogTrigger asChild>
              <Button size={"icon"} variant={"ghost"}>
                <X />
              </Button>
            </AlertDialogTrigger>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to cancel?
              </AlertDialogTitle>
              <AlertDialogDescription>
                If you leave now, your sign-up progress will be lost. You can
                continue with your registration or cancel and start over.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onCloseClick}>Yes</AlertDialogCancel>
              <AlertDialogAction>No</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardHeader>
          <CardTitle className={cn("text-center")}>
            Email Verification
          </CardTitle>
          <CardDescription className={cn("text-center")}>
            Verification code already sent to <br />
            {`"${pendingEmail}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputOTP
              length={6}
              onChange={(otp) => setOtp(otp)}
              onComplete={(code) => setOtp(code)}
            />
            <div className="grid gap-3">
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
          <div className="pt-2 text-sm">
            Did not receive the code?{" "}
            <Button onClick={resendOTP} variant={"link"}>
              Resend
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
