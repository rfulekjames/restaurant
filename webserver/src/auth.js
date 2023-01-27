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
  apiKey: process.env.FIREBASE_API_KEY ? process.env.FIREBASE_API_KEY : 'Fake-Api-Key',
  projectId: process.env.PROJECT_ID ? process.env.PROJECT_ID : 'test',
};

initializeApp(firebaseConfigVariables);

const auth = getAuth();

if (process.env.ENV === 'dev') {
  connectAuthEmulator(auth, `http://localhost:${authEmulatorPort}`);
}

const privateKey =  process.env.JWT_PRIVATE_KEY;
export const publicKey = process.env.JWT_PUBLIC_KEY;

export function getAuthToken(userId, email, password) {
  return jwt.sign({ userId, email, password }, privateKey, { algorithm: 'RS256' });
}

export function getUserId(req) {
  if (req.auth) {
    return req.auth.userId;
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
