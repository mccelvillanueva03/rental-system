import React from "react";
import { Routes, Route } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import AccountPage from "./pages/SidebarPages.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </div>
  );
};

export default App;
