const { DataTypes } = require("sequelize");

DataTypes;
const dbSchemaToSchema = (json) => {
  const schemaBody = {};
  for (const [k, v] of Object.entries(json)) {
    if (typeof v == "object") {
      if ("type" in v) {
        v.type = eval(v.type);
      }
      if (
        "defaultValue" in v &&
        typeof v.defaultValue == "string" &&
        v.defaultValue.includes("DataTypes")
      ) {
        v.defaultValue = eval(v.defaultValue);
      }
      if ("get" in v) {
        v.get = eval(v.get);
      }
      if ("set" in v) {
        v.set = eval(v.set);
      }
      schemaBody[k] = v;
    } else {
      schemaBody[k] = eval(v);
    }
  }
  return schemaBody;
};

module.exports = dbSchemaToSchema;
