import express from 'express';
import testController from '../controllers/testController';

const router = express.Router();

router.route('/').get(testController.getAllTours);

export default router;
