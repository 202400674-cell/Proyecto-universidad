import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sprint0auth';

app.use(cors());
app.use(express.json());

// 1. Conectar a MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB correctamente'))
  .catch((err) => console.error('❌ Error al conectar con MongoDB:', err));

// 2. Registrar las rutas
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});