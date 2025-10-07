import React, { useRef, useState, useContext } from "react";
import toast from "react-hot-toast";
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
import { X } from "lucide-react";
import { AuthContext } from "@/contexts/AuthContext";

const SignupForm = ({ onLoginClick, setVerifyOpen, onCloseClick }) => {
  const navigate = useNavigate();
  const { googleLogin, signup } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const inputEmailRef = useRef(null);
  const inputPasswordRef = useRef(null);
  const inputFirstNameRef = useRef(null);
  const inputLastNameRef = useRef(null);

  const focus = (inputRef) => {
    inputRef.current?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !firstName || !lastName) {
      toast.error("All fields required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      //simple email validation
      toast.error("Invalid email address.");
      focus(inputEmailRef);
      return;
    }
    if (password.length < 6) {
      //minimum password length 6
      toast.error("Password must be at least 6 characters.");
      focus(inputPasswordRef);
      return;
    }
    if (firstName.length < 2 || lastName.length < 2) {
      toast.error("Names must be at least 2 characters.");
      focus(firstName.length < 2 ? inputFirstNameRef : inputLastNameRef);
      return;
    }
    if (!/^[a-zA-Z]+$/.test(firstName) || firstName.length > 20) {
      focus(inputFirstNameRef);
      toast.error("Invalid name First name.");
      return;
    }
    if (!/^[a-zA-Z]+$/.test(lastName) || lastName.length > 20) {
      focus(inputLastNameRef);
      toast.error("Invalid name Last name.");
      return;
    }
    //call signup from context and open verify otp dialog on success 
    signup(email, password, firstName, lastName);
    localStorage.setItem("pendingEmail", email);

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setVerifyOpen();
    navigate("/");
  };

  return (
    <div>
      <div className="flex flex-col gap-6">
        <Card className="p-5 m-auto max-w-md w-full min-w-xs">
          <div className="flex w-full justify-end">
            <Button size={"icon"} variant={"ghost"} onClick={onCloseClick}>
              <X />
            </Button>
          </div>
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
                  autoFocus
                  ref={inputEmailRef}
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
                  ref={inputPasswordRef}
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
                  <Label htmlFor="full-name">First Name</Label>
                </div>
                <Input
                  ref={inputFirstNameRef}
                  id="first-name"
                  name="first-name"
                  type="text"
                  placeholder="eg. Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="last-name">Last Name</Label>
                </div>
                <Input
                  ref={inputLastNameRef}
                  id="last-name"
                  name="last-name"
                  type="text"
                  placeholder="eg. Dela Cruz"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-3 items-center">
                <Button
                  type="submit"
                  className={cn("w-full")}
                  onClick={handleSubmit}
                >
                  Sign Up
                </Button>
                <p className="text-sm text-gray-500">or</p>
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
            </form>
            <div className="pt-5 text-sm text-center">
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
