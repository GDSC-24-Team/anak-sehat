const InvariantError = require("../../exceptions/InvariantError");
const { ChildPayloadSchema } = require("./schema");

const ChildrenValidator = {
  validateChildPayload: (payload) => {
    const validationResult = ChildPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = ChildrenValidator;
