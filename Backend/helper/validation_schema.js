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
  title: Joi.string().required(),
  discription: Joi.string().required(),
  type: Joi.string().valid("free", "paid").default("free"),
  amount: Joi.number().when('type', {
    is: 'paid',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  category: Joi.string().required(),
  species: Joi.string().required(),
  userId: Joi.string().required(),
  addressId: Joi.string().required(),
  images: Joi.array().items(Joi.string().dataUri()).max(5)
});

const post_update_validation = Joi.object({
  title: Joi.string().required(),
  discription: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  type: Joi.string().valid("free", "paid").default("free"),
  category: Joi.string().required(),
  species: Joi.string().required(),
  userId: Joi.string().required()
});

module.exports = {
  signup_auth,
  post_validation,
  login_auth,
  post_update_validation
}