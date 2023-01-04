import { initializeApp } from "firebase/app";

import { connectFirestoreEmulator } from "@firebase/firestore";
import { connectAuthEmulator } from 'firebase/auth';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch
} from "firebase/firestore";

const getActionCodeSettings = (username, email, password) => {
  const actionCodeSettings =  {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `http://localhost:3000?username=${username}&email=${email}&password=${password}`,
    // This must be true.
    handleCodeInApp: true,
  };
  return actionCodeSettings;
}

import { config } from 'dotenv';

export const firestoreEmulatorPort = 8080;
export const authEmulatorPort = 9099;

config();

export const firebaseConfigVariables = {
  apiKey: process.env.FIREBASE_API_KEY,
  projectId: process.env.PROJECT_ID,
};

const MAX_NUM_OF_FETCHED_RESERVATIONS = 1000;

export function initFirebase() {
  initializeApp(firebaseConfigVariables);
  const auth = getAuth();
  const db = getFirestore();

  // connectFirestoreEmulator(db, "localhost", firestoreEmulatorPort);
  // connectAuthEmulator(auth, `http://localhost:${authEmulatorPort}`);

  return [db, auth];
}

export class ReservationRepository {

  constructor(db, auth) {
    this.db = db;
    this.auth = auth;
  }

  async initUser(username, email, password) {
    await sendSignInLinkToEmail(this.auth, email, getActionCodeSettings(username, email, password));
  
  }

  async createUser(email, password) {
    return await createUserWithEmailAndPassword(
      this.auth,
      email,
      password,
    );
  }

  async createUsername(userId, username) {
    await setDoc(doc(this.db, "users", userId), {
      username: username,
    })
  }

  async signIn(email, password) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }


  async getUsername(userId) {
    const data = (await getDoc(doc(this.db, "users", userId))).data();
    return data.username;
  }

  async getTables(userId, restaurantName) {
    const tablesRef = collection(
      this.db,
      ReservationRepository.getFirestorePathForTables(userId, restaurantName),
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

  async createTable(tableToCreate, userId, restaurantName) {
    const path = ReservationRepository.getFirestorePathForTables(
      userId,
      restaurantName,
    );

    await setDoc(doc(this.db, path, tableToCreate.tableId.toString()), {
      row: tableToCreate.row,
      column: tableToCreate.column,
      size: tableToCreate.size,
    });
  }

  async deleteTable(tableId, userId, restaurantName) {
    const path = ReservationRepository.getFirestorePathForTables(userId, restaurantName);
    const pathReservations = ReservationRepository.getFirestorePathForReservations(userId, restaurantName);

    await this.deleteReservationsForTable(
      pathReservations,
      tableId,
    );

    await deleteDoc(doc(this.db, path, tableId.toString()));
  };

  async deleteReservationsForTable(reservationPath, tableId) {
    const reservationsRef = collection(this.db, reservationPath);
    const q = query(reservationsRef, where("tableId", "==", +tableId));
    const reservations = await getDocs(q);

    const reservationRefs = [];
    reservations.forEach((reservation) => {
      const reservationData = reservation.data();
      const reservationRef = doc(
        this.db,
        reservationPath,
        ReservationRepository.getReservationId(tableId, reservationData.id)
      );
      reservationRefs.push(reservationRef);
    });

    const batch = writeBatch(this.db);
    for (const reservationRef of reservationRefs) {
      batch.delete(reservationRef);
    }
    await batch.commit();
  }

  async createReservation(
    reservation,
    userId,
    restaurantName,
  ) {
    const path = ReservationRepository.getFirestorePathForReservations(
      userId,
      restaurantName,
    );

    reservation.tableId = +reservation.tableId;
    await setDoc(
      doc(
        this.db,
        path,
        ReservationRepository.getReservationId(reservation.tableId, reservation.id)
      ),
      reservation,
    )
  };

  async deleteReservation(reservationId, tableId, userId, restaurantName) {
    const path = ReservationRepository.getFirestorePathForReservations(
      userId,
      restaurantName,
    );
    const reservationRef = doc(
      this.db,
      path,
      ReservationRepository.getReservationId(tableId, reservationId),
    );

    await deleteDoc(reservationRef);
  }

  async getReservationsForTable(restaurantName, tableId, userId, ascDesc) {

    const path = ReservationRepository.getFirestorePathForReservations(userId, restaurantName);
    const reservationsRef = collection(this.db, path);

    const q = query(
      reservationsRef,
      limit(MAX_NUM_OF_FETCHED_RESERVATIONS),
      where("tableId", "==", +tableId),
      orderBy("date", ascDesc),
      orderBy("time", ascDesc)
    );

    const reservationsRaw = await getDocs(q);
    const reservations = [];
    reservationsRaw.forEach((reservationRaw) => {
      ReservationRepository.putReservationToArray(reservationRaw, reservations);
    });
    return reservations;
  }

  async getReservationsForDate(restaurantName, date, userId) {
    function reservationsReducer(acc, reservation) {
      if (acc.length && reservation.tableId === acc[acc.length - 1][0].tableId) {
        acc[acc.length - 1].push(reservation);
      } else {
        acc.push([reservation]);
      }
      return acc;
    };

    const path = ReservationRepository.getFirestorePathForReservations(userId, restaurantName);
    const reservationsRef = collection(this.db, path);

    const q = query(
      reservationsRef,
      where("date", "==", date),
      orderBy("tableId", "asc"),
      orderBy("time", "asc")
    );

    const reservationsRaw = await getDocs(q);
    const reservations = [];
    reservationsRaw.forEach((reservationRaw) => {
      ReservationRepository.putReservationToArray(reservationRaw, reservations);
    });
    const reservationsByTable = reservations.reduce(
      reservationsReducer,
      [],
    );

    return reservationsByTable;
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

  static putReservationToArray(reservationRaw, reservations) {
    const reservation = reservationRaw.data();
    reservation.tableId = reservation.tableId.toString();
    reservations.push(reservation);
  }
}

export const reservationRepository = new ReservationRepository(...initFirebase());
