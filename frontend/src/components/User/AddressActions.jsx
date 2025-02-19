import React, { useState, useEffect } from "react";
import { useSwal } from "@utils/Customswal.jsx";
import { ADDRESS } from "../../Consts/apikeys";
import { useUser } from "../../utils/Usercontext";
import AddressItem from "./AddressItem";
import axios from "axios";

const AddressActions = () => {
  const { user, fetchAndUpdateUserData  ,setUser} = useUser();
  const [addresses, setAddresses] = useState([]);

  const Swal = useSwal();
  useEffect(() => {
    if (user && user.addresses) {
      setAddresses(user.addresses);
    }
  }, [user]);

  const handleEdit = async (address) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Address",
      html: `
        <div class="space-y-4">
          ${generateInputField("street", "Street", address.street)}
          ${generateInputField("landmark", "Landmark", address.landmark || "")}
          <div class="grid grid-cols-2 gap-4">
            ${generateInputField("city", "City", address.city)}
            ${generateInputField("state", "State", address.state)}
          </div>
          <div class="grid grid-cols-2 gap-4">
            ${generateInputField("postalCode", "Postal Code", address.postalCode)}
            ${generateInputField("country", "Country", address.country)}
          </div>
          ${generateCheckbox("isDefault", "Set as default address", address.isDefault)}
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-button bg-green-500 hover:bg-green-600 mr-4",
        cancelButton: "swal-button bg-red-500 hover:bg-red-600 ml-4",
      },
      preConfirm: () => ({
        street: document.getElementById("street").value,
        landmark: document.getElementById("landmark").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        postalCode: document.getElementById("postalCode").value,
        country: document.getElementById("country").value,
        isDefault: document.getElementById("isDefault").checked,
      }),
    });
  
    if (formValues) {
      try {
        const response = await axios.put(
          ADDRESS.Update(address._id),
          { ...formValues, userId: user.id },
          {
            headers: {
              Authorization: `Bearer ${user.sessionToken}`,
              "Content-Type": "application/json",
              userid: user.id,
            },
          }
        );
  
        if (response.data.success) {
          setUser((prev) => ({
            ...prev,
            addresses: prev.addresses.map((addr) =>
              addr._id === address._id ? { ...addr, ...formValues } : addr
            ),
          }));
          Swal.fire("Success", "Address updated successfully", "success");
        } else {
          throw new Error(response.data.message || "Failed to update address");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        Swal.fire("Error", `Failed to update address: ${error.response?.data?.message || error.message}`, "error");
      }
    }
  };
  
  // Utility functions for cleaner code
  const generateInputField = (id, label, value) => `
    <div>
      <label class="block text-sm font-medium text-gray-700">${label}</label>
      <input id="${id}" class="mt-1 block w-full p-2 border rounded-md" value="${value}">
    </div>
  `;
  
  const generateCheckbox = (id, label, checked) => `
    <div class="flex items-center space-x-3 py-2">
      <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" id="${id}" class="sr-only peer" ${checked ? "checked" : ""}>
        <div class="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-green-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        <span class="ml-3 text-sm font-medium text-zinc-900">${label}</span>
      </label>
    </div>
  `;

  const handleDelete = async (address) => {
    const result = await Swal.fire({
      title: "Delete Address",
      text: "Are you sure you want to delete this address?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-button mr-4 bg-red-500 hover:bg-red-600",
        cancelButton: "swal-button ml-4 bg-gray-500 hover:bg-gray-600",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(ADDRESS.Delete(address._id), {
          headers: {
            Authorization: `Bearer ${user.sessionToken}`,
            userid: user.id,
          },
        });
        setUser((prev) => {
          const updatedAddresses = prev.addresses.filter((addr) => addr._id !== address._id);
          return { ...prev, addresses: updatedAddresses };
        });
        
        Swal.fire("Success", "Address deleted successfully", "success");
      } catch (error) {
        console.error("Error deleting address:", error);
        Swal.fire("Error", "Failed to delete address", "error");
      }
    }
  };

  const handleAddressClick = (address) => {
    Swal.fire({
      title: "Address Actions",
      html: `
        <div class="text-left p-4">
          <p class="font-medium">${address.street}</p>
          ${
            address.landmark
              ? `<p class="text-sm text-gray-600">Landmark: ${address.landmark}</p>`
              : ""
          }
          <p class="text-sm">${address.city}, ${address.state} ${
        address.postalCode
      }</p>
          <p class="text-sm">${address.country}</p>
          ${
            address.isDefault
              ? '<p class="text-green-600 text-sm mt-2">Default Address</p>'
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Edit",
      denyButtonText: "Delete",
      cancelButtonText: "Close",
      customClass: {
        confirmButton: "swal-button mr-4 bg-blue-500 hover:bg-blue-600",
        denyButton: "swal-button mx-4 bg-red-500 hover:bg-red-600",
        cancelButton: "swal-button ml-4 bg-gray-500 hover:bg-gray-600",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleEdit(address);
      } else if (result.isDenied) {
        handleDelete(address);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((address) => (
        <AddressItem
          key={address._id}
          accessmode="edit"
          address={address}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClick={() => handleAddressClick(address)}
        />
      ))}
    </div>
  );
};

export default AddressActions;
