import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Validar campos requeridos
    if (!email || !password) {
      res.status(400).json({ mensaje: 'Por favor ingrese correo y contraseña' });
      return;
    }

    // 2. Buscar usuario en MongoDB
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    // 3. Comparar contraseña con el hash de la BD
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      res.status(401).json({ mensaje: 'Credenciales inválidas' });
      return;
    }

    // 4. Firmar Token JWT con expiración de 24 horas y ROL (RBAC)
    const secretKey = process.env.JWT_SECRET || 'secreto_por_defecto';
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      secretKey,
      { expiresIn: '24h' } // Expiración exacta a 24 horas
    );

    // 5. Enviar respuesta con token y rol del usuario
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