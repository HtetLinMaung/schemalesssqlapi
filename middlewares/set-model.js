const ModelDefinition = require("../models/ModelDefinition");
const connectSequelize = require("../utils/connect-sequelize");
const sequelize = require("../utils/database");
const dbSchemaToSchema = require("../utils/dbSchema-to-schema");

module.exports = async (req) => {
  console.log({
    body: req.body,
    query: req.query,
    params: req.params,
    url: req.url,
    path: req.path,
    method: req.method,
    headers: req.headers,
  });
  const { model } = req.params;
  await connectSequelize();
  try {
    req.Model = sequelize.model(model);
  } catch (err) {
    req.Model = null;
  }

  if (!req.Model) {
    const modelDefinition = await ModelDefinition.findOne({
      where: {
        modelName: model,
      },
    });
    if (modelDefinition) {
      req.Model = sequelize.define(
        model,
        dbSchemaToSchema(modelDefinition.schema),
        {
          tableName: model,
          ...modelDefinition.options,
        }
      );
      req.searchColumns = modelDefinition.searchColumns;
      await req.Model.sync();
    }
  }
};
