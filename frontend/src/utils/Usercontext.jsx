import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import PropTypes from "prop-types";
import { ADDRESS, USER } from "../Consts/apikeys";
import axios from "axios";

const usercontext = createContext();

export const UserProvide = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [addressPagination, setAddressPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAddresses: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchUseraddresses = async (userData, page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      if (!userData?.id) {
        console.error('No valid user ID available');
        return;
      }

      const response = await axios.get(`${ADDRESS.Get(userData.id)}?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${userData.sessionToken}`,
          userid: userData.id
        }
      });
      console.log('Address fetch response:', response.data);
      
      if (response?.data?.success) {
        setUser(prev => ({
          ...prev,
          addresses: response.data.addresses
        }));
        setAddressPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndUpdateUserData = useCallback(async (user) => {
    if (user && user.id) {
      try {
        const response = await axios.get(`${USER.FetchUser}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${user.sessionToken}`,
            userid: user.id,
          },
        });
        if (response.data.success) {
          const updatedUser = response.data.user;
          setUser(updatedUser);
          
          // Encrypt and save to cookie
          const encryptedUser = CryptoJS.AES.encrypt(
            JSON.stringify(updatedUser),
            import.meta.env.VITE_REACT_APP_CRYPTO_KEY
          ).toString();
          Cookies.set("Userdata", encryptedUser, { expires: 150 });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const userdata = Cookies.get("Userdata");
      if (userdata) {
        const decryptdata = CryptoJS.AES.decrypt(
          userdata,
          import.meta.env.VITE_REACT_APP_CRYPTO_KEY
        ).toString(CryptoJS.enc.Utf8);

        const userData = JSON.parse(decryptdata);
        setUser(userData);
        fetchUseraddresses(userData);
        fetchAndUpdateUserData(userData);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);



  const value = {
    user,
    setUser,
    fetchUseraddresses,
    isLoading,
    addressPagination,
    fetchAndUpdateUserData
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <usercontext.Provider value={value}>
      {children}
    </usercontext.Provider>
  );
};
UserProvide.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUser = () => {
  return useContext(usercontext);
};
