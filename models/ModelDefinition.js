const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ModelDefinition = sequelize.define(
  "ModelDefinition",
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schema: {
      type: DataTypes.TEXT,
      defaultValue: {},
      get() {
        return JSON.parse(this.getDataValue("schema"));
      },
      set(v) {
        this.setDataValue("schema", JSON.stringify(v));
      },
    },
    options: {
      type: DataTypes.TEXT,
      defaultValue: {},
      get() {
        return JSON.parse(this.getDataValue("options"));
      },
      set(v) {
        this.setDataValue("options", JSON.stringify(v));
      },
    },
    searchColumns: {
      type: DataTypes.TEXT,
      defaultValue: [],
      get() {
        return JSON.parse(this.getDataValue("searchColumns"));
      },
      set(v) {
        this.setDataValue("searchColumns", JSON.stringify(v));
      },
    },
  },
  {
    tableName: "modeldefinitions",
  }
);

module.exports = ModelDefinition;
