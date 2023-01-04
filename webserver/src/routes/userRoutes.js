import express from 'express';
import { createUser, createUsername, getUsername, initUser, login } from '../controllers/userControllers.js';
import { body } from 'express-validator';

export const userRouter = express.Router();


userRouter
  .route('/init-registration')
  .post(body('email').isEmail(),
    body('password').isLength({ min: 7, max: 256 }),
    body('username').isLength({ min: 1, max: 256 }),
    initUser);

userRouter
  .route('/register')
  .post(
    body('email').isEmail(),
    body('password').isLength({ min: 7, max: 256 }),
    body('key').custom((key) => {
      if (!(key === process.env.FIREBASE_API_KEY)) {
        return Promise.reject("Wrong key!!!");
      } else {
        return Promise.resolve();
      }
    }),
    createUser);

userRouter
  .route('/username')
  .post(body('username').isLength({ min: 1, max: 256 }), createUsername)
  .get(getUsername);

userRouter
  .route('/login')
  .post(body('email').isEmail(), body('password').isLength({ min: 7, max: 256 }), login);
