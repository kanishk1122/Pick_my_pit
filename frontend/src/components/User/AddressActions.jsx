import React, { useState, useEffect } from "react";
import { useSwal } from "@utils/Customswal.jsx";
import { ADDRESS } from "../../Consts/apikeys";
import { useUser } from "../../utils/Usercontext";
import AddressItem from "./AddressItem";
import axios from "axios";

const AddressActions = () => {
  const Swal = useSwal();
  const { user, fetchUseraddresses } = useUser();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (user) {
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleEdit = async (address) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Address",
      html: `
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Street</label>
            <input id="street" class="mt-1 block w-full p-2 border rounded-md" value="${
              address.street
            }">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Landmark</label>
            <input id="landmark" class="mt-1 block w-full p-2 border rounded-md" value="${
              address.landmark || ""
            }">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input id="city" class="mt-1 block w-full p-2 border rounded-md" value="${
                address.city
              }">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">State</label>
              <input id="state" class="mt-1 block w-full p-2 border rounded-md" value="${
                address.state
              }">
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Postal Code</label>
              <input id="postalCode" class="mt-1 block w-full p-2 border rounded-md" value="${
                address.postalCode
              }">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Country</label>
              <input id="country" class="mt-1 block w-full p-2 border rounded-md" value="${
                address.country
              }">
            </div>
          </div>
          <div class="flex items-center">
            <input type="checkbox" id="isDefault" ${
              address.isDefault ? "checked" : ""
            } class="rounded text-green-600">
            <label class="ml-2 text-sm text-gray-700">Set as default address</label>
          </div>
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
          await fetchUseraddresses(user);
          Swal.fire("Success", "Address updated successfully", "success");
        } else {
          throw new Error(response.data.message || "Failed to update address");
        }
      } catch (error) {
        console.error("Error updating address:", error);
        console.log("Error response:", error.response);
        Swal.fire("Error", `Failed to update address: ${error.response?.data?.message || error.message}`, "error");
      }
    }
  };

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
        await fetchUseraddresses(user);
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
