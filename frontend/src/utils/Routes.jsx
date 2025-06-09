import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Deafultpage from "../components/Deafultpage";
import Navbar from "../components/Navbar";
import Home from "../components/Home.jsx";
import Auth from "../components/auth/Auth.jsx";
import User from "../components/User/index.jsx";
import CreatePost from "../components/CreatePost.jsx";
import PetList from "../components/Pet/PetList.jsx";
import FreePetList from "../components/Pet/FreePetList.jsx";
import PaidPetList from "../components/Pet/PaidPetList.jsx";
import PetViewer from "../components/Pet/PetViewer.jsx";
import FilteredPetList from "../components/Pet/FilteredPetList.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from backend
    async function fetchUser() {
      const response = await axios.get("/api/user");
      setUser(response.data);
    }
    fetchUser();
  }, []);

  const handlePetInfoAccess = async (petId) => {
    if (user.coins >= 10) {
      await axios.post("/api/coins/deduct-coins", {
        userId: user._id,
        amount: 10,
      });
      // Redirect to pet info page
      window.location.href = `/pet/${petId}`;
    } else {
      alert("Not enough coins to access pet info.");
    }
  };

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
              <Route path="/pets" element={<PetList />} />
              <Route path="/pets/filter" element={<FilteredPetList />} />
              <Route
                path="/pet/:id"
                element={<PetViewer onAccess={handlePetInfoAccess} />}
              />
              <Route path="/pets/loving-companions" element={<FreePetList />} />
              <Route path="/pets/companion-pets" element={<PaidPetList />} />
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
