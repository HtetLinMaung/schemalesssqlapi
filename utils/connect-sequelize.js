const sequelize = require("./database");

module.exports = async () => {
  await sequelize.authenticate();
};
