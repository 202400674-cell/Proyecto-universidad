import { Router } from 'express';
import { crearPedido, obtenerPedidos, actualizarPedido, cancelarPedido } from '../controllers/pedidoController.js';

const router = Router();

router.post('/', crearPedido);
router.get('/', obtenerPedidos);
router.put('/:id', actualizarPedido);
router.delete('/:id', cancelarPedido);

export default router;