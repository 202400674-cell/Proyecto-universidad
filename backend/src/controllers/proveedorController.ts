import { Request, Response } from 'express';
import { Proveedor } from '../models/Proveedor.js';

export const crearProveedor = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razonSocial,
      identificacionTributaria,
      categoria,
      contactoNombre,
      telefono,
      emailContacto,
      estado,
    } = req.body;

    if (!razonSocial || !identificacionTributaria || !categoria || !contactoNombre || !telefono || !emailContacto) {
      res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
      return;
    }

    if (!['construcción', 'general'].includes(categoria)) {
      res.status(400).json({ mensaje: 'La categoría debe ser "construcción" o "general"' });
      return;
    }

    const yaExiste = await Proveedor.findOne({ identificacionTributaria });
    if (yaExiste) {
      res.status(409).json({ mensaje: 'Ya existe un proveedor con esa identificación tributaria' });
      return;
    }

    const nuevoProveedor = await Proveedor.create({
      razonSocial,
      identificacionTributaria,
      categoria,
      contactoNombre,
      telefono,
      emailContacto,
      estado: estado || 'activo',
    });

    res.status(201).json({
      mensaje: 'Proveedor registrado exitosamente',
      proveedor: nuevoProveedor,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno en el servidor', error });
  }
};

export const obtenerProveedores = async (req: Request, res: Response): Promise<void> => {
  try {
    const proveedores = await Proveedor.find({ estado: 'activo' }).sort({ razonSocial: 1 });
    res.status(200).json({ proveedores });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno en el servidor', error });
  }
};