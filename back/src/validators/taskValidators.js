const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
  
  body('parentTaskId')
    .optional()
    .isInt()
    .withMessage('Parent task ID must be an integer')
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 255 })
    .withMessage('Title must be less than 255 characters'),
    
  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
    .withMessage('Status must be either TODO, IN_PROGRESS, or DONE'),
  
  body('parentTaskId')
    .optional()
    .isInt()
    .withMessage('Parent task ID must be an integer')
];

module.exports = {
  createTaskValidator,
  updateTaskValidator
}; 