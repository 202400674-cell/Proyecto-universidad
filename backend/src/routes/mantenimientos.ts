import { Router } from 'express';
import { crearMantenimiento, obtenerMantenimientos } from '../controllers/mantenimientoController.js';

const router = Router();

router.get('/', obtenerMantenimientos);
router.post('/', crearMantenimiento);

export default router;
