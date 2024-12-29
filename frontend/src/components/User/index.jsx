import React from "react";
import Sidebar from './Sidebar.jsx';
import Profileroutes from './Profileroutes.jsx'; // Nested routes

const Index = () => {
  return (
    <div className="h-fit flex -mb-6 bg-white rounded-t-[30px] mt-20 gap-2 border-t-2 border-black">
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
