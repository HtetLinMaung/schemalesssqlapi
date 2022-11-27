const { brewBlankExpressFunc } = require("code-alchemy");
const setModel = require("../../../../middlewares/set-model");
const ModelDefinition = require("../../../../models/ModelDefinition");
const sequelize = require("../../../../utils/database");
const generateWhere = require("../../../../utils/generate-where");
const jsonToSchema = require("../../../../utils/json-to-schema");

const handleGet = async (req, res) => {
  let data = [];
  let total = 0;
  let page = 1;
  let perpage = 0;
  let pagecount = 0;

  if (req.Model) {
    const findOptions = {};
    const where = await generateWhere(req);
    if (req.query.$projections) {
      req.query["$attributes"] = req.query.$projections;
    }
    if (req.query.$select) {
      req.query["$attributes"] = req.query.$select;
    }
    if (req.query.$attributes) {
      findOptions["attributes"] = JSON.parse(req.query.$attributes);
    }
    if (req.query.$filter) {
      req.query["$where"] = req.query.$filter;
    }
    if (req.query.$where || req.query.$search || Object.keys(where).length) {
      findOptions["where"] = where;
    }
    if (req.query.$sort) {
      req.query["$order"] = req.query.$sort;
    }
    if (req.query.$order) {
      findOptions["order"] = JSON.parse(req.query.$order);
    }

    if (req.query.$page && req.query.$perpage) {
      perpage = parseInt(req.query.$perpage);
      page = parseInt(req.query.$page);
      findOptions["limit"] = perpage;
      findOptions["offset"] = (page - 1) * perpage;
      const { rows, count } = await req.Model.findAndCountAll(findOptions);
      total = count;
      data = rows;
    } else {
      data = await req.Model.findAll(findOptions);
    }

    if (!total) {
      total = data.length;
    }
    if (!perpage) {
      perpage = total;
    }
  }

  if (!total && !perpage) {
    pagecount = 0;
  } else {
    pagecount = Math.ceil(total / perpage);
  }
  const resBody = {
    code: 200,
    message: "Data fetched successfully.",
    data,
    total,
    page,
    perpage,
    pagecount,
  };
  console.log(resBody);
  res.json(resBody);
};

const handlePost = async (req, res) => {
  if (!req.Model) {
    const { model } = req.params;
    const [schemaBody, dbSchemaBody, searchColumns] = jsonToSchema(
      req.body || {}
    );
    ModelDefinition.create({
      schema: dbSchemaBody,
      modelName: model,
      searchColumns,
      options: {
        tableName: model,
      },
    });
    req.searchColumns = searchColumns;
    req.Model = sequelize.define(model, schemaBody, { tableName: model });
    await req.Model.sync();
  }
  const data = await req.Model.create(req.body || {});
  const resBody = {
    code: 200,
    message: "Data created successful!",
    data,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleUpdate = async (req, res) => {
  if (!req.Model) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  const findOptions = {};
  const where = await generateWhere(req);
  if (req.query.$filter) {
    req.query["$where"] = req.query.$filter;
  }
  if (req.query.$where || req.query.$search || Object.keys(where).length) {
    findOptions["where"] = where;
  }
  await req.Model.update(req.body, findOptions);
  const resBody = {
    code: 200,
    message: "Updated succesfully.",
  };
  console.log(resBody);
  res.json(resBody);
};

const handleDelete = async (req, res) => {
  if (!req.Model) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  const findOptions = {};
  const where = await generateWhere(req);
  if (req.query.$filter) {
    req.query["$where"] = req.query.$filter;
  }
  if (req.query.$where || req.query.$search || Object.keys(where).length) {
    findOptions["where"] = where;
  }
  await req.Model.destroy(findOptions);
  const resBody = {
    code: 204,
    message: "Deleted succesfully.",
  };
  console.log(resBody);
  res.json(resBody);
};

module.exports = brewBlankExpressFunc(async (req, res) => {
  if (req.params.app != process.env.route_prefix) {
    const resBody = "Not Found!";
    console.log(resBody);
    return res.status(404).send(resBody);
  }
  await setModel(req);
  switch (req.method.toLowerCase()) {
    case "post":
      await handlePost(req, res);
      break;
    case "put":
    case "patch":
      await handleUpdate(req, res);
      break;
    case "delete":
      await handleDelete(req, res);
      break;
    default:
      await handleGet(req, res);
  }
});
