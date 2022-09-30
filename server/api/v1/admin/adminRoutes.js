import express from 'express';
import controller from './adminController.js';
import authMiddleWare from '../../../middleware/authMiddleware.js';
const router = express.Router();

router.route('/authenticate').post(authMiddleWare.authenticateAdmin(), controller.signIn);

export default router;
