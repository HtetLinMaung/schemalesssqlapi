const ModelDefinition = require("./models/ModelDefinition");
const connectSequelize = require("./utils/connect-sequelize");
const sequelize = require("./utils/database");

exports.afterMasterProcessStart = async () => {
  await connectSequelize();
  await sequelize.sync();
  await ModelDefinition.findOrCreate({
    where: { modelName: "ModelDefinition" },
    defaults: {
      modelName: "ModelDefinition",
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
};
