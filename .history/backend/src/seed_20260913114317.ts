import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Usuario } from './models/Usuario.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sprint0auth';

const crearUsuarioSemilla = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB...');

    // Limpiar usuarios previos si existen
    await Usuario.deleteMany({});

    // 💡 PASAR '123456' DIRECTO: El middleware pre('save') de Usuario.ts la encriptará
    const usuarioPrueba = new Usuario({
      email: 'admin@test.com',
      password: '123456', 
      rol: 'administrador',
    });

    await usuarioPrueba.save();
    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('  Correo: admin@test.com');
    console.log('  Contraseña: 123456');
    console.log('  Rol: administrador');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error al insertar usuario semilla:', error);
    process.exit(1);
  }
};

crearUsuarioSemilla();