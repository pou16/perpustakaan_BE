// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

// Validation rules
const loginValidation = [
    body('username').notEmpty().withMessage('Username wajib diisi'),
    body('password').notEmpty().withMessage('Password wajib diisi')
];

const registerValidation = [
    body('username')
        .notEmpty().withMessage('Username wajib diisi')
        .isLength({ min: 3 }).withMessage('Username minimal 3 karakter'),
    body('password')
        .notEmpty().withMessage('Password wajib diisi')
        .isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
    body('nama_lengkap')
        .notEmpty().withMessage('Nama lengkap wajib diisi'),
    body('role')
        .optional()
        .isIn(['admin', 'siswa']).withMessage('Role tidak valid')
];

// Routes - PASTIKAN SEMUA CONTROLLER ADA
router.post('/login', loginValidation, authController.login);
router.post('/register', registerValidation, authController.register);
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);
router.post('/logout', auth, authController.logout);

module.exports = router;