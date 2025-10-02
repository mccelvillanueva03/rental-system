import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import api from "../lib/axios";
//shadcn components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SignupForm = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error("All fields required.");
      return;
    }
    try {
      await api.post("/auth/signup", { email, password, fullName });
      toast.success("OTP already sent to your email.");
      localStorage.setItem("pendingEmail", email);
      setEmail("");
      setPassword("");
      setFullName("");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 429) {
        toast.error("Too many login attempts. Please try again later.");
        return;
      }
      if (status === 409) {
        toast.error("Email is already in use.");
        return;
      }
      toast.error("Signing up failed.");
    }
  };

  async function handleGoogleSuccess(credentialResponse) {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Missing Google credential");
        return;
      }
      const res = await api.post(
        "/auth/google-login",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      // If still using token in body:
      if (res.data.token) localStorage.setItem("token", res.data.token);
      toast.success("Google login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
    }
  }

  async function handleGoogleError() {
    toast.error("Google Login Failed");
  }

  return (
    <div>
      <div className="flex flex-col gap-6">
        <Card className="p-5 m-auto w-md">
          <CardHeader>
            <CardTitle className={cn("text-center")}>Create account</CardTitle>
            <CardDescription className={cn("text-center")}>
              Email verification code will be sent to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="full-name">Full Name</Label>
                </div>
                <Input
                  id="full-name"
                  name="full-name"
                  type="text"
                  placeholder="eg. Juan Dela Cruz"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 items-center">
                <Button type="submit" className={cn("w-full")}>
                  Sign Up
                </Button>
                <p className="text-sm text-gray-500">or</p>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  shape="rectangular"
                  size="medium"
                  text="signup_with"
                />
              </div>
            </form>
            <div className="pt-2 text-sm text-center">
              Already have an account?
              <Button onClick={onLoginClick} variant="link">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupForm;
