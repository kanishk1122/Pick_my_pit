import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import SecurityPage from "./SecurityPage"; // Different component for security
import Setting from "./Setting.jsx"; // Different component for setting

const Profileroutes = () => {
  return (
    <Routes>
      {/* Routes under /user */}
      <Route path="/" element={<ProfilePage />} />
      <Route path="security" element={<SecurityPage />} />
      <Route path="setting" element={<h1>Settings</h1>} />
      <Route path="*" element={<Setting/>} />
    </Routes>
  );
};

export default Profileroutes;
