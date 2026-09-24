import { Router } from 'express';
import { crearProveedor, obtenerProveedores, actualizarProveedor, inactivarProveedor } from '../controllers/proveedorController.js';

const router = Router();

router.post('/', crearProveedor);
router.get('/', obtenerProveedores);
router.put('/:id', actualizarProveedor);
router.delete('/:id', inactivarProveedor);

export default router;