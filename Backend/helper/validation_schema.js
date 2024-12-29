const Joi = require("joi");

const signup_auth = Joi.object({
  firstname: Joi.string().min(3).max(30).required(),
  lastname : Joi.string().min(3).max(30).required(),
  email :Joi.string().email().required(),
  role : Joi.string().valid("user").required(),
  password : Joi.string().min(6).max(20).required(),
  gender : Joi.string().valid("male", "female", "custom").required(),
});

const login_auth = Joi.object({
  email :Joi.string().email().required(),
  password : Joi.string().min(6).max(20).required(),
});

const post_validation = Joi.object({
  title : Joi.string().min(10).max(80).required(),
  userid: Joi.string().max(24).required(),
  sessionid: Joi.string().max(36),
  discription : Joi.string().min(60).max(150).required(),
  amount : Joi.number().max(10000000000000),
  type : Joi.string().valid("free" , "paid").required(),
  category : Joi.string().min(1).max(20).required(),
  species : Joi.string().min(1).max(18),
  
})


module.exports = {
  signup_auth,
  post_validation,
  login_auth
}