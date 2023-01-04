import express from 'express';
import {
  createTable,
  getTables,
  deleteTable,
  createReservation,
  getTableReservations,
  getDateReservations,
  deleteReservation,
} from '../controllers/restaurantControllers.js';
import { body, param } from 'express-validator';

export const restaurantRouter = express.Router();


restaurantRouter
  .route('/:restaurantName/tables')
  .get(restaurantNameValidator(), getTables)
  .post(restaurantNameValidator(),
    intRangeValidator(body('size'), 1, 99, 'Size must be between 1 and 99'),
    intRangeValidator(body('row'), 0, 9, 'Row must be between 0 and 9'),
    intRangeValidator(body('column'), 0, 14, 'Column must be between 0 and 14'),
    tableIdValidator(body('tableId')),
    createTable)
  .delete(restaurantNameValidator(),
    tableIdValidator(body('tableId')),
    deleteTable);

restaurantRouter
  .route('/:restaurantName/reservations')
  .get(restaurantNameValidator(), getDateReservations)
  .post(restaurantNameValidator(), createReservation)
  .delete(restaurantNameValidator(),
    tableIdValidator(body('tableId')),
    deleteReservation);

restaurantRouter
  .route('/:restaurantName/reservations/:tableId')
  .get(restaurantNameValidator(),
    tableIdValidator(param('tableId')),
    getTableReservations)


function restaurantNameValidator() {
  return param('restaurantName').isLength({ min: 1, max: 256 });
}

function tableIdValidator(parameter) {
  return intRangeValidator(parameter, 1, 150, 'Table Id must be positive and smaller than 151');
}

function intRangeValidator(parameter, min, max, message) {
  return parameter.isInt().custom(id => {
    if (!(min <= id && id <= max)) {
      return Promise.reject(message);
    } else {
      return Promise.resolve();
    }
  });
}
