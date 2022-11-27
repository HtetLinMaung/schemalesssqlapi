const { Op } = require("sequelize");
const ModelDefinition = require("../models/ModelDefinition");

const generateWhere = async (req) => {
  let where = {};
  for (const [k, v] of Object.entries(req.query)) {
    if (!k.startsWith("$")) {
      where[k] = v;
    }
  }
  if (req.query.$filter) {
    where = JSON.parse(req.query.$filter);
  }
  if (req.query.$search) {
    if (!req.searchColumns) {
      const modelDefinition = await ModelDefinition.findOne({
        where: {
          modelName: req.params.model,
        },
      });
      req.searchColumns = modelDefinition.searchColumns;
    }
    where[Op.or] = req.searchColumns.map((column) => ({
      [column]: {
        [Op.like]: `%${req.query.$search}%`,
      },
    }));
  }
  return where;
};

module.exports = generateWhere;
