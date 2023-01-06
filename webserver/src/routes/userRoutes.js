'use strict';

import express from 'express';
import { createUser, createUsername, getUsername, login } from '../controllers/userControllers.js';
import { body } from 'express-validator';

export const userRouter = express.Router();


userRouter
  .route('/register')
  .post(body('email').isEmail(), body('password').isLength({ min: 7, max: 256 }), createUser);

userRouter
  .route('/username')
  .post(body('username').isLength({ min: 1, max: 256 }), createUsername)
  .get(getUsername);

userRouter
  .route('/login')
  .post(body('email').isEmail(), body('password').isLength({ min: 7, max: 256 }), login);
