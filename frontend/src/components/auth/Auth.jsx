import React, { useEffect, useState } from "react";
import v1 from "../../assets/video/hsv2.mp4";
import image from "../../assets/images/pikaso_texttoimage_A-handdrawn-vibrant-outdoor-scene-in-a-peaceful-vi.jpeg";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { useSwal } from "@utils/Customswal.jsx"; // Path to SwalContext
import Cookies from "js-cookie";
import Googlebutton from "./Googlebutton.jsx";
import { useNavigate } from "react-router-dom";


const Auth = () => {
  const Swal = useSwal(); // Use SwalContext
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [authtype, setauthtype] = useState("login");
  const Navigate = useNavigate();
  useEffect(()=>{
    if(Cookies.get("Userdata")){
      Navigate("/");
    }
  },[Cookies.get("Userdata")])

  return (
    <div className="w-screen h-screen flex justify-center items-center overflow-hidden px-20 py-10">
      <div className="bg-white w-full h-full flex  justify-between items-center rounded-3xl py-5 px-10">
        {/* Left Section */}
        <div className={`flex flex-col justify-between  h-full w-1/2 relative`}>
          <div
            className={`absolute top-0 ${
              authtype !== "login" ? "left-[65vw]" : "left-1/2"
            } duration-200 -translate-x-1/2 w-full h-full flex  justify-between flex-col py-6`}
          >
            <h1 className="text-6xl font-extrabold leading-snug">
              {authtype !== "login" ? (
                <>
                  <span className="text-[#FFD700]">Signup</span> <br /> to get
                  started
                </>
              ) : (
                <>
                  <h2>
                    <span className="text-green-500">Welcome Again!</span>{" "}
                    <br /> A sweet pet is waiting for you
                  </h2>
                </>
              )}
            </h1>
            {authtype !== "login" ? (
              <img
                src={image}
                alt=""
                className="w-[90%] mr-20 h-[300px] object-cover rounded-3xl"
              />
            ) : (
              <video
                className="w-[90%] mr-20 h-[200px] object-cover rounded-3xl"
                autoPlay
                loop
                muted
              >
                <source src={v1} type="video/mp4" />
              </video>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className={`relative w-1/2 h-full  `}>
          <div
            className={`absolute top-0 ${
              authtype == "login" ? "left-1/2" : "-left-1/2"
            } duration-200 -translate-x-1/2 w-full h-full`}
          >
            <svg
              className={` bg-white absolute top-0 left-1/2 h-full w-[80%] -translate-x-1/2 bg-opacity-50 backdrop-blur-[1px] border-2 border-black rounded-3xl`}
              height="100%"
              viewBox="0 0 1156 1557"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1156 0H0V1557H1156V0ZM204 990C173.072 990 148 1015.07 148 1046V1322C148 1352.93 173.072 1378 204 1378H956C986.928 1378 1012 1352.93 1012 1322V1046C1012 1015.07 986.928 990 956 990H204Z"
                fill="#fff"
              />
            </svg>

            <div className="absolute top-0 left-0 w-full h-full  rounded-3xl px-20  ">
              {authtype === "login" ? (
                <Login
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  authtype={authtype}
                  setauthtype={setauthtype}
                />
              ) : (
                <Signup
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  authtype={authtype}
                />
              )}
              {/* Form Container */}

              <div className="flex  flex-col items-center justify-center absolute  bottom-10 left-1/2 -translate-x-1/2">
                    <Googlebutton />
                <p className="text-center ">
                  {authtype !== "login"
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </p>
                <button
                  onClick={() => {
                    setauthtype(`${authtype === "login" ? "signup" : "login"}`);
                  }}
                  className="group brand-button h-[50px] w-fit  flex gap-16   justify-between px-10 items-center"
                >
                  <span className="text-xl">
                    {authtype !== "login" ? "Login" : "Signup"}
                  </span>
                  <div
                    className={`w-fit h-fit text-white bg-black rounded-full p-1   ${
                      authtype !== "login"
                        ? "group-hover:rotate-0"
                        : "group-hover:rotate-180"
                    } ${authtype !== "login" && "rotate-180"} duration-200`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                      fill="currentColor"
                    >
                      <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
