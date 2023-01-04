import { setFirebaseErrorResponse, validateRequest } from "../errorhandling.js";
import { getAuthToken, getUserId } from "../auth.js";
import { reservationRepository } from '../reservation.js';


export const initUser = async (req, res) => {
  if (!validateRequest(req, res)) return;
  const { username, email, password } = req.body;
  try {
    await reservationRepository.initUser(username, email, password);
    res.json({});
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const createUser = async (req, res) => {
  if (!validateRequest(req, res)) return;
  const { email, password } = req.body;
  try {
    const userCredential = await reservationRepository.createUser(email, password);
    res.json({ userId: userCredential.user.uid, accessToken: getAuthToken(userCredential.user.uid, email, password) });
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const createUsername = async (req, res) => {
  if (!validateRequest(req, res)) return;
  const { username } = req.body;
  try {
    await reservationRepository.createUsername(getUserId(req), username);
    res.json({});
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const getUsername = async (req, res) => {
  try {
    const username = await reservationRepository.getUsername(getUserId(req));
    res.json({ username });
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const login = async (req, res) => {
  if (!validateRequest(req, res)) return;
  const { email, password } = req.body;
  try {
    const userCredential = await reservationRepository.signIn(email, password);
    res.json({ userId: userCredential.user.uid, accessToken: getAuthToken(userCredential.user.uid, email, password) });
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}
