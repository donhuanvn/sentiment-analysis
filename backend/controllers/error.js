const { send } = require("express/lib/response");

exports.get404 = (req, res, next) => {
  res.status(404).send(`
    <h1>PAGE NOT FOUND</h1>
  `);
}
