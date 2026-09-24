import { Router } from 'express';
import { registrarLlegada } from '../controllers/llegadasController.js';

const router = Router();

router.post('/', registrarLlegada);

export default router;