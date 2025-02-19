import React, { useState, useEffect } from "react";
import { useUser } from "../../utils/Usercontext";
import { useSwal } from "@utils/Customswal.jsx";
import { USER } from "../../Consts/apikeys";
import axios from "axios";

const Setting = () => {
  const { user, fetchAndUpdateUserData } = useUser();
  const [loading , setLoading] = useState(false);
  const Swal = useSwal();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "male",
    phone: "",
    about: "",
    profilePic: null,
  });
  const [charCount, setCharCount] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      console.log("Current user data:", user); // Debug log
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        gender: user.gender || "male",
        phone: user.phone || "",
        about: user.about || "",
        profilePic: user.profilePic || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "about") {
      setCharCount(value.length);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      if (!user || !user.id) {
        throw new Error("User ID not found");
      }

      const updateData = {
        ...formData,
        userId: user.id,
      };

      // Remove empty fields
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === "" || updateData[key] === null) {
          delete updateData[key];
        }
      });

      if (profilePic) {
        const base64 = await fileToBase64(profilePic);
        updateData.profilePic = base64;
      }

      const response = await axios.put(USER.Update, updateData, {
        headers: {
          Authorization: `Bearer ${user.sessionToken}`,
          "Content-Type": "application/json",
          userid: user.id,
        },
      });

      if (response.data.success) {
        Swal.fire("Success", "Profile updated successfully", "success").then(async () => {
          await fetchAndUpdateUserData(user);
        });
        Swal.fire("Success", "Profile updated successfully", "success");
        setLoading(false);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire(
        "Error",
        "Failed to update profile: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="mt-10 max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg border-2 border-green-500">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        <span className="text-green-500">User</span> Settings
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="shrink-0">
            <img
              className="h-32 w-32 object-cover rounded-full"
              src={
                imagePreview ||
                user?.userpic ||
                "https://via.placeholder.com/128"
              }
              alt="Current profile photo"
            />
          </div>
          <label className="block border-dashed border-2 border-gray-300 rounded-full p-2 text-center cursor-pointer">
            <span className="sr-only">Choose profile photo</span>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100
              "
            />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 transition-all outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 transition-all outline-none"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 transition-all outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About
          </label>
          <textarea
            name="about"
            rows="4"
            value={formData.about}
            onChange={handleChange}
            maxLength={500}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 transition-all outline-none resize-none"
          ></textarea>
          <div className="text-sm text-gray-500 mt-1 flex justify-end">
            {charCount}/500 characters
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}

            className="group w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 flex items-center justify-center"
          >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white mr-3 mt-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25 "
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V2.83a1 1 0 012 0V4a8 8 0 018 8h1.17a1 1 0 010 2H20a8 8 0 01-8 8v1.17a1 1 0 01-2 0V20a8 8 0 01-8-8H4a1 1 0 010-2h1.17a1 1 0 010-2H4z"
              ></path>
            </svg>
          ) : ( <>
          Update Profile
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-2 group-hover:ml-3 duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
                />
            </svg>
                </> 
          )}
            
          
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
