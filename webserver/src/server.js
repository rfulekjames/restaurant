
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import { ReservationRepository } from './reservation.js';
import { body } from 'express-validator';
import { restaurantNameValidator as restaurantNameParamValidator, setFirebaseErrorResponse, validateRequest } from "./errorhandling.js";
import { getAuthToken, getUserId, JWT_SECRET } from "./auth.js";


export function startServer(db, auth, port) {

  const PORT = port ? port : 9000;

  const app = express();

  const reservationRepository = new ReservationRepository(db, auth);

  app.use(cors(), express.json(), expressjwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret: JWT_SECRET,
  }));

  app.post('/firebase/create-user',
    body('email').isEmail(), body('password').isLength({ min: 7, max: 256 }),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      const { email, password } = req.body;
      try {
        const userCredential = await reservationRepository.createUser(email, password);
        res.json({ userId: userCredential.user.uid, accessToken: getAuthToken(userCredential.user.uid, email, password) });
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.post('/firebase/create-username',
    body('username').isLength({ min: 1, max: 256 }),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      const { username } = req.body;
      try {
        await reservationRepository.createUsername(getUserId(req), username);
        res.json({});
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.post('/firebase/login',
    body('email').isEmail(),
    body('password').isLength({ min: 1, max: 256 }),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      const { email, password } = req.body;
      try {
        const userCredential = await reservationRepository.signIn(email, password);
        res.json({ userId: userCredential.user.uid, accessToken: getAuthToken(userCredential.user.uid, email, password) });
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.get('/firebase/get-username', async (req, res) => {
    try {
      const username = await reservationRepository.getUsername(getUserId(req));
      res.json({ username });
    } catch (error) {
      setFirebaseErrorResponse(res, error);
    }
  });

  app.get('/firebase/:restaurantName/get-tables',
    restaurantNameParamValidator(),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const tables = await reservationRepository.getTables(getUserId(req), req.params['restaurantName']);
        res.json({ tables });
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.post('/firebase/:restaurantName/create-table',
    restaurantNameParamValidator(),
    body('size').isInt().custom(size => { if (!(1 <= size <= 99)) return Promise.reject('Size must be between 1 and 99'); else return Promise.resolve(); }),
    body('row').isInt().custom(size => { if (!(0 <= size <= 14)) return Promise.reject('Row must be between 0 and 9'); else return Promise.resolve(); }),
    body('column').isInt().custom(size => { if (!(0 <= size <= 9)) return Promise.reject('Column must be between 0 and 14'); else return Promise.resolve(); }),
    body('tableId').isInt().custom(tableId => { if (!(1 <= tableId)) return Promise.reject('Table Id must be positive'); else return Promise.resolve(); }),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const tableToCreate = req.body;
        await reservationRepository.createTable(tableToCreate, getUserId(req), req.params['restaurantName']);
        res.json({});
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.delete('/firebase/:restaurantName/delete-table',
    restaurantNameParamValidator(),
    body('tableId').isInt().custom(id => { if (!(1 <= id <= 149)) return Promise.reject('Table Id must be positive and smaller than 150'); else return Promise.resolve(); }),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const { tableId } = req.body;
        await reservationRepository.deleteTable(tableId, getUserId(req), req.params['restaurantName']);
        res.json({});
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.post('/firebase/:restaurantName/create-reservation',
    // TODO: add body validators
    restaurantNameParamValidator(),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const reservation = req.body;
        await reservationRepository.createReservation(reservation, getUserId(req), req.params['restaurantName']);
        res.json({});
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.delete('/firebase/:restaurantName/delete-reservation',
    // TODO: add body validators
    restaurantNameParamValidator(),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const { reservationId, tableId } = req.body;
        await reservationRepository.deleteReservation(reservationId, tableId, getUserId(req), req.params['restaurantName']);
        res.json({});
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.get('/firebase/:restaurantName/:tableId/get-reservations',
    // TODO: add tableId and ascDesc param validator
    restaurantNameParamValidator(),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const reservations = await reservationRepository.getReservationsForTable(req.params['restaurantName'], req.params['tableId'], getUserId(req), req.query.ascDesc);
        res.json({ reservations });
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  app.get('/firebase/:restaurantName/get-reservations',
    // TODO: add tableId and ascDesc param validator
    restaurantNameParamValidator(),
    async (req, res) => {
      if (!validateRequest(req, res)) return;
      try {
        const reservations = await reservationRepository.getReservationsForDate(req.params['restaurantName'], req.query.date, getUserId(req));
        res.json({ reservations });
      } catch (error) {
        setFirebaseErrorResponse(res, error);
      }
    });

  return app.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Firebase endpoint: http://localhost:${PORT}/firebase`);
  });
}
