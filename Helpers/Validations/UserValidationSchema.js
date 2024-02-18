const Joi = require("joi");

const RegisterUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits` })
    .required(),
  password: Joi.string()
    .min(8)
    .max(25)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .messages({
      "string.pattern.base": `Password shoud have at least 1 upper case letter, one lower case letter, 1 number and 1 special character, and should be at least 8 character long`,
    })
    .required(),
});

const loginSchema = Joi.object({
  phone: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .messages({ "string.pattern.base": `Phone number must have 10 digits` }),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .min(8)
    .max(25)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .messages({
      "string.pattern.base": `Password shoud have at least 1 upper case letter, one lower case letter, 1 number and 1 special character, and should be at least 8 character long`,
    })
    .required(),
});

const sendOtpSchema = Joi.object({
  phone: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^[0-9]+$/)
    .messages({ "string.pattern.base": `Invalid phone number.` }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .messages({
      "any.invalid": "Invalid email format",
      "string.max": "Email address is too long (max {#limit} characters)",
    }),
  type: Joi.string(),
});

const verifyOtpSchema = Joi.object({
  phone: Joi.string()
    .min(8)
    .max(15)
    .pattern(/^[0-9]+$/)
    .messages({ "string.pattern.base": `Invalid phone number.` }),
  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({ "string.pattern.base": `Otp number must have 4 digits` }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .messages({
      "any.invalid": "Invalid email format",
      "string.max": "Email address is too long (max {#limit} characters)",
    }),
});

module.exports = {
  RegisterUserSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
};
