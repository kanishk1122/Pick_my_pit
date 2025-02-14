import React, { useState } from "react";
import { useSwal } from "@utils/Customswal.jsx";
import { ADDRESS } from "../../Consts/apikeys";
import SDK from "../../utils/sdk";
import { useUser } from "../../utils/Usercontext"; // Update import

const AddressForm = ({ user }) => {
  const Swal = useSwal();
  const { fetchUseraddresses } = useUser(); // Get function from context

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    landmark: "",
    isDefault: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const api = new SDK(user);

    try {
      const response = await api.post(ADDRESS.Add, {
        userId: user._id,
        ...formData,
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Address added successfully",
        });

        setFormData({
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          landmark: "",
          isDefault: false,
        });

        // Call fetchUseraddresses with user object
        await fetchUseraddresses(user);
      }
    } catch (error) {
      console.error("Address submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to add address",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="bg-white p-8 rounded-3xl max-w-2xl mx-auto ">
      <h2 className="text-3xl font-extrabold mb-8">
        <span className="text-green-500">Add</span> New Address
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Street Address */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 focus:ring-green-200 transition-all outline-none"
            placeholder="Enter your street address"
            required
          />
        </div>

        {/* Landmark */}
        <div className="form-group">
          <label className="block text-sm font-semibold mb-2">Landmark</label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 focus:ring-green-200 transition-all outline-none"
            placeholder="Enter nearby landmark"
          />
        </div>

        {/* City and State */}
        <div className="grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 focus:ring-green-200 transition-all outline-none"
              placeholder="Enter city"
              required
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none  transition-all focus:ring-0 "
              placeholder="Enter state"
              required
            />
          </div>
        </div>

        {/* Postal Code and Country */}
        <div className="grid grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2">
              Postal Code
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 focus:ring-green-200 transition-all outline-none"
              placeholder="Enter postal code"
              required
              maxLength="6"
            />
          </div>
          <div className="form-group">
            <label className="block text-sm font-semibold mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-0 focus:ring-green-200 transition-all outline-none"
              placeholder="Enter country"
              required
            />
          </div>
        </div>

        {/* Default Address Checkbox */}
        <div className="flex items-center space-x-3 py-2">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
            <span className="ms-3 text-sm font-medium text-zinc-900 ">
              Set as default address
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group brand-button h-[50px] w-full flex gap-4 justify-center items-center text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center  transition-all duration-300"
        >
          <span className="text-xl">Add Address</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
