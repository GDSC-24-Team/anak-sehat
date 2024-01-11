const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  fullname: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  gender: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
