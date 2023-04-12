import { createAjv } from "@jsonforms/core";

export const ajv = createAjv();

ajv.addKeyword("isNotEmpty", {
  type: "string",
  validate: function validate(schema, data) {

    if (typeof data === "string" && data.trim() !== "") {
      return true;
    }
    validate.errors = [
      {
        keyword: "isNotEmpty",
        message: "Cannot be empty",
        params: { keyword: "isNotEmpty" },
      },
    ];
    return false;
  },
  errors: true,
});