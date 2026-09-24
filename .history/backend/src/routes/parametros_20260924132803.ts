import { Router } from 'express';
import { crearParametro, obtenerParametros, actualizarParametro } from '../controllers/parametroController.js';

const router = Router();

router.get('/', obtenerParametros);
router.post('/', crearParametro);
router.put('/:id', actualizarParametro);

export default router;
