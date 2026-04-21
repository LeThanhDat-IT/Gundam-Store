const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error)
      return res.status(400).json({
        status: "fail",
        message: "Validation Error",
        errors: error?.details.map((err) => ({
          path: err.path.join(),
          message: err.message,
        })),
      });
    req.body = value;
    next();
  };
};
module.exports = validate;
