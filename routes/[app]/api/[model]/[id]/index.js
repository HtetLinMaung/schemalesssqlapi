const { brewBlankExpressFunc } = require("code-alchemy");
const setModel = require("../../../../../middlewares/set-model");
const generateWhere = require("../../../../../utils/generate-where");

const getById = async (req) => {
  let data = null;
  if (req.Model) {
    const findOptions = {
      where: {
        id: req.params.id,
      },
    };
    if (req.query.$select) {
      req.query["$attributes"] = req.query.$select;
    }
    if (req.query.$attributes) {
      findOptions["attributes"] = JSON.parse(req.query.$attributes);
    }
    if (req.query.$where) {
      findOptions["where"] = {
        ...generateWhere(req),
        ...findOptions.where,
      };
    }

    data = await req.Model.findOne(findOptions);
  }
  return data;
};

const handleGet = async (req, res) => {
  const data = await getById(req);
  if (!data) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }

  const resBody = {
    code: 200,
    message: "Data fetched successfully.",
    data,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleUpdate = async (req, res) => {
  const data = await getById(req);
  if (!data) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  for (const [k, v] of Object.entries(req.body)) {
    data[k] = v;
  }
  await data.save();

  const resBody = {
    code: 200,
    message: "Updated succesfully.",
    data,
  };
  console.log(resBody);
  res.json(resBody);
};

const handleDelete = async (req, res) => {
  const data = await getById(req);
  if (!data) {
    const resBody = {
      code: 404,
      message: "Data not found!",
    };
    console.log(resBody);
    return res.status(404).json(resBody);
  }
  await data.destroy();
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
