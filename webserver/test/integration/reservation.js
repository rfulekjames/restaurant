'use strict';

import assert from 'assert';
import fetch from "node-fetch";

import { startServer } from '../../src/server.js';
import { firebaseConfigVariables } from '../../src/auth.js';
import { firestoreEmulatorPort } from '../../src/repo.js';
import { authEmulatorPort } from '../../src/auth.js';

const PORT = 9000
const SERVER_URL = `http://localhost:${PORT}/api`;


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
    `http://127.0.0.1:${firestoreEmulatorPort}/emulator/v1/projects/${firebaseConfigVariables.projectId}/databases/(default)/documents`,
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
    `http://127.0.0.1:${authEmulatorPort}/emulator/v1/projects/${firebaseConfigVariables.projectId}/accounts`,
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
    server = startServer(PORT);

    await clearDb();
    await clearAuth();

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
    const createUser = async (email, password) => fetch(SERVER_URL + '/users/register', {
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

    const createUsername = async (customAccessToken) => fetch(SERVER_URL + '/users/username', {
      method: 'POST',
      headers: httpHeaders(customAccessToken),
      body: JSON.stringify({ username: 'velkolepost' }),
    });
    res = await createUsername(accessToken + 'a');
    assert.equal(res.status, 401);
    res = await createUsername(accessToken);
    assert.equal(res.status, 200);

    const getUsername = async (customAccessToken) => fetch(SERVER_URL + '/users/username', {
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

  const login = async (email, password) => fetch(SERVER_URL + '/users/login', {
    method: 'POST',
    headers: httpHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const getUserIdFromAccessToken = (accToken) => JSON.parse(Buffer.from(accToken.split('.')[1], 'base64')).userId;

  it('login test user', async function () {
    let res = await login('test@user.org', 'secretpass');
    assert.equal(res.status, 401);
    res = await login('test.sk', 'passcorrect');
    assert.equal(res.status, 400);
    res = await login('test@user.org', 'passcorrect');
    assert.equal(res.status, 200);
    const userId = getUserIdFromAccessToken((await res.json()).accessToken);
    assert.equal(userId, getUserIdFromAccessToken(accessToken));
  });

  const createTable = async (restarantName, tableData) => fetch(`${SERVER_URL}/restaurants/${restarantName}/tables`, {
    method: 'POST',
    headers: httpHeaders(accessToken),
    body: JSON.stringify(tableData),
  });

  const getTables = async (restarantName) => fetch(`${SERVER_URL}/restaurants/${restarantName}/tables`, {
    method: 'GET',
    headers: httpHeaders(accessToken),
  });

  const deleteTable = async (restarantName, tableId) => fetch(`${SERVER_URL}/restaurants/${restarantName}/tables`, {
    method: 'DELETE',
    headers: httpHeaders(accessToken),
    body: JSON.stringify({ tableId }),
  });

  it('create table in a restaurant', async function () {
    let res = await createTable('Resting', { tableId: '1', size: 3, row: 10, column: 10 });
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
    assert.deepEqual(tables, [{ id: '1', size: 3, row: 0, column: 0 }]);
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

  const createReservation = async (restarantName, reservation) => fetch(`${SERVER_URL}/restaurants/${restarantName}/reservations`, {
    method: 'POST',
    headers: httpHeaders(accessToken),
    body: JSON.stringify(reservation),
  });

  const getReservationsForTable = async (restarantName, tableId) => fetch(`${SERVER_URL}/restaurants/${restarantName}/reservations/${tableId}?ascDesc=asc`, {
    method: 'GET',
    headers: httpHeaders(accessToken),
  });

  const getReservationsForDate = async (restarantName, date) => fetch(`${SERVER_URL}/restaurants/${restarantName}/reservations?date=${date}`, {
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

  const deleteReservation = async (restarantName, reservation) => fetch(`${SERVER_URL}/restaurants/${restarantName}/reservations`, {
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
