const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Profile = require('../models/Profile');
exports.register = async (req, res) => {
  try {
    console.log('BODY REGISTRO:', req.body);
    const { name, email, password } = req.body;
    // Validación de campos requeridos
    if (!name || !email || !password) {
      console.error('Faltan campos requeridos:', { name, email, password });
      return res.status(400).json({ message: 'Faltan campos requeridos: nombre, email y contraseña son obligatorios.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Crear perfil por defecto con todos los campos y asociar userId
    const defaultProfile = new Profile({
      name,
      type: 'adult',
      avatar: '',
      language: 'es',
      ageRestriction: 18,
      userId: user._id
    });
    await defaultProfile.save();
    user.profiles.push(defaultProfile._id);
    await user.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ message: 'Error en el registro', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('LOGIN:', { email, password });
    const user = await User.findOne({ email });
    console.log('USER ENCONTRADO:', user);
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('PASSWORD MATCH:', isMatch);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("authController: Token generado en login:", token);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el login', error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  console.log("forgotPassword: body recibido:", req.body);
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email requerido" });
    }

    // Busca el usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña." });
    }

    // Genera un token de recuperación
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Transporter para Hotmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recupera tu contraseña",
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);

    return res.json({ message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña." });
  } catch (err) {
    console.log("forgotPassword: error:", err);
    res.status(500).json({ message: "Error al enviar el correo de recuperación" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: "Contraseña restablecida correctamente" });
  } catch (err) {
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};
