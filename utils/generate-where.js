const { Op } = require("sequelize");

const generateWhere = (req) => {
  let where = {};
  for (const [k, v] of Object.entries(req.query)) {
    if (!k.startsWith("$")) {
      where[k] = v;
    }
  }
  if (req.query.$filter) {
    where = JSON.parse(req.query.$filter);
  }
  if ("$search" in req.query && req.query.$search && req.searchColumns) {
    where[Op.or] = req.searchColumns.map((column) => ({
      [column]: {
        [Op.like]: `%${req.query.$search}%`,
      },
    }));
  }
  return where;
};

module.exports = generateWhere;
