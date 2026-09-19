import { Schema, model, type InferSchemaType } from 'mongoose';

export type Categoria = 'construcción' | 'general';

const proveedorSchema = new Schema({
  razonSocial: {
    type: String,
    required: true,
    trim: true,
  },
  identificacionTributaria: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  categoria: {
    type: String,
    required: true,
    enum: ['construcción', 'general'] satisfies Categoria[],
  },
  contactoNombre: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  emailContacto: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Correo electrónico inválido'],
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo',
  },
}, { timestamps: true });

export type IProveedor = InferSchemaType<typeof proveedorSchema>;
export const Proveedor = model('Proveedor', proveedorSchema);