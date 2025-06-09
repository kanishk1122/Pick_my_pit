import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Custominputfields, { Passwordcustomfiled } from "../Custominputfields";
import { useSwal } from "@utils/Customswal.jsx"; // Path to SwalContext
import "@CSS/transtation.css";
import { USER } from "../../Consts/apikeys";
import axios from "axios";
import { encrypter } from "../../Consts/Functions";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Signup = ({ email, setEmail, password, setPassword, authtype }) => {
  const [confirmepassword, setConfirmepassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [stage, setStage] = useState(1);
  const lastStage = 3;
  const Swal = useSwal(); // Use SwalContext
  const [passwordMatch, setPasswordMatch] = useState(false);
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState("");

  // Check if passwords match
  useEffect(() => {
    setPasswordMatch(password === confirmepassword);
  }, [password, confirmepassword]);

  // Button styling based on password match
  const passwordMatchClass = passwordMatch
    ? "hover:bg-yellow-300"
    : "hover:bg-gray-200 cursor-not-allowed";

  // Form submission handler
  const handleFormSubmit = (e) => {
    if (!email) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Please enter your email",
      });
      return;
    }

    if (stage >= 2 && (!password || !confirmepassword)) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Please enter your password",
      });
      return;
    }

    if (stage >= 2 && !passwordMatch) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Passwords do not match",
      });
      return;
    }

    if (stage >= 3 && (!firstname || !lastname)) {
      Swal.fire({
        icon: "info",
        title: "Oops...",
        text: "Please enter your name",
      });
      return;
    }

    if (stage < lastStage) {
      setStage(stage + 1);
    }

    if (stage == lastStage) {
      const encryptedPassword = encrypter(password);
      axios
        .post(`${USER.Register}`, {
          email: email,
          password: encryptedPassword,
          firstname: firstname,
          lastname: lastname,
          referralCode: referralCode,
        })
        .then((response) => {
          console.log(response.data.userdata);
          Swal.fire({
            icon: "success",
            title: "Account Created",
            text: "Please check your email for confirmation",
          });
          try {
            const stringify = JSON.stringify(response.data.userdata);
            const userdata = encrypter(stringify);
            Cookies.set("Userdata", userdata, { expires: 150 });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong",
            });
          }
          // navigate("/");
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error?.response?.data, "this is error");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.response?.data?.msg,
            footer: "This email is already registered",
          });
        });
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmit(e);
      }}
      className="w-full h-fit rounded-2xl p-3 sm:p-8 flex flex-col gap-1 overflow-hidden"
    >
      {/* Stage 1 - Email Input */}
      <div
        className={`twodivtranstation h-[70px] sm:h-[110px] ${
          stage === 1 ? "transition-start" : "transition-exit"
        } w-full`}
      >
        <Custominputfields
          from="email"
          name="Email"
          type="email"
          getter={email}
          setter={setEmail}
        />
      </div>

      {/* Stage 2 - Password Inputs */}
      <div
        className={`twodivtranstation h-[140px] sm:h-[220px] ${
          stage === 2 ? "transition-start" : "transition-exit"
        } flex flex-col gap-1`}
      >
        <Passwordcustomfiled
          password={password}
          setPassword={setPassword}
          name="Password"
        />
        <Custominputfields
          from="confirmepassword"
          name="Confirm Password"
          type="te"
          getter={confirmepassword}
          setter={setConfirmepassword}
        />
        {!passwordMatch && (
          <div className="h-[20px] w-full text-red-400">
            Passwords do not match
          </div>
        )}
      </div>

      {/* Stage 3 - First and Last Name Inputs */}
      <div
        className={`twodivtranstation h-[140px] sm:h-[220px] ${
          stage === 3 ? "transition-start" : "transition-exit"
        } flex flex-col gap-1`}
      >
        <Custominputfields
          from="firstname"
          name="First Name"
          type="text"
          getter={firstname}
          setter={setFirstname}
        />
        <Custominputfields
          from="lastname"
          name="Last Name"
          type="text"
          getter={lastname}
          setter={setLastname}
        />
        <Custominputfields
          from="referralCode"
          name="Referral Code (optional)"
          type="text"
          getter={referralCode}
          setter={setReferralCode}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center duration-200 mt-2">
        <button
          type="button"
          onClick={() => stage > 1 && setStage(stage - 1)}
          className={`duration-200 text-xs sm:text-base ${
            stage > 1
              ? "w-1/3 brand-button my-1 sm:my-4 hover:bg-red-300"
              : "w-0"
          }`}
        >
          Back
        </button>

        <button
          className={`brand-button my-1 sm:my-4 duration-200 text-xs sm:text-base ${
            stage === 1
              ? "w-full hover:bg-yellow-300"
              : `w-[60%] ${passwordMatchClass}`
          }`}
        >
          {stage === lastStage ? "Sign Up" : "Next"}
        </button>
      </div>
    </form>
  );
};

Signup.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  authtype: PropTypes.string,
};

export default Signup;
