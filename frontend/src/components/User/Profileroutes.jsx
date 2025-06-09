import React from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import SecurityPage from "./SecurityPage"; // Different component for security
import Setting from "./Setting.jsx"; // Different component for setting
import { useUser } from "../../utils/Usercontext";
import AddressForm from "./UpdateAddress.jsx"; // Different component for address
import UserPosts from './UserPosts';
import ReferralLink from './ReferralLink';

const Profileroutes = () => {
  const { user } = useUser();

  return (
    <Routes>
      {/* Routes under /user */}
      <Route path="/" element={<ProfilePage user={user} />} />
      <Route path="/security" element={<SecurityPage user={user}  />} />
      <Route path="/setting" element={<Setting user={user} />} />
      <Route path="/address" element={<AddressForm user={user} />} />
      <Route path="/posts" element={<UserPosts />} />
      <Route path="*" element={<ProfilePage user={user} />} />
      <Route path="/refer" element={<ReferralLink user={user} />} />

      {/* <Route path="*" element={<Setting/>} /> */}
    </Routes>
  );
};

export default Profileroutes;
