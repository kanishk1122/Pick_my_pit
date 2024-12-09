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

  function encrypter(data) {
    const cryptoKey = import.meta.env.VITE_REACT_APP_CRYPTO_KEY;
    return CryptoJS.AES.encrypt(data, cryptoKey).toString();
  }

  


  export { validatePassword, validatepasswordstring, validatepasswordnumber, validatepasswordspecial ,encrypter };