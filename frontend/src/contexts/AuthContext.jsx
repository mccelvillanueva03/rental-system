import React, {
  createContext,
  useState,
  useLayoutEffect,
  useEffect,
} from "react";
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
  useLayoutEffect(() => {
    if (user || accessToken) return; // skip if already logged in

    const fetchUser = async () => {
      try {
        const res = await apiAuth.post(
          "/auth/refreshToken",
          {},
          { withCredentials: true }
        );
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return;
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      setUser(localUser);
    }
  }, []);

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
    if (!user && !accessToken) return;
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

  const cancelSignup = async () => {
    try {
      const email = localStorage.getItem("pendingEmail");
      if (email) {
        apiPublic.post("/auth/cancel-signup", { email });
      }
      localStorage.removeItem("pendingEmail");
      toast.error("Signup cancelled.");
    } catch (error) {
      console.error("Error during verification:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    accessToken,
    loading,
    googleLogin,
    login,
    logout,
    cancelSignup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
