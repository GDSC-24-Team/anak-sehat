const Joi = require("joi");

const ChildPayloadSchema = Joi.object({
  fullname: Joi.string().required(),
  birth_date: Joi.string().required(),
  age: Joi.number().required(),
  gender: Joi.string().required(),
});

module.exports = {
  ChildPayloadSchema,
};
