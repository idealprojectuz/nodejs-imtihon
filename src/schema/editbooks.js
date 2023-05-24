const Joi = require("joi");
module.exports = Joi.object({
  title: Joi.string().required(),
  category: Joi.string().required(),
  authorId: Joi.number().required(),
});
