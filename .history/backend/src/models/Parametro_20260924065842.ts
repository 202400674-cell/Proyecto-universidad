import mongoose, { Schema, Document } from 'mongoose';

export interface IParametro extends Document {
  clave: string;
  valor: string;
  descripcion: string;
  activo: boolean;
  usuarioCreacion: string;
  usuarioActualizacion: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

const ParametroSchema: Schema = new Schema(
  {
    clave: { type: String, required: true, unique: true, trim: true },
    valor: { type: String, required: true },
    descripcion: { type: String, required: true },
    activo: { type: Boolean, default: true },
    usuarioCreacion: { type: String, default: 'Sistema' },
    usuarioActualizacion: { type: String, default: 'Sistema' },
  },
  { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' } }
);

export default mongoose.model<IParametro>('Parametro', ParametroSchema);