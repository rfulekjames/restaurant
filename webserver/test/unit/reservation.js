import { ReservationService } from '../../src/services/reservation.js';
import assert from 'assert';

describe('reservation service unit test', function () {

  it('reservation reducer', async function () {
    const noReservations = [].reduce(ReservationService.reservationsReducer, [])
    assert.deepEqual(noReservations, []);

    const testReservation = {
      contactDetails: '291 W. Barbados st.',
      customerName: 'Number One',
      date: '01-01-2023',
      time: '23:00',
      id: 1,
      tableId: '2',
    }

    let testReservationsByTable = [testReservation].reduce(ReservationService.reservationsReducer, [])
    assert.equal(testReservationsByTable.length, 1);
    assert.equal(testReservationsByTable[0].length, 1);
    assert.deepEqual(testReservationsByTable[0][0], testReservation);

    const testReservation2 = {
      contactDetails: '291 W. Barbados st.',
      customerName: 'Number One',
      date: '01-01-2023',
      time: '23:00',
      id: 1,
      tableId: '3',
    }

    testReservationsByTable = [testReservation, testReservation2].reduce(ReservationService.reservationsReducer, [])
    assert.equal(testReservationsByTable.length, 2);
    assert.equal(testReservationsByTable[0].length, 1);
    assert.equal(testReservationsByTable[1].length, 1);
    assert.deepEqual(testReservationsByTable[0][0], testReservation);
    assert.deepEqual(testReservationsByTable[1][0], testReservation2);


    const testReservation3 = {
      contactDetails: '291 W. Barbados st.',
      customerName: 'Number One',
      date: '01-01-2023',
      time: '23:00',
      id: 2,
      tableId: '2',
    }

    testReservationsByTable = [testReservation3, testReservation, testReservation2].reduce(ReservationService.reservationsReducer, [])
    assert.equal(testReservationsByTable.length, 2);
    assert.equal(testReservationsByTable[0].length, 2);
    assert.equal(testReservationsByTable[1].length, 1);
    assert.deepEqual(testReservationsByTable[0][0], testReservation3);
    assert.deepEqual(testReservationsByTable[1][0], testReservation2);
    assert.deepEqual(testReservationsByTable[0][1], testReservation);
  });
});
