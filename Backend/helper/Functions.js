const CryptoJS = require("crypto-js");
require("dotenv").config();



const decrepter = (data) => {
  return CryptoJS.AES.decrypt(data, process.env.CRYPTO_KEY).toString(
    CryptoJS.enc.Utf8
  );
};


module.exports ={
    decrepter
}