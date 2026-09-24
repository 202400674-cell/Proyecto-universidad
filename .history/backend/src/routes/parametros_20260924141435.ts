import { Router } from 'express';
import { crearParametro, obtenerParametros, actualizarParametro, inactivarParametro } from '../controllers/parametroController.js';

const router = Router();

router.get('/', obtenerParametros);
router.post('/', crearParametro);
router.put('/:id', actualizarParametro);
router.delete('/:id', inactivarParametro);

export default router;
