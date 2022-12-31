
import { startServer } from './src/server.js';
import { initFirebase } from './src/reservation.js';

const app = await startServer(...initFirebase());
