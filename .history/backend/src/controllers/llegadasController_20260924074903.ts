import { Request, Response } from 'express';
import { Pedido } from '../models/Pedido.js';
import { Parametro } from '../models/Parametro.js';

export async function registrarLlegada(req, res) {
  try {
    const { numeroPedido } = req.body;

    // 1. Buscar el pedido
    const pedido = await Pedido.findOne({ numeroPedido });

    if (!pedido) {
      return res.status(404).json({ mensaje: 'El pedido no existe.' });
    }

    // 👈 2. VALIDACIÓN DE DUPLICADO:
    if (pedido.fechaHoraLlegadaReal) {
      return res.status(400).json({
        mensaje: `Ya se registró la llegada del pedido ${pedido.numeroPedido}`,
      });
    }

    // 3. Registrar hora actual y calcular estado
    const ahora = new Date();
    pedido.fechaHoraLlegadaReal = ahora;

    const inicio = new Date(pedido.inicioVentana);
    const fin = new Date(pedido.finVentana);

    if (ahora < inicio) {
      pedido.estado = 'ANTICIPADO';
    } else if (ahora > fin) {
      pedido.estado = 'TARDÍO';
    } else {
      pedido.estado = 'A TIEMPO';
    }

    await pedido.save();

    return res.status(200).json({
      mensaje: 'Arribo registrado con éxito',
      estadoCalculado: pedido.estado,
      pedido,
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al registrar el arribo', error: error.message });
  }
}