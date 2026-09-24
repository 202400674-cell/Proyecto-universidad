import { Request, Response } from 'express';
import { Pedido } from '../models/Pedido.js';
import { registrarAuditoria } from './auditoriaController.js';

export const registrarLlegada = async (req: Request, res: Response): Promise<void> => {
  try {
    const { numeroPedido, usuarioNombre } = req.body;

    const pedido = await Pedido.findOne({ numeroPedido, activo: true });
    if (!pedido) {
      res.status(404).json({ mensaje: 'Pedido no encontrado o inactivo.' });
      return;
    }

    // 👈 VALIDACIÓN DE DUPLICADO: Si ya tiene registrada la fecha de llegada
    if (pedido.fechaHoraLlegadaReal) {
      res.status(400).json({
        mensaje: `Ya se registró la llegada del pedido ${pedido.numeroPedido}`,
      });
      return;
    }

    const fechaLlegadaReal = new Date();
    pedido.fechaHoraLlegadaReal = fechaLlegadaReal;

    const inicioVentana = new Date(pedido.inicioVentana).getTime();
    const finVentana = new Date(pedido.finVentana).getTime();
    const llegada = fechaLlegadaReal.getTime();

    let nuevoEstado: 'ANTICIPADO' | 'A TIEMPO' | 'TARDÍO' | 'AUSENTE' = 'A TIEMPO';

    if (llegada < inicioVentana) {
      nuevoEstado = 'ANTICIPADO';
    } else if (llegada > finVentana) {
      nuevoEstado = 'TARDÍO';
    }

    (pedido as any).estado = nuevoEstado;
    pedido.usuarioActualizacion = usuarioNombre || 'Operador Caseta';
    await pedido.save();

    await registrarAuditoria({
      entidad: 'Llegada',
      accion: 'registrar',
      detalle: `Pedido ${pedido.numeroPedido} clasificado como ${nuevoEstado}. Ventana: ${new Date(pedido.inicioVentana).toISOString()} - ${new Date(pedido.finVentana).toISOString()}. Llegada real: ${fechaLlegadaReal.toISOString()}. Usuario: ${usuarioNombre || 'Operador Caseta'}`,
      usuario: usuarioNombre || 'Operador Caseta',
    });

    res.status(200).json({
      mensaje: 'Arribo registrado con éxito',
      estadoCalculado: nuevoEstado,
      pedido,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el arribo', error });
  }
};