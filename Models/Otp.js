const { Sequelize } = require("sequelize");
const sequelize = require("../Helpers/db_init");

const Otp = sequelize.define("otp", {
  otp: { type: Sequelize.STRING, allowNull: false },
  phone: {
    type: Sequelize.DOUBLE, //For simplicity I haven't configured otp sending over phone, but we can integrate twilio or other sms api for the same
  },
  email: {
    type: Sequelize.STRING,
  },
});

module.exports = Otp;
