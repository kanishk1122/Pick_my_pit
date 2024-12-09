import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import PropTypes from "prop-types";

const usercontext = createContext();

export const UserProvide = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userdata = Cookies.get("Userdata");
      if (userdata) {
        const decryptedPassword = CryptoJS.AES.decrypt(
          userdata,
          import.meta.env.VITE_REACT_APP_CRYPTO_KEY
        ).toString(CryptoJS.enc.Utf8);

        console.log(JSON.parse(decryptedPassword));
        setUser(JSON.parse(decryptedPassword));
      }
    } catch (error) {
      console.log(error);
    }
  }, [Cookies.get("Userdata")]);

    return (
      <usercontext.Provider value={{ user, setUser }}>
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
