import jwt from 'jsonwebtoken';
import { configVariables } from './reservation.js';
export const JWT_SECRET = Buffer.from(configVariables.jwtSecret, 'base64');

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
  