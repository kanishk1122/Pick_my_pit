import React, { useEffect, useState } from "react";
import { useUser } from "../../utils/Usercontext";
import { useNavigate } from "react-router-dom";
import Custominputfields from "../Custominputfields";
import Sidebar from './Sidebar.jsx'
import ProfilePage from "./ProfilePage.jsx"

const index = () => {
  

  return (
    <div className="min-h-[100vh] flex bg-white rounded-t-[30px]  mt-20 gap-2 border-t-2 border-black">
      <div className="w-[20%] border-r border-black mt-10 ">
        <Sidebar/>
      </div>
      <ProfilePage />
    </div>
  );
};

export default index;
