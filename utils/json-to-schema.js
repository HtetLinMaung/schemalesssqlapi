const { DataTypes } = require("sequelize");
const {
  getSequelizeTypeToString,
  getSequelizeType,
} = require("./get-sequelize-type");

const jsonToSchema = (json) => {
  let schemaBody = {};
  let dbSchemaBody = {};

  if (!json.id) {
    schemaBody["id"] = {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    };
    dbSchemaBody["id"] = {
      type: "DataTypes.STRING",
      defaultValue: "DataTypes.UUIDV4",
      primaryKey: true,
    };
  }

  const searchColumns = [];
  for (const [k, v] of Object.entries(json)) {
    if (typeof v == "string") {
      searchColumns.push(k);
    }
    schemaBody[k] = {
      type: getSequelizeType(v),
    };
    dbSchemaBody[k] = {
      type: getSequelizeTypeToString(v),
    };
  }

  return [schemaBody, dbSchemaBody, searchColumns];
};

module.exports = jsonToSchema;
