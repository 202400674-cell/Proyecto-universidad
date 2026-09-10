require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function crear() {
  await mongoose.connect(process.env.MONGO_URI);

  const passwordEncriptado = await bcrypt.hash('123456', 10);

  await User.create({
    email: 'admin@test.com',
    password: passwordEncriptado,
    rol: 'Administrador'
  });

  console.log('Usuario creado');
  process.exit();
}

crear();