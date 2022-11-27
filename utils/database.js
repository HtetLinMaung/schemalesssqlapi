const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.db_connection);

module.exports = sequelize;
