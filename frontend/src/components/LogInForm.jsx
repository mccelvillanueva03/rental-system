import toast from "react-hot-toast";
import React, { useState } from "react";
import api from "../lib/axios.js";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { cn } from "@/lib/utils.js";

//shadcn components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LogInForm = ({ onSignupClick, onSuccessLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      toast.success("Login successful!");
      if (res.data.token) localStorage.setItem("token", res.data.token);
      if (res.data.token) {
        onSuccessLogin(res.data.user)
      } 
      navigate("/");
    } catch (error) {
      if (error.response.status === 429) {
        toast.error("Too many login attempts. Please try again later.");
        return;
      }
      toast.error("Incorrect Email or Password.");
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
       if (res.data.token) {
         onSuccessLogin(res.data.user);
       } 
      toast.success("Google Login Success!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
    }
  }

  return (
    <div className="flex flex-col gap-6 ">
      <Card className="p-5 m-auto w-md">
        <CardHeader>
          <CardTitle className={cn("text-center")}>
            Login to your account
          </CardTitle>
          <CardDescription className={cn("text-center")}>
            Enter your email below to login to your account
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
                <a
                  href="#"
                  className="inline-block ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
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

            <div className="flex flex-col gap-3 items-center">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-sm text-gray-500">or</p>
              <div>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  theme="outline"
                  shape="rectangular"
                  size="medium"
                  text="continue_with"
                />
              </div>
            </div>
          </form>
          <div className="pt-5 text-sm text-center">
            Don't have an account?
            <Button onClick={onSignupClick} variant="link">
              Signup
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogInForm;
