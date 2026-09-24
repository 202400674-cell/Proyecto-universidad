import { Router } from 'express';
import { registrarLlegada } from '../controllers/llegadasController';

const router = Router();
router.post('/', registrarLlegada);

export default router;