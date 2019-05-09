/**
 * NPM import
 */
import express from 'express';

/**
 * Local import
 */
// Controllers middleware functions
import { getLogin, postLogin, postLogout } from '../controllers/auth';

/**
 * Code
 */
const router = express.Router();

/**
 * Routes
 */
router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', postLogout);

/**
 * Export
 */
export default router;
