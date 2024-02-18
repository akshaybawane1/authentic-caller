const { Sequelize } = require("sequelize");
const sequelize = require("../Helpers/db_init");

const GlobalContact = sequelize.define("globalcontact", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING, allowNull: false },
  phone: {
    type: Sequelize.DOUBLE,
    allowNull: false, //Here we can have multiple contacts with same phone but we cannot register with same phone number
  },
  email: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  spamCount: {
    type: Sequelize.DOUBLE,
    defaultValue: 0,
  },
  isRegistered: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  personal_contact_of_id: {
    type: Sequelize.INTEGER,
  },
});

module.exports = GlobalContact;
