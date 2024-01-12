const routes = (handler) => [
  {
    method: "POST",
    path: "/children",
    handler: handler.postChildHandler,
    options: {
      auth: "anaksehat_jwt",
    },
  },
  {
    method: "GET",
    path: "/children",
    handler: handler.getChildrenByUserIdHandler,
    options: {
      auth: "anaksehat_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/children/{id}",
    handler: handler.deleteChildByIdHandler,
    options: {
      auth: "anaksehat_jwt",
    },
  },
];

module.exports = routes;
