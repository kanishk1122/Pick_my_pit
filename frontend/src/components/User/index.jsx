import React from "react";
import Sidebar from "./Sidebar.jsx";
import Profileroutes from "./Profileroutes.jsx"; // Nested routes
import ReferralLink from "./ReferralLink.jsx";

const Index = () => {
  const userId = "user-id-from-context-or-props"; // Replace with actual user ID

  return (
    <div className="h-fit flex -mb-6 bg-white rounded-t-[30px] mt-20 gap-2 border-y-2  border-black">
      {/* Sidebar */}
      <div className="w-[20%]  min-w-[270px] border-r border-black mt-10">
        <Sidebar />
      </div>

      {/* Main Content: Nested Routes */}
      <div className="w-[80%] p-5">
        <Profileroutes />
        
      </div>
    </div>
  );
};

export default Index;
