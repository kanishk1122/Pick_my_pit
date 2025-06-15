import React, { useState, useEffect } from "react";
import { useUser } from "../utils/Usercontext";
import AddressItem from "./User/AddressItem";
import { POST } from "../Consts/apikeys";
import axios from "axios";
import { motion } from "framer-motion";
import AddressForm from "./User/UpdateAddress";
import { useSwal } from "@utils/Customswal.jsx";

const CreatePost = () => {
  const { user } = useUser();
  const Swal = useSwal();
  const [selectedImages, setSelectedImages] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [species, setSpecies] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isLoadingSpecies, setIsLoadingSpecies] = useState(false);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    ageValue: "",
    ageUnit: "months",
    description: "",
    price: "",
    isNegotiable: false,
    useUserAddress: true,
    address: {
      country: "",
      city: "",
      zip: "",
      district: "",
      street: "",
      building: "",
      floor: "",
      location: "",
    },
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [speciesHierarchy, setSpeciesHierarchy] = useState([]);
  const [availableBreeds, setAvailableBreeds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchSpeciesHierarchy();
  }, []);

  useEffect(() => {
    if (formData.species) {
      // Find the selected species in the hierarchy
      const selectedSpeciesData = speciesHierarchy.find(
        (s) => s.name === formData.species
      );

      if (selectedSpeciesData && selectedSpeciesData.breeds) {
        // Use the breeds directly from the hierarchy
        setAvailableBreeds(selectedSpeciesData.breeds);
        setIsLoadingBreeds(false);
      } else {
        // Fallback to traditional API call
        fetchBreeds(formData.species);
      }
    } else {
      setAvailableBreeds([]);
    }
  }, [formData.species, speciesHierarchy]);

  const fetchSpeciesHierarchy = async () => {
    setIsLoadingSpecies(true);
    try {
      console.log("Fetching species hierarchy...");
      const response = await axios.get(`${POST.GetSpecies}/hierarchy`, {
        headers: {
          Authorization: `Bearer ${user?.sessionToken || ""}`,
          userid: user?.id || "",
        },
      });

      if (response.data.success) {
        console.log("Species hierarchy received:", response.data.hierarchy);
        setSpeciesHierarchy(response.data.hierarchy);
        setSpecies(response.data.hierarchy);
      } else {
        console.warn(
          "Species hierarchy fetch returned success:false",
          response.data
        );
        // Fallback to traditional method
        fetchSpecies();
      }
    } catch (error) {
      console.error("Error fetching species hierarchy:", error);
      // Fallback to traditional method
      fetchSpecies();
    } finally {
      setIsLoadingSpecies(false);
    }
  };

  // Keep the original method as fallback
  const fetchSpecies = async () => {
    setIsLoadingSpecies(true);
    try {
      console.log("Fetching species data...");
      const response = await axios.get(`${POST.GetSpecies}`, {
        headers: {
          Authorization: `Bearer ${user?.sessionToken || ""}`,
          userid: user?.id || "",
        },
      });

      if (response.data.success) {
        console.log("Species data received:", response.data.species);
        setSpecies(response.data.species);
      } else {
        console.warn("Species fetch returned success:false", response.data);
      }
    } catch (error) {
      console.error("Error fetching species:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch species. Please try again.",
      });
    } finally {
      setIsLoadingSpecies(false);
    }
  };

  const fetchBreeds = async (speciesName) => {
    if (!speciesName) return;

    setIsLoadingBreeds(true);
    try {
      console.log(`Fetching breeds for species: ${speciesName}`);
      const response = await axios.get(`${POST.GetBreeds}/${speciesName}`, {
        headers: {
          Authorization: `Bearer ${user?.sessionToken || ""}`,
          userid: user?.id || "",
        },
      });

      if (response.data.success) {
        console.log("Breeds data received:", response.data.breeds);
        setBreeds(response.data.breeds || []);
      } else {
        console.warn("Breeds fetch returned success:false", response.data);
        setBreeds([]);
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
      setBreeds([]);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch breeds. Please try again.",
      });
    } finally {
      setIsLoadingBreeds(false);
    }
  };

  // Add a new function to compress images before upload
  const compressImage = (imageDataUrl) => {
    return new Promise((resolve) => {
      const maxWidth = 1200; // Maximum width for the compressed image
      const maxHeight = 1200; // Maximum height for the compressed image
      const quality = 0.7; // Image quality (0.7 = 70% quality)

      const img = new Image();
      img.onload = function () {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Create a canvas to compress the image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Get the compressed image as a data URL
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.src = imageDataUrl;
    });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedImages.length > 5) {
      Swal.fire("Error", "You can upload a maximum of 5 images.", "error");
      return;
    }

    // Show loading state
    if (files.length > 0) {
      setUploadProgress(10);
      setIsSubmitting(true);
    }

    let processed = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          // Compress the image before adding it to state
          const compressedImage = await compressImage(reader.result);
          setSelectedImages((prevImages) => [...prevImages, compressedImage]);

          // Update progress
          processed++;
          setUploadProgress(Math.round((processed / files.length) * 90) + 10);

          // Reset loading state when all files are processed
          if (processed === files.length) {
            setTimeout(() => {
              setIsSubmitting(false);
              setUploadProgress(0);
            }, 500);
          }
        } catch (error) {
          console.error("Error compressing image:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was an error processing your image. Please try another image.",
          });

          processed++;
          if (processed === files.length) {
            setIsSubmitting(false);
            setUploadProgress(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, imgIndex) => imgIndex !== index)
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "species") {
      const selectedSpecies = species.find((s) => s.name === value);
      setSelectedSpecies(selectedSpecies);
      // Reset breed when changing species
      setFormData((prev) => ({
        ...prev,
        breed: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Reset breed when species changes
      ...(name === "species" ? { breed: "" } : {}),
    }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowNewAddressForm(false);
  };

  const handleNewAddressSubmit = async () => {
    await fetchAndUpdateUserData(user);
    setShowNewAddressForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent multiple submissions

    try {
      // Validate form inputs
      if (!formData.species) {
        throw new Error("Please select a species");
      }
      if (!formData.breed) {
        throw new Error("Please select a breed");
      }
      if (formData.petName.length < 3) {
        throw new Error("Pet name must be at least 3 characters long");
      }
      if (formData.description.length < 20) {
        throw new Error("Description must be at least 20 characters long");
      }
      if (!selectedAddress) {
        throw new Error("Please select an address");
      }
      if (selectedImages.length === 0) {
        throw new Error("Please upload at least one image");
      }

      // Validate age value if provided
      if (
        formData.ageValue &&
        (isNaN(formData.ageValue) || formData.ageValue < 0)
      ) {
        throw new Error("Age must be a positive number");
      }

      // Start loading state
      setIsSubmitting(true);
      setUploadProgress(10); // Initial progress indication

      // Prepare chunked upload for multiple images
      let compressedImages = [];
      for (let i = 0; i < selectedImages.length; i++) {
        // Update progress during compression
        setUploadProgress(10 + Math.round((i / selectedImages.length) * 20));

        // Further compress if needed before sending to server
        if (selectedImages[i].length > 1000000) {
          // If larger than ~1MB
          const recompressed = await compressImage(selectedImages[i]);
          compressedImages.push(recompressed);
        } else {
          compressedImages.push(selectedImages[i]);
        }
      }

      setUploadProgress(30); // Compression completed

      const postData = {
        title: formData.petName,
        discription: formData.description,
        amount: formData.price || 0,
        type: formData.isNegotiable ? "paid" : "free",
        category: formData.breed,
        species: formData.species,
        userId: user.id,
        addressId: selectedAddress._id,
        images: compressedImages,
        age: formData.ageValue
          ? {
              value: Number(formData.ageValue),
              unit: formData.ageUnit,
            }
          : undefined,
      };

      console.log(`Submitting post with ${compressedImages.length} images`);
      setUploadProgress(40); // Update progress after preparing data

      // Simulate progress for image uploads
      let progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 2;
          return newProgress < 80 ? newProgress : 80;
        });
      }, 1000);

      // Make the API call
      const response = await axios.post(POST.Create, postData, {
        headers: {
          Authorization: `Bearer ${user.sessionToken}`,
          "Content-Type": "application/json",
          userid: user.id,
        },
        // Add timeout for large uploads
        timeout: 60000, // 60 seconds
      });

      // Clear the interval
      clearInterval(progressInterval);
      setUploadProgress(100); // Complete progress

      if (response.data.success) {
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your pet listing has been created successfully.",
        });
        // Reset form
        setFormData({
          petName: "",
          species: "",
          breed: "",
          ageValue: "",
          ageUnit: "months",
          description: "",
          price: "",
          isNegotiable: false,
          useUserAddress: true,
          address: {
            country: "",
            city: "",
            zip: "",
            district: "",
            street: "",
            building: "",
            floor: "",
            location: "",
          },
        });
        setSelectedImages([]);
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      let errorMessage = "Failed to create pet listing";

      if (error.message === "Network Error" || error.code === "ECONNABORTED") {
        errorMessage =
          "The upload timed out. Please try with smaller or fewer images.";
      } else if (error.response?.status === 413) {
        errorMessage =
          "The images are too large. Please use smaller images or fewer images.";
      } else {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  // Age input section
  const ageInputSection = (
    <div className="grid grid-cols-2 gap-4">
      <motion.div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Value
        </label>
        <input
          type="number"
          name="ageValue"
          value={formData.ageValue}
          onChange={handleInputChange}
          min="0"
          placeholder="Enter age number"
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
        />
      </motion.div>
      <motion.div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age Unit
        </label>
        <select
          name="ageUnit"
          value={formData.ageUnit}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
        >
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
          <option value="years">Years</option>
        </select>
      </motion.div>
    </div>
  );

  // Updated species and breed selection section
  const speciesAndBreedSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Species
        </label>
        <select
          name="species"
          value={formData.species}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
          required
          disabled={isLoadingSpecies}
        >
          <option value="">Select Species</option>
          {species.map((item) => (
            <option key={item._id || item.name} value={item.name}>
              {item.icon && `${item.icon} `}
              {item.displayName || item.name}
            </option>
          ))}
        </select>
        {isLoadingSpecies && (
          <div className="mt-1 text-sm text-gray-500">Loading species...</div>
        )}
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        initial={{ opacity: formData.species ? 1 : 0 }}
        animate={{ opacity: formData.species ? 1 : 0 }}
        className={!formData.species ? "hidden" : ""}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Breed
        </label>
        <select
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
          required
          disabled={isLoadingBreeds || !formData.species}
        >
          <option value="">Select Breed</option>
          {availableBreeds.map((breed) => (
            <option key={breed._id || breed.name} value={breed.name}>
              {breed.name.charAt(0).toUpperCase() + breed.name.slice(1)}
            </option>
          ))}
        </select>
        {isLoadingBreeds && (
          <div className="mt-1 text-sm text-gray-500">Loading breeds...</div>
        )}
        {availableBreeds.length === 0 &&
          formData.species &&
          !isLoadingBreeds && (
            <div className="mt-1 text-sm text-amber-600">
              No breeds found for this species. You can still continue with a
              custom breed.
            </div>
          )}
      </motion.div>
    </div>
  );

  // Add loading overlay
  const renderLoadingOverlay = () => {
    if (!isSubmitting) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
          <div className="mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto"
            />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            Creating Post
          </h3>
          <p className="text-gray-600 mb-4">
            Please wait while we upload your images and create your listing...
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {uploadProgress}% complete
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-24 px-4 mb-10 bg-gradient-to-br from-green-50 to-emerald-100 border-t-2 border-black rounded-t-2xl"
    >
      {/* Add loading overlay */}
      {renderLoadingOverlay()}

      <div className="w-full bg-white rounded-t-3xl shadow-xl shadow-b-none p-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-8">
          Create New Pet Listing
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div className="mb-8">
            <p className="text-gray-700 mb-4 font-medium">
              Upload Pet Images (Max 5)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {selectedImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <img
                    src={image}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded-xl shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              ))}
              {selectedImages.length < 5 && (
                <label className="w-full h-32 border-2 border-dashed border-green-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="text-green-500 flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Add Image
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Pet Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pet Name
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
              />
            </motion.div>
          </div>

          {/* Species and Breed Selection */}
          {speciesAndBreedSection}

          {/* Age Section - New Structured Format */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-700">Pet Age</h3>
            {ageInputSection}
          </div>

          {/* Description */}
          <motion.div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
              placeholder="Tell us about your pet's personality, habits, and any special needs..."
            ></textarea>
          </motion.div>

          {/* Price Section */}
          <div className="mb-8">
            <motion.div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 focus:border-emerald-300 transition-all duration-300"
              />
            </motion.div>

            {/* Negotiable Option */}
            <div className="mt-4">
              <label className="flex items-center space-x-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleInputChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">
                  Price is negotiable
                </span>
              </label>
            </div>
          </div>

          {/* Address Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Address Details
            </h3>
            {user && user.addresses && user.addresses.length > 0 ? (
              <div>
                <h4 className="text-lg font-medium mb-2 text-gray-700">
                  Select an address:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.addresses.map((address) => (
                    <motion.div
                      key={address._id}
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <AddressItem
                        address={address}
                        onClick={() => handleAddressSelect(address)}
                        isSelected={
                          selectedAddress && selectedAddress._id === address._id
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                No addresses found. Please add a new address.
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
            >
              {showNewAddressForm ? "Cancel" : "Add New Address"}
            </motion.button>

            {showNewAddressForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4 bg-green-50 p-6 rounded-xl shadow-inner"
              >
                <AddressForm onAddressAdded={handleNewAddressSubmit} />
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              type="submit"
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              disabled={isSubmitting}
              className={`brand-button px-3 bg-green-500 flex items-center gap-2 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;
