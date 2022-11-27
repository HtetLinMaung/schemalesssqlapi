const { Op } = require("sequelize");
const Association = require("../models/Association");
const ModelDefinition = require("../models/ModelDefinition");
const connectSequelize = require("../utils/connect-sequelize");
const sequelize = require("../utils/database");
const dbSchemaToSchema = require("../utils/dbSchema-to-schema");
const mdToModelById = require("../utils/md-to-model-by-id");

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

      const associations = await Association.findAll({
        where: {
          [Op.or]: [
            {
              modelA: modelDefinition.id,
            },
            {
              modelB: modelDefinition.id,
            },
          ],
        },
      });
      await req.Model.sync();
      for (const association of associations) {
        const ModelA = await mdToModelById(association.modelA);
        const ModelB = await mdToModelById(association.modelB);
        await ModelA.sync();
        await ModelB.sync();
        await ModelA.sync({ alter: true });
        await ModelB.sync({ alter: true });
        ModelA[association.type](ModelB, association.options);
      }
    }
  }
};
