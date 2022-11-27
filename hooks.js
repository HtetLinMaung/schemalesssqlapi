const { Op } = require("sequelize");
const Association = require("./models/Association");
const ModelDefinition = require("./models/ModelDefinition");
const connectSequelize = require("./utils/connect-sequelize");
const sequelize = require("./utils/database");

exports.afterMasterProcessStart = async () => {
  await connectSequelize();
  await sequelize.sync();
  await sequelize.sync({ alter: true });
  let [md] = await ModelDefinition.findOrCreate({
    where: { modelName: "modeldefinition" },
    defaults: {
      modelName: "modeldefinition",
      schema: {
        id: {
          type: "DataTypes.STRING",
          defaultValue: "DataTypes.UUIDV4",
          primaryKey: true,
        },
        modelName: {
          type: "DataTypes.STRING",
          allowNull: false,
        },
        schema: {
          type: "DataTypes.TEXT",
          defaultValue: JSON.stringify({}),
          get: function () {
            return JSON.parse(this.getDataValue("schema"));
          }.toString(),
          set: function (v) {
            this.setDataValue("schema", JSON.stringify(v));
          }.toString(),
        },
        options: {
          type: "DataTypes.TEXT",
          defaultValue: JSON.stringify({}),
          get: function () {
            return JSON.parse(this.getDataValue("options"));
          }.toString(),
          set: function (v) {
            this.setDataValue("options", JSON.stringify(v));
          }.toString(),
        },
        searchColumns: {
          type: "DataTypes.TEXT",
          defaultValue: JSON.stringify([]),
          get: function () {
            return JSON.parse(this.getDataValue("searchColumns"));
          }.toString(),
          set: function (v) {
            this.setDataValue("searchColumns", JSON.stringify(v));
          }.toString(),
        },
      },
      options: {
        tableName: "modeldefinitions",
      },
      searchColumns: ["id", "modelName"],
    },
  });
  let [association] = await ModelDefinition.findOrCreate({
    where: { modelName: "association" },
    defaults: {
      modelName: "association",
      schema: {
        id: {
          type: "DataTypes.STRING",
          defaultValue: "DataTypes.UUIDV4",
          primaryKey: true,
        },
        modelA: {
          type: "DataTypes.STRING",
          allowNull: false,
        },
        modelB: {
          type: "DataTypes.STRING",
          allowNull: false,
        },
        type: {
          type: "DataTypes.STRING",
          allowNull: false,
        },
        options: {
          type: "DataTypes.TEXT",
          defaultValue: JSON.stringify({}),
          get: function () {
            return JSON.parse(this.getDataValue("options"));
          }.toString(),
          set: function (v) {
            this.setDataValue("options", JSON.stringify(v));
          }.toString(),
        },
      },
      options: {
        tableName: "associations",
      },
      searchColumns: ["id", "type", "modelA", "modelB"],
    },
  });
  await Association.destroy({
    where: {
      [Op.or]: [
        {
          modelA: md.id,
        },
        {
          modelB: md.id,
        },
        {
          modelA: association.id,
        },
        {
          modelB: association.id,
        },
      ],
    },
  });
  await Association.findOrCreate({
    where: {
      modelA: md.id,
      modelB: association.id,
      type: "hasMany",
      options: JSON.stringify({ foreignKey: "modelA" }),
    },
  });
  await Association.findOrCreate({
    where: {
      modelA: md.id,
      modelB: association.id,
      type: "hasMany",
      options: JSON.stringify({ foreignKey: "modelB" }),
    },
  });
  await Association.findOrCreate({
    where: {
      modelA: association.id,
      modelB: md.id,
      type: "belongsTo",
      options: JSON.stringify({ foreignKey: "modelA" }),
    },
  });
  await Association.findOrCreate({
    where: {
      modelA: association.id,
      modelB: md.id,
      type: "belongsTo",
      options: JSON.stringify({ foreignKey: "modelB" }),
    },
  });
};
