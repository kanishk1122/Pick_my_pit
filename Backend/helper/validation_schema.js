const Joi = require("joi");

const authschema = Joi.object({
  firstname: Joi.string().min(3).max(30).required(),
  lastname : Joi.string().min(3).max(30).required(),
  email :Joi.string().email().required(),
  password : Joi.string().min(6).max(10).required(),
  gender : Joi.string().valid("male", "female", "custom").required(),
});
