import express from 'express';
import frameAdminRoutes from './frame/frameAdminRoutes.js';
import frameUserRoutes from './frame/frameUserRoutes.js';
import lenseAdminRoutes from './lense/lenseAdminRoutes.js';
import lenseUserRoutes from './lense/lenseUserRoutes.js';
import glassesRoutes from './glasses/glassesUserRoutes.js';
import adminRoutes from './admin/adminRoutes.js';

const router = express.Router();

router.use('/v1/admins/frames', frameAdminRoutes);
router.use('/v1/users/frames', frameUserRoutes);
router.use('/v1/admins/lenses', lenseAdminRoutes);
router.use('/v1/users/lenses', lenseUserRoutes);
router.use('/v1/users/glasses', glassesRoutes);
router.use('/v1/admins', adminRoutes);

export default router;
