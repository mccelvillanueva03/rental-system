import React, { useRef, useState, useEffect } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

/**
 * Reusable OTP input component.
 *
 * Props:
 * - length: number → how many input boxes (default 6)
 * - onChange: function(otpArray: string[])
 * - onComplete: function(code: string)
 * - onEmailLoaded: function(email: string) → optional callback when email is retrieved
 * - className: string → optional extra classes for layout
 */
export const InputOTP = ({ length = 6, onChange, onComplete, className }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  // ✅ Focus first input & load email from localStorage on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // 🧭 Move focus left or right
  const moveFocus = (index, dir) => {
    const next = index + dir;
    if (next >= 0 && next < length) inputRefs.current[next]?.focus();
  };

  // 🔢 Handle input changes
  const handleChange = (value, index) => {
    const digit = value.slice(-1);
    if (value === "" || !/^\d$/.test(digit)) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    onChange?.(newOtp);

    // Auto-focus next
    if (index < length - 1) moveFocus(index, 1);

    // Check if full
    const code = newOtp.join("");
    if (code.length === length && !code.includes("")) {
      onComplete?.(code);
    }
  };

  // ⌨️ Handle Backspace, Arrows, direct overwrite
  const handleKeyDown = (e, index) => {
    const key = e.key;
    if (key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
        onChange?.(next);
      } else if (index > 0) {
        moveFocus(index, -1);
      }
      e.preventDefault();
    } else if (key === "ArrowLeft") {
      moveFocus(index, -1);
      e.preventDefault();
    } else if (key === "ArrowRight") {
      moveFocus(index, 1);
      e.preventDefault();
    }
  };

  // 📋 Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!text) return;
    const chars = text.split("");
    const next = Array.from({ length }, (_, i) => chars[i] || "");
    setOtp(next);
    onChange?.(next);

    const code = next.join("");
    if (code.length === length && !code.includes("")) {
      onComplete?.(code);
    }

    const lastIndex = Math.min(chars.length, length) - 1;
    if (lastIndex >= 0) inputRefs.current[lastIndex]?.focus();
  };

  // 🎯 Focus behavior
  const handleFocus = (index) => {
    inputRefs.current[index]?.select();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={cn("flex gap-3 justify-center", className)}>
        {Array.from({ length }, (_, i) => (
          <Input
            key={i}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={otp[i] ?? ""}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(i)}
            ref={(el) => (inputRefs.current[i] = el)}
            className={cn(
              "w-12 h-12 text-center text-lg font-semibold rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
            )}
          />
        ))}
      </div>
    </div>
  );
};
