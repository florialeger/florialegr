const { body, validationResult } = require("express-validator");

const validateMessage = [
  body("subject").isString().notEmpty().withMessage("Subject is required."),
  body("name").isString().notEmpty().withMessage("Name is required."),
  body("from")
    .isEmail()
    .withMessage("A valid email address is required."),
  body("message").isString().notEmpty().withMessage("Message is required."),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateMessage, handleValidationErrors };