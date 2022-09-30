import express from 'express';
import controller from './frameController.js';
const router = express.Router();

router.param('id', controller.params);

router.route('/').get(controller.getActive);

router.route('/:id').get(controller.getOne);

export default router;
