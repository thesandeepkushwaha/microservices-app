import { body } from "express-validator";

export const userDataValidators = [
  body("user")
    .isString()
    .withMessage("User name must be a string")
    .notEmpty()
    .withMessage("User name is required")
    .trim(),
  body("class")
    .isString()
    .withMessage("Class must be a string")
    .notEmpty()
    .withMessage("Class is required")
    .trim(),
  body("age")
    .isInt({ min: 0 })
    .withMessage("Age must be greater than or equal to 0")
    .notEmpty()
    .withMessage("Age is required"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required"),
];
