import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

export type TipoProducto = 'construcción' | 'general';
export type EstadoPedido = 'PROGRAMADO' | 'ANTICIPADO' | 'A TIEMPO' | 'TARDÍO' | 'AUSENTE' | 'CANCELADO';

const pedidoSchema = new Schema(
  {
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
    fechaHoraLlegadaReal: {
      type: Date,
    },
    estado: {
      type: String,
      enum: ['PROGRAMADO', 'ANTICIPADO', 'A TIEMPO', 'TARDÍO', 'AUSENTE', 'CANCELADO'] satisfies EstadoPedido[],
      default: 'PROGRAMADO',
    },
    activo: {
      type: Boolean,
      default: true,
      required: true,
    },
    usuarioCreacion: {
      type: String,
      required: true,
      default: 'Sistema',
    },
    usuarioActualizacion: {
      type: String,
      required: true,
      default: 'Sistema',
    },
  },
  { 
    timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' } 
  }
);

export type IPedido = InferSchemaType<typeof pedidoSchema> & { proveedorId: Types.ObjectId };
export const Pedido = model('Pedido', pedidoSchema);