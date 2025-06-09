import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { USER } from "../../Consts/apikeys";
import axios from "axios";
import { encrypter } from "../../Consts/Functions";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import PropTypes from "prop-types";
import { useSwal } from "@utils/Customswal.jsx"; // Path to SwalContext

const Googlebutton = ({ authtype }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const Swal = useSwal(); // Use SwalContext
  const Navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      try {
        fetchUserInfo(tokenResponse.access_token);
        console.log(tokenResponse.access_token);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    },
  });

  const fetchUserInfo = async (accessToken) => {
    try {
      // we done that on server
      // // 1. Fetch user info from Google using axios
      // const googleResponse = await axios.get(
      //   "https://www.googleapis.com/oauth2/v2/userinfo",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );

      // console.log("Google User Info:", googleResponse.data);

      // 2. Send user info to your server for authentication using axios
      const serverResponse = await axios.post(USER.Auth, {
        token: accessToken,
        referralCode,
        // userInfo: googleResponse.data, // Optional: Send Google user info if needed
      });

      console.log("Server Response:", serverResponse.status);

      // 3. Handle server response
      if (serverResponse?.status == 200 || serverResponse?.status == 201) {
        // Save session token or other relevant data
        const stringify = JSON.stringify(serverResponse.data.userdata);
        const userdata = encrypter(stringify);
        Cookies.set("Userdata", userdata, { expires: 150 });

        // Provide success feedback to the user
        Swal.fire({
          icon: "success",
          title: "Authentication Successful!",
          text: serverResponse.data.msg || "Welcome!",
        }).then(() => {
          Navigate("/");
        });
      } else {
        throw new Error(serverResponse.data.msg || "Authentication failed.");
      }
    } catch (error) {
      // Handle errors during any part of the process
      console.error("Error during Google authentication:", error);

      // Provide meaningful feedback to the user
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.msg ||
          "Authentication failed. Please try again.",
      });
    }
  };

  const defaultStyle = {
    backgroundColor: "white",
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
    border: "2px solid black",
  };

  const hoverStyle = {
    ...defaultStyle,
    boxShadow: `
        2px 2px  #FFC107, 
        4px 4px  #FF3D00, 
        6px 6px  #4CAF50, 
        8px 8px  #1976D2
      `,

    //   transform: "scale(1.05)",
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Referral Code (optional)"
        value={referralCode}
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <button
        style={isHovered ? hoverStyle : defaultStyle}
        onMouseEnter={() => setIsHovered(true)}
        onClick={() => login()}
        onMouseLeave={() => setIsHovered(false)}
        className="items-center gap-4 px-3 py-1 mb-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          width="32px"
          height="32px"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        <span className="text-sm">Continue using Google</span>
      </button>
    </div>
  );
};

export default Googlebutton;
