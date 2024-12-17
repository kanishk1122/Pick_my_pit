const Joi = require("joi");

const signup_auth = Joi.object({
  firstname: Joi.string().min(3).max(30).required(),
  lastname : Joi.string().min(3).max(30).required(),
  email :Joi.string().email().required(),
  role : Joi.string().valid("user").required(),
  password : Joi.string().min(6).max(20).required(),
  gender : Joi.string().valid("male", "female", "custom").required(),
});

const post_validation = Joi.object({
  title : Joi.string().min(10).max(80).required(),
  discription : Joi.string().min(60).max(150).required(),
  amount : Joi.number().max(10),
  
})


module.exports = {
  signup_auth,
  post_validation
}