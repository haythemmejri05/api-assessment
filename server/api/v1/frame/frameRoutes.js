import express from 'express';
import controller from './frameController.js';
import authMiddleWare from '../../../middleware/authMiddleware.js';
const router = express.Router();

const checkAdminMiddlewares = [authMiddleWare.decodeToken(), authMiddleWare.getCaller(), authMiddleWare.checkAdminRole()];

router.param('id', controller.params);

router.route('/').get(checkAdminMiddlewares, controller.create);

router.route('/:id').get(checkAdminMiddlewares, controller.getOne).put(checkAdminMiddlewares, controller.update).delete(checkAdminMiddlewares, controller.delete);

export default router;
