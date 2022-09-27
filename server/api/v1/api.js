import express from 'express';
import frameRoutes from './frame/frameRoutes.js';

const router = express.Router();

router.use('/v1/frames', frameRoutes);

export default router;
