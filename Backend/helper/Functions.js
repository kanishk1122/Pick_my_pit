const CryptoJS = require("crypto-js");
require("dotenv").config();



const decrepter = (data) => {
  return CryptoJS.AES.decrypt(data, process.env.CRYPTO_KEY).toString(
    CryptoJS.enc.Utf8
  );
};

const checksessionId = (token ,user)=>{

  if (token != user.sessionToken) {
    return res.status(401).json({
      msg: "Unauthorised user",
    });
  }
}

module.exports ={
    decrepter,
    checksessionId
}