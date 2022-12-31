import jwt from 'jsonwebtoken';
export const JWT_SECRET = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

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
  