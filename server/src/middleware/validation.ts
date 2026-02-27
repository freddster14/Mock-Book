import { body, ValidationChain, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";

export const handleValidation = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(409).json({ success: false, error: { type: "validation", data: errors.array() }})
  }
  next();
}


export const validateSignUp = [

  body('email')
    .trim()
    .notEmpty().withMessage('Required').bail()
    .isEmail().withMessage('Invalid email'),
  body('password')
    .notEmpty().withMessage('Required').bail()
    .isLength({ min: 6 }).withMessage('Minimum 6 characters')
    .matches(/[A-Z]/).withMessage('Uppercase is needed')
    .matches(/[\W]/).withMessage('Missing a special character'),
  body('confirm')
    .notEmpty().withMessage('Required')
    .custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error('Does not match')
      }
      return true;
    })
]

export const validateProfile = [
  body('username')
  .trim()
  .notEmpty().withMessage("Required"),
  body('bio')
    .trim()
    .isString().withMessage('Must be a string')
]

export const validateSignIn = [
  body('identifier')
    .trim()
    .notEmpty().withMessage('Email or Username required'),
  body('password')
    .notEmpty().withMessage('Password required')
]

export const validatePost = [
  body('content')
    .trim()
    .notEmpty().withMessage("Required").bail()
    .isLength({ max: 300 }).withMessage("Max 300 characters")
    .isString().withMessage("Invalid content"),
  body('imgUrl')
    .trim()
    .isString().withMessage("Could not load image")
]

export const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage("Required").bail()
    .isLength({ max: 200 }).withMessage("Max 200 characters")
    .isString().withMessage("Invalid content")
]