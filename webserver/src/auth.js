'use strict';

import jwt from 'jsonwebtoken';
import { config } from 'dotenv';


import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
}  from "firebase/auth";

import { initializeApp } from 'firebase/app';


export const authEmulatorPort = 9099;

config();

export const firebaseConfigVariables = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.PROJECT_ID,
};

initializeApp(firebaseConfigVariables);

const auth = getAuth();

if (process.env.ENV === 'dev') {
  connectAuthEmulator(auth, `http://localhost:${authEmulatorPort}`);
}

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

export async function createUser(email, password) {
  return await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
}

export async function signIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}  
