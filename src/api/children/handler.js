const ClientError = require("../../exceptions/ClientError");

class ChildrenHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postChildHandler = this.postChildHandler.bind(this);
    this.getChildrenByUserIdHandler =
      this.getChildrenByUserIdHandler.bind(this);
    this.deleteChildByIdHandler = this.deleteChildByIdHandler.bind(this);
  }

  async postChildHandler(request, h) {
    try {
      this._validator.validateChildPayload(request.payload);
      const { fullname, birth_date, age, gender } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const child_id = await this._service.addChild({
        fullname,
        birth_date,
        age,
        gender,
        user_id: credentialId,
      });

      const response = h.response({
        status: "success",
        message: "Anak berhasil ditambahkan",
        data: {
          child_id,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // server error
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami",
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getChildrenByUserIdHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const children = await this._service.getChildrenByUserId(credentialId);

      return {
        status: "success",
        data: {
          children,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // server error
      const response = h.response({
        status: "error",
        message: error.message,
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteChildByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyChildParent(id, credentialId);
      await this._service.deleteChildById(id);

      return {
        status: "success",
        message: "Anak berhasil dihapus",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });

        response.code(error.statusCode);
        return response;
      }

      // server error
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami",
      });

      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ChildrenHandler;
