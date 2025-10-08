import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { cn } from "@/lib/utils.js";
import { AuthContext } from "../../contexts/AuthContext.jsx";

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
import { X } from "lucide-react";

const LogInForm = ({ onSignupClick, onCloseClick, onForgotPasswordClick }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, googleLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
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
                autoFocus
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
                <Button
                  variant="link"
                  size="sm"
                  onClick={onForgotPasswordClick}
                  className="inline-block ml-auto text-sm text-muted-foreground p-0"
                >
                  Forgot your password?
                </Button>
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
                  onSuccess={(credentialResponse) => {
                    googleLogin(credentialResponse);
                    navigate("/");
                  }}
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
