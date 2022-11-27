const ModelDefinition = require("../models/ModelDefinition");
const sequelize = require("./database");
const dbSchemaToSchema = require("./dbSchema-to-schema");

module.exports = async (id) => {
  const modelDefinition = await ModelDefinition.findOne({
    where: {
      id,
    },
  });
  if (!modelDefinition) {
    return null;
  }

  try {
    return sequelize.model(modelDefinition.modelName);
  } catch (err) {
    return sequelize.define(
      modelDefinition.modelName,
      dbSchemaToSchema(modelDefinition.schema),
      {
        tableName: modelDefinition.modelName,
        ...modelDefinition.options,
      }
    );
  }
};
