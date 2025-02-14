import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddressActions from "./AddressActions";
import Custominputfields from "../Custominputfields";

const ProfilePage = ({ user }) => {
  console.log(user);
  const [userpic, setUserpic] = useState(user?.userpic);
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState("Not Provided Yet");
  const [country, setCountry] = useState("Not Provided Yet");

  const [addresses, setAddresses] = useState([
    {
      country: "Not Provided Yet",
      city: "Not Provided Yet",
      zip: "Not Provided Yet",
      district: "Not Provided Yet",
      street: "Not Provided Yet",
      building: "Not Provided Yet",
      floor: "Not Provided Yet",
      location: "Not Provided Yet",
    },
  ]);

  // Update useEffect to handle multiple addresses
  useEffect(() => {
    if (user) {
      setFirstName(user.firstname);
      setLastName(user.lastname);
      setEmail(user.email);
      if (user?.addresses && user.addresses.length > 0) {
        setAddresses(user.addresses);
      }
    }
  }, [user]);

  return (
    <div className="w-[78vw]">
      <div className="flex w-full items-center flex-col">
        <h1 className="text-4xl text-start pl-20 mt-10 w-full border-b pb-2 border-black font-bold">
          Personal Information
        </h1>
        <div className="w-full gap-10 flex pl-20 pt-3 relative pb-3 border-b border-black">
          <div className="size-[100px] relative rounded-full overflow-hidden w-fit ">
            <img
              src={user?.userpic}
              className="size-[100px] rounded-full"
              alt=""
            />
          </div>
          <div className="w-[70%]">
            <p className="text-4xl font-semibold">About me</p>
            <textarea
              name=""
              value={
                user?.aboutme
                  ? user?.aboutme
                  : "did't get so much yet about you"
              }
              className="w-full h-[70%] resize-none focus:ring-0 focus:outline-none"
              readOnly
              id=""
            ></textarea>
          </div>
        </div>
        <div className="flex w-full  justify-around">
          <div className="w-1/3">
            <Custominputfields
              name="First Name"
              type="text"
              from="firstname"
              getter={firstname}
              setter={""}
              disabled={true}
            />
          </div>
          <div className="w-1/3">
            <Custominputfields
              name="Last Name"
              type="text"
              from="lastname"
              getter={lastname}
              setter={""}
              disabled={true}
            />
          </div>
        </div>
        <div className="flex w-full  justify-around mt-2">
          <div className="w-1/3">
            <Custominputfields
              name="Email"
              type="email"
              from="email"
              getter={email}
              setter={""}
              disabled={true}
            />
          </div>
          <div className="w-1/3">
            <Custominputfields
              name="Phone"
              type="text"
              from="phone"
              getter={phone}
              setter={""}
              disabled={true}
            />
          </div>
        </div>

        <div className="w-full mt-4 flex items-start justify-around flex-wrap">
          <AddressActions  />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
