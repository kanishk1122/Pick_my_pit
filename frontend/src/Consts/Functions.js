import CryptoJS from "crypto-js";


const validatePassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    const isValid = regex.test(password);

    
    return regex.test(password);
  };
  const validatepasswordstring = (password) => {
    const regex = /^[a-zA-Z]+$/;
    const isValid = regex.test(password);
    return isValid;
  };
  const validatepasswordnumber = (password) => {
    const regex = /^[0-9]+$/;
    const isValid = regex.test(password);
    return isValid;
  };

  const validatepasswordspecial = (password) => {
    const regex = /^[!@#\$%\^\&*\)\(+=._-]+$/;
    const isValid = regex.test(password);
    return isValid;
  }

  export const encrypter = (data) => {
    try {
      // Ensure data is a string
      const dataString = typeof data === 'string' ? data : JSON.stringify(data);
      return CryptoJS.AES.encrypt(dataString, import.meta.env.VITE_REACT_APP_CRYPTO_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  };

  


  export { validatePassword, validatepasswordstring, validatepasswordnumber, validatepasswordspecial };