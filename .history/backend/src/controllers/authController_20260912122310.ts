import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validar que vengan los campos requeridos
    if (!email || !password) {
      res.status(400).json({ mensaje: 'Por favor ingrese correo y contraseña' });
      return;
    }

    // 2. Buscar si el usuario existe en MongoDB
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    // 3. Comparar la contraseña ingresada con el hash guardado en la BD
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    // 4. Firmar el Token JWT con id y el ROL del usuario (RBAC)
    const secretKey = process.env.JWT_SECRET || 'secreto_por_defecto';
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      secretKey,
      { expiresIn: '8h' }
    );

    // 5. Responder con el token y datos del usuario (sin password)
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno en el servidor', error });
  }
};