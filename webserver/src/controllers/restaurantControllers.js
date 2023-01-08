'use strict';

import { setFirebaseErrorResponse, validateRequest } from "../errorhandling.js";
import { getUserId } from "../auth.js";
import { ReservationService } from '../services/reservation.js';


export const getTables = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const tables = await ReservationService.getTables(getUserId(req), req.params['restaurantName']);
    res.json({ tables });
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const createTable = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const tableToCreate = req.body;
    await ReservationService.createTable(tableToCreate, getUserId(req), req.params['restaurantName']);
    res.json({});
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const deleteTable = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const { tableId } = req.body;
    await ReservationService.deleteTable(tableId, getUserId(req), req.params['restaurantName']);
    res.json({});
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const createReservation = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const reservation = req.body;
    await ReservationService.createReservation(reservation, getUserId(req), req.params['restaurantName']);
    res.json({});
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const deleteReservation = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const { reservationId, tableId } = req.body;
    await ReservationService.deleteReservation(reservationId, tableId, getUserId(req), req.params['restaurantName']);
    res.json({});
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const getTableReservations = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const reservations = await ReservationService.getReservationsForTable(req.params['restaurantName'], req.params['tableId'], getUserId(req), req.query.ascDesc);
    res.json({ reservations });
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}

export const getDateReservations = async (req, res) => {
  if (!validateRequest(req, res)) return;
  try {
    const reservations = await ReservationService.getReservationsForDate(req.params['restaurantName'], req.query.date, getUserId(req));
    res.json({ reservations });
  } catch (error) {
    setFirebaseErrorResponse(res, error);
  }
}
