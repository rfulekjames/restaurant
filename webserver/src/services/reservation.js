'use strict';

import { ReservationRepo } from "../repo.js";

export class ReservationService {

  static async getTables(userId, restaurantName) {
    return await ReservationRepo.getTables(userId, restaurantName);
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
    return await ReservationRepo.getReservationsForTable(restaurantName, tableId, userId, ascDesc);
  } 

  static async getReservationsForDate(restaurantName, date, userId) {
    const reservations = await ReservationRepo.getReservationsForDate(restaurantName, date, userId);
    const reservationsByTable = reservations.reduce(ReservationService.reservationsReducer, []);

    return reservationsByTable;
  }

  static reservationsReducer = (acc, reservation) => {
    if (acc.length && reservation.tableId === acc[acc.length - 1][0].tableId) {
      acc[acc.length - 1].push(reservation);
    } else {
      acc.push([reservation]);
    }
    return acc;
  };
}
