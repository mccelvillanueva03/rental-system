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
      localStorage.setItem("pendingEmail", email);
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
      return toast.error("Complete the 6-digit code.");
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
          return toast.error("Too many requests. Try later.");
        case 401:
          return toast.error("Invalid code. Please try again.");
        case 409:
          return toast.error("Email already verified. Please login.");
        case 404:
          return toast.error("Signup Again. Email not found.");
        default:
          toast.error("Server error signing up. Please try again.");
          return;
      }
    }
  };

  const resendOTP = async () => {
    const email = localStorage.getItem("pendingEmail");

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
