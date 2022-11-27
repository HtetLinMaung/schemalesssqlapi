const { DataTypes } = require("sequelize");

const getSequelizeType = (v) => {
  if (typeof v == "string") {
    if (v.length > 255) {
      return DataTypes.TEXT;
    }
    return DataTypes.STRING;
  } else if (typeof v == "number") {
    if (v.toString().includes(".")) {
      return DataTypes.DOUBLE;
    }
    return DataTypes.INTEGER;
  } else if (typeof v == "boolean") {
    return DataTypes.BOOLEAN;
  } else {
    throw new Error("Unknow type!");
  }
};

const getSequelizeTypeToString = (v) => {
  if (typeof v == "string") {
    if (v.length > 255) {
      return "DataTypes.TEXT";
    }
    return "DataTypes.STRING";
  } else if (typeof v == "number") {
    if (v.toString().includes(".")) {
      return "DataTypes.DOUBLE";
    }
    return "DataTypes.INTEGER";
  } else if (typeof v == "boolean") {
    return "DataTypes.BOOLEAN";
  } else {
    throw new Error("Unknow type!");
  }
};

exports.getSequelizeType = getSequelizeType;
exports.getSequelizeTypeToString = getSequelizeTypeToString;
