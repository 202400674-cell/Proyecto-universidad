import { Router } from 'express';
import { obtenerAuditorias } from '../controllers/auditoriaController.js';

const router = Router();

router.get('/', obtenerAuditorias);

export default router;
