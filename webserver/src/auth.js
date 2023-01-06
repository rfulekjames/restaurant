'use strict';

import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const jwtSecret = process.env.JWT_SECRET;

export const JWT_SECRET = Buffer.from(jwtSecret, 'base64');

export function getAuthToken(userId, email, password) {
  if (email) {
    return jwt.sign({ sub: userId, email, password }, JWT_SECRET);
  } else {
    return jwt.sign({ sub: userId }, JWT_SECRET);
  }
}

export function getUserId(req) {
  if (req.auth) {
    return req.auth.sub;
  }
}

function getEmail(req) {
  if (req.auth) {
    return req.auth.email;
  }
}

function getPassword(req) {
  if (req.auth) {
    return req.auth.password;
  }
}
