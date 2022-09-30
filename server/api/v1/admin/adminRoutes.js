import express from 'express';
import controller from './adminController.js';
import authMiddleWare from '../../../middleware/authMiddleware.js';
const router = express.Router();

//router.param('id', controller.params);

//router.route('/').get(controller.get).post(controller.create);

//router.route('/:id').get(controller.getOne).put(controller.update).delete(controller.delete);

router.route('/authenticate').post(authMiddleWare.authenticateAdmin(), controller.signIn);

export default router;