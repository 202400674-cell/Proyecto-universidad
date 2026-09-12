const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  rol: {
    type: String,
    required: true,
    enum: ['Administrador', 'Coordinador', 'Operador']
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);