import express from 'express';
import frameRoutes from './frame/frameRoutes.js';
import lenseRoutes from './lense/lenseRoutes.js';
import userRoutes from './user/userRoutes.js';

const router = express.Router();

router.use('/v1/frames', frameRoutes);
router.use('/v1/lenses', lenseRoutes);
router.use('/v1/users', userRoutes);

export default router;
