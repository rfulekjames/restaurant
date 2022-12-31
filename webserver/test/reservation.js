import assert from 'assert';
import fetch from "node-fetch";

import { startServer } from '../src/server.js';
import { initFirebase, configVariables } from "../src/reservation.js";

import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";

const firestoreEmulatorPort = 8080;
const authEmulatorPort = 9099;
const PORT = 9000
const NEW_SERVER_URL = `http://localhost:${PORT}/firebase`;

const httpHeaders = (token) => {
  const basicHeaders = { 'Content-Type': 'application/json' }
  if (token) {
    return {
      ...basicHeaders,
      'Authorization': 'Bearer ' + token,
    }
  } else {
    return {
      ...basicHeaders,
    }
  }
};

async function clearDb() {
  const response = await fetch(
    `http://localhost:${firestoreEmulatorPort}/emulator/v1/projects/${configVariables.projectId}/databases/(default)/documents`,
    {
      method: 'DELETE',
    }
  );
  if (response.status !== 200) {
    throw new Error('Trouble clearing Firestore Emulator: ' + (await response.text()));
  }
}

async function clearAuth() {
  const response = await fetch(
    `http://localhost:${authEmulatorPort}/emulator/v1/projects/${configVariables.projectId}/accounts`,
    {
      method: 'DELETE',
    }
  );
  if (response.status !== 200) {
    throw new Error('Trouble clearing Auth Emulator: ' + (await response.text()));
  }
}

describe('Firestore', function () {
  let credentials = null;
  let server = null;
  let accessToken = null;

  // Called before all of the tests in this block.
  before(async function () {
    const [db, auth] = initFirebase();

    connectFirestoreEmulator(db, "localhost", firestoreEmulatorPort);
    connectAuthEmulator(auth, `http://localhost:${authEmulatorPort}`);

    await clearDb();
    await clearAuth();

    server = startServer(db, auth, PORT);
    console.log("Started server!");
  });


  // Called once before each of the tests in this block start.
  beforeEach(function () {
  });

  // Called after all of the tests in this block complete.
  after(() => {
    server.close();
    console.log("Server closed!");
    console.log("Test done!");
  });

  // Called once after each of the tests in this block.
  afterEach(function () {

  });

  it('test create a user with a username', async function () {
    const createUser = async (email, password) => fetch(NEW_SERVER_URL + '/create-user', {
      method: 'POST',
      headers: httpHeaders(),
      body: JSON.stringify({ email, password }),
    });
    let res = await createUser('test@user.org', 'holi');
    assert.equal(res.status, 400);
    res = await createUser('test@user.org', 'passcorrect');
    assert.equal(res.status, 200);
    credentials = await res.json();
    accessToken = credentials.accessToken;

    const createUsername = async (customAccessToken) => fetch(NEW_SERVER_URL + '/create-username', {
      method: 'POST',
      headers: httpHeaders(customAccessToken),
      body: JSON.stringify({ username: 'velkolepost' }),
    });
    res = await createUsername(accessToken + 'a');
    assert.equal(res.status, 401);
    res = await createUsername(accessToken);
    assert.equal(res.status, 200);

    const getUsername = async (customAccessToken) => fetch(NEW_SERVER_URL + '/get-username', {
      method: 'GET',
      headers: httpHeaders(customAccessToken),
    });
    res = await getUsername(accessToken + 'a');
    assert.equal(res.status, 401);
    res = await getUsername(accessToken);
    assert.equal(res.status, 200);
    const username = (await res.json()).username;
    assert.equal(username, 'velkolepost');
  });

  const login = async (email, password) => fetch(NEW_SERVER_URL + '/login', {
    method: 'POST',
    headers: httpHeaders(),
    body: JSON.stringify({ email, password }),
  });

  it('login test user', async function () {
    let res = await login('test@user.org', 'secretpass');
    assert.equal(res.status, 401);
    res = await login('test.sk', 'passcorrect');
    assert.equal(res.status, 400);
    res = await login('test@user.org', 'passcorrect');
    assert.equal(res.status, 200);
    assert.equal((await res.json()).userId, credentials.userId);
  });

  const createTable = async (restarantName, tableData) => fetch(`${NEW_SERVER_URL}/${restarantName}/create-table`, {
    method: 'POST',
    headers: httpHeaders(accessToken),
    body: JSON.stringify(tableData),
  });

  const getTables = async (restarantName) => fetch(`${NEW_SERVER_URL}/${restarantName}/get-tables`, {
    method: 'GET',
    headers: httpHeaders(accessToken),
  });

  const deleteTable = async (restarantName, tableId) => fetch(`${NEW_SERVER_URL}/${restarantName}/delete-table`, {
    method: 'DELETE',
    headers: httpHeaders(accessToken),
    body: JSON.stringify({ tableId }),
  });

  it('create table in a restaurant', async function () {
    let res = await createTable('Resting', { tableId: '1', size: 3, row: -1, column: 'string' });
    assert.equal(res.status, 400);
    res = await createTable('Resting', { tableId: '1', size: 3, row: 0, column: 0 });
    assert.equal(res.status, 200);
    res = await getTables('Resting');
    assert.equal(res.status, 200);
    let { tables } = await res.json();
    assert.equal(tables.length, 1);
    await createTable('Resting', { tableId: '1', size: 3, row: 0, column: 0 });
    assert.equal(res.status, 200);
    res = await getTables('Resting');
    assert.equal(res.status, 200);
    tables = (await res.json()).tables;
    assert.equal(tables.length, 1);
    res = await createTable('Resting', { tableId: '2', size: 3, row: 0, column: 0 });
    assert.equal(res.status, 200);
    res = await getTables('Resting');
    assert.equal(res.status, 200);
    tables = (await res.json()).tables;
    assert.equal(tables.length, 2);
    res = await deleteTable('Resting', 1);
    assert.equal(res.status, 200);
    res = await getTables('Resting');
    assert.equal(res.status, 200);
    tables = (await res.json()).tables;
    assert.equal(tables.length, 1);
  });

  const createReservation = async (restarantName, reservation) => fetch(`${NEW_SERVER_URL}/${restarantName}/create-reservation`, {
    method: 'POST',
    headers: httpHeaders(accessToken),
    body: JSON.stringify(reservation),
  });

  const getReservationsForTable = async (restarantName, tableId) => fetch(`${NEW_SERVER_URL}/${restarantName}/${tableId}/get-reservations?ascDesc=asc`, {
    method: 'GET',
    headers: httpHeaders(accessToken),
  });

  const getReservationsForDate = async (restarantName, date) => fetch(`${NEW_SERVER_URL}/${restarantName}/get-reservations?date=${date}`, {
    method: 'GET',
    headers: httpHeaders(accessToken),
  });

  it('create a reservation at a table in a restaurant', async function () {
    let res = await getReservationsForTable('Resting', 2);
    const reservations0 = await res.json();
    assert.equal(reservations0.reservations.length, 0);
    const testReservation = {
      contactDetails: '291 W. Barbados st.',
      customerName: 'Number One',
      date: '01-01-2023',
      time: '23:00',
      id: 1,
      tableId: '2',
    }
    res = await createReservation('Resting', testReservation);
    assert.equal(res.status, 200);
    res = await getReservationsForTable('Resting', 2);
    const { reservations } = await res.json();
    assert.equal(reservations.length, 1);
    res = await getReservationsForDate('Resting', '01-01-2023');
    const reservationsByTable = await res.json();
    assert.equal(reservationsByTable.reservations.length, 1);
    assert.equal(reservationsByTable.reservations[0].length, 1);
    assert.deepEqual(reservationsByTable.reservations[0][0], testReservation);
  });

  const deleteReservation = async (restarantName, reservation) => fetch(`${NEW_SERVER_URL}/${restarantName}/delete-reservation`, {
    method: 'DELETE',
    headers: httpHeaders(accessToken),
    body: JSON.stringify(reservation),
  });

  it('delete a reservation at a table in a restaurant', async function () {
    let res = await deleteReservation('Resting', {
      reservationId: 1,
      tableId: '1',
    });
    assert.equal(res.status, 200);
    res = await deleteReservation('Resting', {
      reservationId: 1,
      tableId: '2',
    });
    assert.equal(res.status, 200);
  });

});
