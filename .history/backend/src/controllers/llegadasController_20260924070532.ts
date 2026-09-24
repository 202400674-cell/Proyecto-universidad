import { Request, Response } from 'express';
import { Pedido } from '../models/Pedido.js';
import { Parametro } from '../models/Parametro.js';

export const registrarLlegada = async (req: Request, res: Response): Promise<void> => {
  try {
    const { numeroPedido, usuarioNombre } = req.body;

    const pedido = await Pedido.findOne({ numeroPedido, activo: true });
    if (!pedido) {
      res.status(404).json({ mensaje: 'Pedido no encontrado o inactivo.' });
      return;
    }

    const fechaLlegadaReal = new Date();
    pedido.fechaHoraLlegadaReal = fechaLlegadaReal;

    // Obtener parámetros de tolerancia
    const parametroAnticipado = await Parametro.findOne({ clave: 'TOLERANCIA_ANTICIPADO_MIN', activo: true });
    const parametroTardio = await Parametro.findOne({ clave: 'TOLERANCIA_TARDIO_MIN', activo: true });

    const tolAnticipado = parametroAnticipado ? Number(parametroAnticipado.valor) : 15;
    const tolTardio = parametroTardio ? Number(parametroTardio.valor) : 15;

    const programada = new Date(pedido.fechaHoraProgramada).getTime();
    const llegada = fechaLlegadaReal.getTime();
    const difMinutos = (llegada - programada) / (1000 * 60);

    let nuevoEstado: 'ANTICIPADO' | 'A TIEMPO' | 'TARDÍO' | 'AUSENTE' = 'A TIEMPO';

    if (difMinutos < -tolAnticipado) {
      nuevoEstado = 'ANTICIPADO';
    } else if (difMinutos > tolTardio) {
      nuevoEstado = 'TARDÍO';
    } else {
      nuevoEstado = 'A TIEMPO';
    }

    pedido.estado = nuevoEstado;
    pedido.usuarioActualizacion = usuarioNombre || 'Operador Caseta';
    await pedido.save();

    res.status(200).json({
      mensaje: 'Arribo registrado con éxito',
      estadoCalculado: nuevoEstado,
      pedido,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar el arribo', error });
  }
};