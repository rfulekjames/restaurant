'use strict';

import { validationResult } from 'express-validator';

export function setFirebaseErrorResponse(res, error) {
  if (error.customData?._tokenResponse) {
    const code = error.customData._tokenResponse.error.code;
    res.status(code);
  } else if (error.code && error.code.startsWith('auth/wrong-password')) {
    res.status(401);
  } else if (error.code && error.code.startsWith('auth/too-many-requests')) {
    res.status(429);
  } else {
    res.status(500);
  }
  res.json({ errorCode: error.code });
}

export function validateRequest(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    const message = errors.array().reduce((msg, err) => `${msg}|${err.value}:${err.msg}`, '');
    res.json({ errorCode: message });
    return false;
  }
  return true;
}
