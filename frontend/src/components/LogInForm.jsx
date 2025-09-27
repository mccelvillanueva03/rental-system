import toast from "react-hot-toast";
import React, { useState } from "react";
import api from "../lib/axios.js";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";

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

const LogInForm = () => {
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
      await api.post("/auth/login", { email, password });
      toast.success("Login successful!");
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
      toast.success("Google login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
    }
  }

  function handleGoogleError() {
    toast.error("Google login failed.");
  }

  return (
    <div className={cn("flex flex-col gap-6 ")}>
      <Card className="p-5 m-auto mt-50 w-md">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
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

            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                shape="rectangular"
                size="large"
                text="signin_with"
              />
            </div>

            <div className="pt-2 text-sm text-center">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogInForm;
