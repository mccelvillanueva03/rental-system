import React, { useState, useRef, useEffect } from "react";
//shadcn components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useLocation, useNavigate } from "react-router";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const length = 6;
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);
  
  const storedEmail =
  location.state?.email || localStorage.getItem("pendingEmail");
  
  // Focus first empty on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  //check if there is stored email, else redirect to home
  // if (!storedEmail) {
  //   navigate("/");
  //   return;
  // }
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
      await api.post("/auth/verify-email-otp", {
        email: storedEmail,
        otp: code,
      });
      localStorage.removeItem("pendingEmail");
      toast.success("Email verification success!");
      setOtp(Array(length).fill(""));
      navigate("/");
    } catch (error) {
      if (error?.response?.status === 429) {
        toast.error("Too many requests. Try later.");
        return;
      }
      toast.error("Wrong code");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className={cn("p-5 m-auto mt-50 w-md")}>
        <CardHeader>
          <CardTitle className={cn("text-center")}>Enter OTP</CardTitle>
          <CardDescription className={cn("text-center")}>
            Code already sent to your email.
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
              <Button type="submit" className="w-full">
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
