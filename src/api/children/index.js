const ChildrenHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "children",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const childrenHandler = new ChildrenHandler(service, validator);
    server.route(routes(childrenHandler));
  },
};
