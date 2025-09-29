import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        {console.log(
          "Origin check:",
          window.location.origin,
          import.meta.env.VITE_GOOGLE_CLIENT_ID
        )}
        ;
        <App />
        <Toaster />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
