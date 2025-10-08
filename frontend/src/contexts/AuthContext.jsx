import React, {
  createContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import toast from "react-hot-toast";
import apiAuth, { authInterceptors, refreshInterceptors } from "../api/apiAuth";
import apiPublic from "@/api/apiPublic";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(JSON.parse(localUser));
    }
    if (localStorage.getItem("pendingEmail")) {
      cancelSignup();
    }
    if (localStorage.getItem("forgotEmail")) {
      localStorage.removeItem("forgotEmail");
    }
    setLoading(false);
  }, []);

  //add access token to headers before each request
  useLayoutEffect(() => {
    authInterceptors({ accessToken });
  }, [accessToken]);

  useLayoutEffect(() => {
    refreshInterceptors({ setUser, setAccessToken, logout });
  }, []);

  //Login
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      //simple email validation
      toast.error("Invalid email address.");
      return;
    }

    try {
      const res = await apiPublic.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { accessToken, user } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      setAccessToken(accessToken);
      setUser(user);

      toast.success("Login successful!");
    } catch (error) {
      if (error?.response?.status === 429) {
        toast.error("Too many login attempts. Please try again later.");
        return;
      }
      if (error?.response?.status === 401) {
        toast.error("Incorrect Email or Password.");
        return;
      }
      toast.error("Server error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, firstName, lastName) => {
    try {
      await apiPublic.post("/auth/signup", {
        email,
        password,
        firstName,
        lastName,
      });
      toast.success("OTP already sent to your email.");
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
      if (status === 401) {
        toast.error("Invalid email address.");
        return;
      }
      console.error("Signup error:", error);
      toast.error("Signing up failed.");
    } finally {
      setLoading(false);
    }
  };

  //google login
  const googleLogin = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Missing Google credential");
        return;
      }
      const res = await apiPublic.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      const { accessToken, user } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      setAccessToken(accessToken);
      setUser(user);

      toast.success("Login Success using Google");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
      return;
    }
  };

  //Logout
  const logout = async () => {
    try {
      await apiAuth.post("/auth/logout", {});

      localStorage.removeItem("user");
      setUser(null);
      setAccessToken(null);
      toast.success("You have been successfully logged out.");
    } catch (error) {
      console.log("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  //Cancel Signup and delete pending user
  const cancelSignup = async () => {
    try {
      const email = localStorage.getItem("pendingEmail");
      if (email) {
        apiPublic.post("/auth/cancel-signup", { email });
      }
      localStorage.removeItem("pendingEmail");
      setUser(null);
      setAccessToken(null);
    } catch {
      localStorage.removeItem("pendingEmail");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    const email = localStorage.getItem("pendingEmail");

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
      setAccessToken(accessToken);
      setUser(user);

      localStorage.removeItem("pendingEmail");
      localStorage.setItem("user", JSON.stringify(user));
      toast.success("Signup Success");
    } catch (error) {
      switch (error?.response?.status) {
        case 429:
          toast.error("Too many requests. Try later.");
          break;
        case 401:
          toast.error("Invalid code. Please try again.");
          break;
        case 409:
          toast.error("Email already verified. Please login.");
          break;
        case 404:
          toast.error("Signup Again. Email not found.");
          break;
        default:
          toast.error("Server error signing up. Please try again.");
          break;
      }
      return false;
    }
  };

  const resendOTP = async () => {
    const email = localStorage.getItem("pendingEmail") || user?.email;

    if (!email) {
      toast.error("No pending signup found. Please signup again.");
      return;
    }

    try {
      await apiPublic.post("/auth/resend-signup-otp", { email });

      toast.success("OTP resent to your email.");
    } catch (error) {
      const status = error?.response?.status;
      if (status === 429) {
        toast.error("Too many requests. Please try again later.");
        return;
      }
      if (status === 404) {
        toast.error("Email not found. Please signup again.");
        return;
      }
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const forgotPassword = async (email) => {
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      //simple email validation
      toast.error("Invalid email address.");
      return;
    }

    try {
      await apiPublic.post("/auth/forgot-password", { email });

      localStorage.setItem("forgotEmail", email);
      toast.success("Reset code sent to your email.");
      return true;
    } catch (error) {
      console.log("Error sending email:", error);
      if (error?.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
        return;
      }
      if (error?.response?.status === 404) {
        toast.error("Email not found. Please sign up.");
        return;
      }
      toast.error("Server Error.");
      return false;
    }
  };

  const resetPassword = async (otp, newPassword, confirmPassword) => {
    const email = localStorage.getItem("forgotEmail");

    if (otp.some((d) => d === "")) {
      toast.error("Complete the 6-digit code.");
      return;
    }
    const code = otp.join("");

    if (!code || !email || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return false;
    }
    try {
      const res = await apiPublic.post("/auth/verify-forgot-password", {
        email,
        otp: code,
        newPassword,
      });
      const { accessToken, user } = res.data;

      localStorage.setItem("user", JSON.stringify(user));
      setAccessToken(accessToken);
      setUser(user);

      localStorage.removeItem("forgotEmail");
      toast.success("Password reset successful!");
      return true;
    } catch (error) {
      switch (error?.response?.status) {
        case 429:
          toast.error("Too many requests. Try later.");
          break;
        case 401:
          toast.error("Invalid code. Please try again.");
          break;
        case 410:
          toast.error("Code expired. Please request again.");
          break;
        case 404:
          toast.error("Email not found.");
          break;
        default:
          toast.error("Server error resetting password. Please try again.");
          break;
      }
      return false;
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    googleLogin,
    login,
    signup,
    logout,
    verifyOtp,
    cancelSignup,
    resendOTP,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
