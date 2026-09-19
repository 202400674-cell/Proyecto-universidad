import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

export type TipoProducto = 'construcción' | 'general';
export type EstadoPedido = 'PROGRAMADO' | 'CANCELADO' | 'COMPLETADO';

const pedidoSchema = new Schema({
  numeroPedido: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  proveedorId: {
    type: Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true,
  },
  tipoProducto: {
    type: String,
    required: true,
    enum: ['construcción', 'general'] satisfies TipoProducto[],
  },
  fechaHoraProgramada: {
    type: Date,
    required: true,
  },
  inicioVentana: {
    type: Date,
    required: true,
  },
  finVentana: {
    type: Date,
    required: true,
  },
  duracionEstimadaMinutos: {
    type: Number,
    required: true,
    min: [1, 'La duración debe ser mayor a cero'],
  },
  estado: {
    type: String,
    enum: ['PROGRAMADO', 'CANCELADO', 'COMPLETADO'] satisfies EstadoPedido[],
    default: 'PROGRAMADO',
  },
}, { timestamps: true });

export type IPedido = InferSchemaType<typeof pedidoSchema> & { proveedorId: Types.ObjectId };
export const Pedido = model('Pedido', pedidoSchema);