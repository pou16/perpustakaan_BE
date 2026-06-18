const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middlewares/auth');

// Validation
const userUpdateValidation = [
    body('nama_lengkap')
        .optional()
        .notEmpty().withMessage('Nama lengkap wajib diisi'),
    body('role')
        .optional()
        .isIn(['admin', 'siswa']).withMessage('Role tidak valid')
];

// Routes (admin only)
router.get('/', auth, adminOnly, userController.getAllUsers);
router.get('/stats', auth, adminOnly, userController.getUserStats);
router.get('/:id', auth, adminOnly, userController.getUserById);
router.put('/:id', auth, adminOnly, userUpdateValidation, userController.updateUser);
router.delete('/:id', auth, adminOnly, userController.deleteUser);
router.put('/:id/role', auth, adminOnly, userController.changeUserRole);

module.exports = router;