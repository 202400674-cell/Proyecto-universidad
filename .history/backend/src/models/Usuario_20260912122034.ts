import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Interfaz para definir la estructura del documento en TypeScript
export interface IUsuario extends Document {
  email: string;
  password: string;
  rol: 'administrador' | 'coordinador' | 'operador';
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Definición del Esquema
const usuarioSchema = new Schema<IUsuario>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    rol: {
      type: String,
      enum: ['administrador', 'coordinador', 'operador'],
      default: 'operador',
    },
  },
  { timestamps: true }
);

