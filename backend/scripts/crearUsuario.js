require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');

async function crear() {
  await mongoose.connect(process.env.MONGO_URI);

  // Crear los 3 roles base si no existen todavía
  const rolesBase = [
    { nombre: 'administrador', descripcion: 'Acceso total al sistema' },
    { nombre: 'coordinador', descripcion: 'Gestión operativa y supervisión' },
    { nombre: 'operador', descripcion: 'Acceso limitado a operaciones diarias' }
  ];

  for (const r of rolesBase) {
    await Role.findOneAndUpdate(
      { nombre: r.nombre },
      r,
      { upsert: true, new: true }
    );
  }

  const rolAdmin = await Role.findOne({ nombre: 'administrador' });

  const passwordEncriptado = await bcrypt.hash('123456', 10);

  await User.create({
    nombres: 'Admin',
    apellidosCompleto: 'De Prueba',
    email: 'admin@test.com',
    password: passwordEncriptado,
    roles: [rolAdmin._id],
    estado: 'activo'
  });

  console.log('Roles y usuario creados');
  process.exit();
}

crear();