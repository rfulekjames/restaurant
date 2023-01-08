'use strict';

import { ReservationRepo } from "../repo.js";

export class ReservationService {

  static async createUsername(userId, username) {
    await ReservationRepo.createUsername(userId, username);
  }

  static async getUsername(userId) {
    return await ReservationRepo.getUsername(userId);
  }

  static async getTables(userId, restaurantName) {
    const tablesRaw = await ReservationRepo.getTables(userId, restaurantName);

    const tables = [];
    tablesRaw.forEach((table) => {
        const tableToState = table.data();
        tableToState.id = table.id;
        tables.push(tableToState);
    });
    return tables;
  }

  static async createTable(tableToCreate, userId, restaurantName) {
    await ReservationRepo.createTable(tableToCreate, userId, restaurantName)
  }

  static async deleteTable(tableId, userId, restaurantName) {
    await ReservationRepo.deleteTable(tableId, userId, restaurantName);
  };

  static async deleteReservationsForTable(reservationPath, tableId) {
    await ReservationRepo.deleteReservationsForTable(reservationPath, tableId);
  }

  static async createReservation(reservation, userId, restaurantName) {
    await ReservationRepo.createReservation(reservation, userId, restaurantName);
  };

  static async deleteReservation(reservationId, tableId, userId, restaurantName) {
    await ReservationRepo.deleteReservation(reservationId, tableId, userId, restaurantName);
  }

  static async getReservationsForTable(restaurantName, tableId, userId, ascDesc) {
    const reservationsRaw = await ReservationRepo.getReservationsForTable(restaurantName, tableId, userId, ascDesc);
    const reservationsRawArray = [];
    reservationsRaw.forEach(reservation => reservationsRawArray.push(reservation));
    const reservations = reservationsRawArray.map(reservation => ReservationService.getReservationData(reservation));
    return reservations;
  }

  static async getReservationsForDate(restaurantName, date, userId) {
    const reservationsReducer = (acc, reservation) => {
      if (acc.length && reservation.tableId === acc[acc.length - 1][0].tableId) {
        acc[acc.length - 1].push(reservation);
      } else {
        acc.push([reservation]);
      }
      return acc;
    };

    const reservationsRaw = await ReservationRepo.getReservationsForDate(restaurantName, date, userId);
    const reservationsRawArray = [];
    reservationsRaw.forEach(reservation => reservationsRawArray.push(reservation));
    const reservations = reservationsRawArray.map(reservation => ReservationService.getReservationData(reservation));
    const reservationsByTable = reservations.reduce(reservationsReducer, []);

    return reservationsByTable;
  }

  static getReservationData(reservationRaw) {
    const reservationData = reservationRaw.data();
    reservationData.tableId = reservationData.tableId.toString();
    return reservationData;
  }
}
