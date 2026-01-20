// validators.js
const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const validateRegistration = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  const firstError = errors.array()[0].msg;
  return res.redirect(`/chinmudra/register?error=${encodeURIComponent(firstError)}`);
}

    next();
  },
];

module.exports = { validateRegistration };
