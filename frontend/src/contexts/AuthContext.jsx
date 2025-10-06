import React, { createContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import apiAuth from "../api/apiAuth";
import apiPublic from "@/api/apiPublic";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //   useLayoutEffect(() => {
  //     setupInterceptors({ accessToken, setAccessToken, logout });
  //   }, [accessToken]);

  //Restore session on page load before render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiAuth.post(
          "/auth/refreshToken",
          {},
          { withCredentials: true }
        );
        const { accessToken, user } = res.data;
        localStorage.setItem("user", JSON.stringify(user));
        setAccessToken(accessToken);
        setUser(user);
      } catch (error) {
        setUser(null);
        switch (error?.response?.status) {
          case 401:
            console.log("No session. Please login.");
            return;
          case 404:
            console.log("Error: User not found. Please login again");
            return;
          case 403:
            console.log("Error: Token expired or invalid. Please login again.");
            return;
          default:
            console.log("Server Error: Refresh token");
        }
      } finally {
        setLoading(false);
      }
    };
    if (!user || !accessToken) fetchUser();
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(localUser);
    }
  }, [user]);

  //Login
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const res = await apiAuth.post(
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
      if (error.response.status === 429) {
        toast.error("Too many login attempts. Please try again later.");
        return;
      }
      toast.error("Incorrect Email or Password.");
    } finally {
      setLoading(false);
    }
  };

  //google login
  async function googleLogin(credentialResponse) {
    try {
      if (!credentialResponse?.credential) {
        toast.error("Missing Google credential");
        return;
      }
      const res = await apiPublic.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      setAccessToken(res.data.accessToken);
      toast.success("Login Success using Google");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed.");
      return;
    }
  }

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
      toast.error("Logout failed. Please try again.");
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
      toast.error("Signup cancelled.");
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (otp) => {
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
          return;
        case 401:
          toast.error("Invalid code. Please try again.");
          return;
        case 409:
          toast.error("Email already verified. Please login.");
          return;
        case 404:
          toast.error("Signup Again. Email not found.");
          return;
        default:
          toast.error("Server error signing up. Please try again.");
      }
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    googleLogin,
    login,
    logout,
    signup,
    cancelSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
