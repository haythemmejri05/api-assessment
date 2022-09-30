import express from 'express';
import controller from './lenseController.js';
const router = express.Router();

router.param('id', controller.params);

router.route('/').get(controller.get);

router.route('/:id').get(controller.getOne);

export default router;
