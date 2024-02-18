const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("authentic-caller", "root", "P@ssw0rd", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
