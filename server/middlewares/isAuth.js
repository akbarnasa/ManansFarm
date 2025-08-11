import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

// Middleware untuk mengecek apakah user login
export const isAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.status(403).json({ message: "Silakan login" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decodedData._id);

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token tidak valid atau kedaluwarsa" });
  }
};

// Middleware untuk mengecek apakah user adalah admin
export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Akses ditolak. Anda bukan admin.",
    });
  }
  next();
};
