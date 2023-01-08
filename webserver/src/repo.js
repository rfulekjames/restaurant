
import { getFirestore } from "firebase/firestore";

import { connectFirestoreEmulator } from "firebase/firestore";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch
} from "firebase/firestore";

export const firestoreEmulatorPort = 8080;

function initFirebase() {
  const db = getFirestore();

  if (process.env.ENV === 'dev') {
    connectFirestoreEmulator(db, "localhost", firestoreEmulatorPort);
  }
  return db;
}

const MAX_NUM_OF_FETCHED_RESERVATIONS = 1000;

export const db = initFirebase();

export class ReservationRepo {

  static async createUsername(userId, username) {
    await setDoc(doc(db, "users", userId), {
      username: username,
    })
  }

  static async getUsername(userId) {
    const data = (await getDoc(doc(db, "users", userId))).data();
    return data.username;
  }

  static async getTables(userId, restaurantName) {
    const tablesRef = collection(
      db,
      ReservationRepo.getFirestorePathForTables(userId, restaurantName),
    );

    const tablesRaw = await getDocs(tablesRef);

    const tables = [];
    tablesRaw.forEach((table) => {
      const tableToState = table.data();
      tableToState.id = table.id;
      tables.push(tableToState);
    });
    return tables;
  }

  static async createTable(tableToCreate, userId, restaurantName) {
    const path = ReservationRepo.getFirestorePathForTables(
      userId,
      restaurantName,
    );

    await setDoc(doc(db, path, tableToCreate.tableId.toString()), {
      row: tableToCreate.row,
      column: tableToCreate.column,
      size: tableToCreate.size,
    });
  }

  static async deleteTable(tableId, userId, restaurantName) {
    const path = ReservationRepo.getFirestorePathForTables(userId, restaurantName);
    const pathReservations = ReservationRepo.getFirestorePathForReservations(userId, restaurantName);

    await ReservationRepo.deleteReservationsForTable(
      pathReservations,
      tableId,
    );

    await deleteDoc(doc(db, path, tableId.toString()));
  };

  static async deleteReservationsForTable(reservationPath, tableId) {
    const reservationsRef = collection(db, reservationPath);
    const q = query(reservationsRef, where("tableId", "==", +tableId));
    const reservations = await getDocs(q);

    const reservationRefs = [];
    reservations.forEach((reservation) => {
      const reservationData = reservation.data();
      const reservationRef = doc(
        db,
        reservationPath,
        ReservationRepo.getReservationId(tableId, reservationData.id)
      );
      reservationRefs.push(reservationRef);
    });

    const batch = writeBatch(db);
    for (const reservationRef of reservationRefs) {
      batch.delete(reservationRef);
    }
    await batch.commit();
  }

  static async createReservation(
    reservation,
    userId,
    restaurantName,
  ) {
    const path = ReservationRepo.getFirestorePathForReservations(
      userId,
      restaurantName,
    );

    reservation.tableId = +reservation.tableId;
    await setDoc(
      doc(
        db,
        path,
        ReservationRepo.getReservationId(reservation.tableId, reservation.id)
      ),
      reservation,
    )
  };

  static async deleteReservation(reservationId, tableId, userId, restaurantName) {
    const path = ReservationRepo.getFirestorePathForReservations(
      userId,
      restaurantName,
    );
    const reservationRef = doc(
      db,
      path,
      ReservationRepo.getReservationId(tableId, reservationId),
    );

    await deleteDoc(reservationRef);
  }

  static async getReservationsForTable(restaurantName, tableId, userId, ascDesc) {

    const path = ReservationRepo.getFirestorePathForReservations(userId, restaurantName);
    const reservationsRef = collection(db, path);

    const q = query(
      reservationsRef,
      limit(MAX_NUM_OF_FETCHED_RESERVATIONS),
      where("tableId", "==", +tableId),
      orderBy("date", ascDesc),
      orderBy("time", ascDesc)
    );

    return await ReservationRepo.getReservations(q);
  }

  static async getReservationsForDate(restaurantName, date, userId) {
    const path = ReservationRepo.getFirestorePathForReservations(userId, restaurantName);
    const reservationsRef = collection(db, path);

    const q = query(
      reservationsRef,
      where("date", "==", date),
      orderBy("tableId", "asc"),
      orderBy("time", "asc")
    );

    return await ReservationRepo.getReservations(q);
  }

  static async getReservations(q) {
    const reservationsRaw = await getDocs(q);
    const reservationsRawArray = [];
    reservationsRaw.forEach(reservation => reservationsRawArray.push(reservation));
    return reservationsRawArray.map(reservation => ReservationRepo.getReservationData(reservation));
  }

  static getReservationId(tableId, reservationId) {
    return tableId + ":" + reservationId;
  }

  static getFirestorePathForTables(userId, restaurantName) {
    return userId + "/" + restaurantName + "/tables";
  }

  static getFirestorePathForReservations(userId, restaurantName) {
    return userId + "/" + restaurantName + "/reservations";
  }

  static getReservationData(reservationRaw) {
    const reservationData = reservationRaw.data();
    reservationData.tableId = reservationData.tableId.toString();
    return reservationData;
  }
}
