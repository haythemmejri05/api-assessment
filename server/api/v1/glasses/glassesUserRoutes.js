import express from 'express';
import controller from './glassesController.js';
const router = express.Router();

router.param('id', controller.params);

router.route('/').post(controller.create);

router.route('/:id').get(controller.getOne).delete(controller.delete);

export default router;
