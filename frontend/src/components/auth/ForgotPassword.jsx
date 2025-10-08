import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { AuthContext } from "@/contexts/AuthContext";
import { Input } from "../ui/input";
import { ArrowLeft, X } from "lucide-react";
import { InputOTP } from "../ui/input-otp";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router";

const ForgotPassword = ({
  onCloseClick,
  onLoginClick,
  onSuccessResetPassword,
}) => {
  const { forgotPassword, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(Array(length).fill(""));

  const handleSendEmail = async (e) => {
    e.preventDefault();

    const success = await forgotPassword(email);
    if (!success) return;
    setIsEmailSubmitted(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const success = await resetPassword(otp, newPassword, confirmPassword);
    if (!success) return;
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp(Array(length).fill(""));
    onSuccessResetPassword();
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-6 ">
      <Card className="p-5 m-auto w-md">
        <div className="flex w-full justify-end">
          <Button size={"icon"} variant={"ghost"} onClick={onCloseClick}>
            <X />
          </Button>
        </div>
        <CardHeader>
          <CardTitle className={"text-center"}>Forgot Password</CardTitle>
          <CardDescription className={"text-center"}>
            Enter email to send reset code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSendEmail}>
            <div className="grid gap-3">
              <Input
                className={"text-center text-3xl h-10"}
                autoFocus
                id="email"
                name="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className={"w-full"}
              type="submit"
              variant={isEmailSubmitted ? "outline" : "default"}
            >
              {isEmailSubmitted ? "Resend Code" : "Send Code"}
            </Button>
          </form>
          {isEmailSubmitted ? (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <Separator className="my-5 bg-muted-foreground/50" />
              <div className=" gap-6 w-full flex justify-center items-center flex-col mb-5">
                <Label htmlFor="otp">Enter Code</Label>
                <InputOTP
                  onChange={(otp) => setOtp(otp)}
                  onComplete={(code) => setOtp(code)}
                />
              </div>
              <div>
                <Input
                  className={"text-center text-3xl h-10"}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-5">
                <Input
                  className={"text-center text-3xl h-10"}
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button className={"w-full"} type="submit" size={"lg"}>
                Submit
              </Button>
            </form>
          ) : (
            <>
              <div className="mt-10 p-0">
                <Button
                  onClick={onLoginClick}
                  variant={"link"}
                  size={"sm"}
                  className={
                    "hover:underline/0 hover:-translate-x-4 -translate-x-3 text-primary"
                  }
                >
                  <ArrowLeft />
                  Back to Login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
