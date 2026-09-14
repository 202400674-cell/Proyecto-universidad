import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new Schema(
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
      enum: ['administrador', 'coordinador', 'operador'], // RBAC
      default: 'operador',
    },
  },
  { timestamps: true }
);

// Hash asíncrono de contraseña antes de guardar en la BD
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const Usuario = model('Usuario', usuarioSchema);