const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Association = sequelize.define(
  "association",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    modelA: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelB: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    options: {
      type: DataTypes.TEXT,
      defaultValue: JSON.stringify({}),
      get() {
        return JSON.parse(this.getDataValue("options"));
      },
      set(v) {
        this.setDataValue("options", JSON.stringify(v));
      },
    },
  },
  {
    tableName: "associations",
  }
);

module.exports = Association;
