import express from 'express';

import userRoutes from './userRoutes';
import testRoutes from './testRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/test', testRoutes);

export default router;
