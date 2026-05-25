import { check, validationResult } from 'express-validator';

// Validation rules for registration
export const registerRules = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];

// Validation rules for login
export const loginRules = [
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
];

// Validation rules for items
export const itemRules = [
  check('title', 'Item title is required').notEmpty().trim(),
  check('description', 'Item description is required').notEmpty().trim(),
  check('type', 'Item type must be either "lost" or "found"').isIn(['lost', 'found']),
  check('location', 'Location is required').notEmpty().trim(),
];

// Middleware to inspect validation results and return formatted error messages
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};
