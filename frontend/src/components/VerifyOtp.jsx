import React, { useState, useRef, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import apiPublic from "@/api/apiPublic";

const VerifyOtp = ({ onCloseClick, onSuccessVerify, onSetLogin, setToken }) => {
  const length = 6;
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [email, setEmail] = useState(null);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("pendingEmail"));
  }, [email]);

  // Focus first empty on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const moveFocus = (index, dir) => {
    const next = index + dir;
    if (next >= 0 && next < length) {
      inputRefs.current[next]?.focus();
    }
  };
  const handleChange = (value, index) => {
    if (value === "") {
      // clearing manually (user selected and hit delete)
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    // Take only the last typed character (handles paste of multi chars into one box)
    const digit = value.slice(-1);
    if (!/^\d$/.test(digit)) return;

    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    // Auto-advance
    if (index < length - 1) {
      moveFocus(index, +1);
    }
  };
  const handleKeyDown = (e, index) => {
    const key = e.key;
    if (key === "Backspace") {
      if (otp[index]) {
        // clear current
        setOtp((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else {
        // go back & clear previous
        if (index > 0) {
          moveFocus(index, -1);
          setOtp((prev) => {
            const next = [...prev];
            next[index - 1] = "";
            return next;
          });
        }
      }
      e.preventDefault();
      return;
    }
    if (key === "ArrowLeft") {
      moveFocus(index, -1);
      e.preventDefault();
      return;
    }
    if (key === "ArrowRight") {
      moveFocus(index, +1);
      e.preventDefault();
      return;
    }
    // Allow direct overwrite by typing a digit (without needing backspace)
    if (/^\d$/.test(key)) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = key;
        return next;
      });
      if (index < length - 1) moveFocus(index, +1);
      e.preventDefault();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!text) return;
    const chars = text.split("");
    setOtp(Array.from({ length }, (_, i) => chars[i] || ""));
    // Focus last filled
    const lastIndex = Math.min(chars.length, length) - 1;
    if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
  };
  const handleFocus = (index) => {
    // Auto-select so a new digit overwrites
    const el = inputRefs.current[index];
    if (el) el.select();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.some((d) => d === "")) {
      toast.error("Complete the 6-digit code.");
      return;
    }
    const code = otp.join("");

    try {
      const res = await apiPublic.post("/auth/verify-signup-email", {
        email,
        otp: code,
      });

      const { accessToken, user } = res.data;
      setToken(accessToken);
      onSuccessVerify(user);

      localStorage.removeItem("pendingEmail");
      setEmail(null);
      setOtp(Array(length).fill(""));

      onSetLogin();
      toast.success("Signup Success");
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 429) {
        toast.error("Too many requests. Try later.");
        return;
      }
      toast.error("Incorrect code");
    }
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
              <AlertDialogCancel onClick={onCloseClick}>Continue</AlertDialogCancel>
              <AlertDialogAction >
                Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <CardHeader>
          <CardTitle className={cn("text-center")}>Enter OTP</CardTitle>
          <CardDescription className={cn("text-center")}>
            Verification code already sent to your email <br />
            {`"${email}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  type="text"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  onFocus={() => handleFocus(index)}
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={cn(
                    "w-12 h-12 text-center text-lg font-semibold rounded-md"
                  )}
                />
              ))}
            </div>
            <div className="grid gap-3">
              <Button type="submit" className="w-full" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
            <div className="pt-2 text-sm">
              Did not receive the code?{" "}
              <a href="" className="underline underline-offset-4 text-primary">
                Resend
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
