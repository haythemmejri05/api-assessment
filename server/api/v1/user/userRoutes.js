import express from 'express';
import controller from './userController.js';
const router = express.Router();

router.param('id', controller.params);

router.route('/').get(controller.get).post(controller.create);

router.route('/:id').get(controller.getOne).put(controller.update).delete(controller.delete);

export default router;
