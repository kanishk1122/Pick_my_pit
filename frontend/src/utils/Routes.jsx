import { Routes, Route } from "react-router-dom";
import Deafultpage from "../components/Deafultpage";
import Navbar from "../components/Navbar";
import Home from "../components/Home.jsx";
import Auth from "../components/auth/Auth.jsx";
import User from "../components/User/index.jsx";
import CreatePost from "../components/CreatePost.jsx";
import { useState } from "react";


function App() {
  return (
    <Routes>
      {/* Routes with Navbar */}
      <Route
        path="*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route className="mt-20" path="/user/*" element={<User />} />
              <Route path="/create-post" element={<CreatePost />} />
            </Routes>
          </MainLayout>
        }
      />

      {/* Routes without Navbar */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/default" element={<Deafultpage />} />
    </Routes>
  );
}

// Main layout with Navbar
function MainLayout({ children }) {
  return (
    <div className="regular w-[99.3vw]">
      <span className="!fixed top-5 z-[9999]">
        <Navbar />
      </span>
      <div className="mt-20">{children}</div>
    </div>
  );
}

export default App;
