'use strict';

import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import { restaurantRouter } from './routes/restaurantRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { publicKey } from './auth.js';

export function startServer(port) {

  const PORT = port || 9000;

  const app = express();

  app.use(cors(), express.json(), expressjwt({
    algorithms: ['RS256'],
    credentialsRequired: false,
    secret: publicKey,
  }));

  app.use('/api/users', userRouter);
  app.use('/api/restaurants', restaurantRouter);

  return app.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Api endpoint: hostname:${PORT}/api`);
  });
}
