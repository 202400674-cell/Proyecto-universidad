const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  apellidosCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  }],
  estado: {
    type: String,
    enum: ['activo', 'inactivo'],
    default: 'activo'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);