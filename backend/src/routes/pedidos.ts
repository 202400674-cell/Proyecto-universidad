import { Router } from 'express';
import { crearPedido, obtenerPedidos } from '../controllers/pedidoController.js';

const router = Router();

router.post('/', crearPedido);
router.get('/', obtenerPedidos);

export default router;