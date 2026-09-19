import { Router } from 'express';
import { crearProveedor, obtenerProveedores } from '../controllers/proveedorController.js';

const router = Router();

router.post('/', crearProveedor);
router.get('/', obtenerProveedores);

export default router;