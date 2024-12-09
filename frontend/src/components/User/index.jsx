import React, { useEffect, useState } from "react";
import { useUser } from "../../utils/Usercontext";
import { useNavigate } from "react-router-dom";
import Custominputfields from "../Custominputfields";

const index = () => {
  const { user } = useUser();

  console.log(user);
  const [userpic, setUserpic] = useState(user?.userpic);
  const [firstname, setFirstName] = useState();
  const [lastname, setLastName] = useState();
  const [email, setEmail] = useState();
  const [phone , setPhone] = useState("Not Provided Yet");

  useEffect(() => {
    setFirstName(user?.firstname);
    setLastName(user?.lastname);
    setEmail(user?.email);
  }
    , [user]);

  return (
    <div className="min-h-[100vh] flex bg-white rounded-t-[30px] pt-10 mt-20 gap-2 border-2 border-black">
      <div className="w-[20%]  border-r border-black mt-10"></div>
      <div className="flex  w-[80%] items-center flex-col">
        <h1 className="text-4xl text-start pl-20 mt-10  w-full  border-b pb-2 border-black  font-bold">
          Personal Information
        </h1>
        <div className="w-full flex  pl-20 pt-3  relative pb-3  border-b border-black">
          <div className="size-[100px] relative rounded-full overflow-hidden w-fit bg-red">
            <img
              src={user?.userpic}
              className="size-[100px] rounded-full"
              alt=""
            />
            <div className="absolute  w-full h-full top-0 cursor-pointer">
              <input
                type="file"
                id="photo"
                className="w-full h-[80%] opacity-0 cursor-pointer"
              />
              <label
                htmlFor="photo"
                className="w-full h-[20%] bg-black text-white flex items-center justify-center cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="12"
                  height="12"
                  fill="currentColor"
                >
                  <path d="M2 6.00087C2 5.44811 2.45531 5 2.9918 5H21.0082C21.556 5 22 5.44463 22 6.00087V19.9991C22 20.5519 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5554 2 19.9991V6.00087ZM14 18C16.7614 18 19 15.7614 19 13C19 10.2386 16.7614 8 14 8C11.2386 8 9 10.2386 9 13C9 15.7614 11.2386 18 14 18ZM4 7V9H7V7H4ZM4 2H10V4H4V2Z"></path>
                </svg>
              </label>
            </div>
          </div>
        </div>
        <div className="flex w-full  bg-red-300 justify-around">
        <div className="w-1/3">
        <Custominputfields
          name="First Name"
          type="text"
          from="firstname"
          getter={firstname}
          setter={setFirstName}
        />
        </div>
      <div className="w-1/3">
      <Custominputfields
          name="Last Name"
          type="text"
          from="lastname"
          getter={lastname}
          setter={setLastName}
        />
      </div>
        </div>
        <div className="flex w-full  bg-red-300 justify-around mt-2">
        <div className="w-1/3">
        <Custominputfields
          name="Email"
          type="email"
          from="email"
          getter={email}
          setter={setEmail}
        />
        </div>
      <div className="w-1/3">
      <Custominputfields
          name="Phone"
          type="text"
          from="phone"
          getter={phone}
          setter={setPhone}
        />
      </div>
        </div>
       
      </div>
    </div>
  );
};

export default index;
