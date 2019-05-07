/**
 * NPM import
 */
import express from 'express';

/**
 * Local import
 */
// Controllers middleware functions
import { getLogin } from '../controllers/auth';

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/login', getLogin);

/**
 * Export
 */
export default router;
