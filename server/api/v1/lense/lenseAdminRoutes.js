import express from 'express';
import controller from './lenseController.js';
import authMiddleWare from '../../../middleware/authMiddleware.js';
const router = express.Router();

const checkAdminMiddlewares = [authMiddleWare.decodeToken(), authMiddleWare.getCaller()];

router.param('id', controller.params);

router.route('/').get(controller.get).post(checkAdminMiddlewares, controller.create);

router.route('/:id').get(checkAdminMiddlewares, controller.getOne).put(checkAdminMiddlewares, controller.update).delete(checkAdminMiddlewares, controller.delete);

export default router;
