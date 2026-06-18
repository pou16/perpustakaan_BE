// routes/bukuRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bukuController = require('../controllers/bukuController');
const { auth, adminOnly } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../uploads/covers');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `cover-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau GIF.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2097152 // 2MB
    },
    fileFilter: fileFilter
});

// Validation rules
const bukuValidation = [
    body('judul').notEmpty().withMessage('Judul wajib diisi'),
    body('penulis').notEmpty().withMessage('Penulis wajib diisi'),
    body('genre').notEmpty().withMessage('Genre wajib diisi')
];

// ============ ROUTES ============

// Public routes - PASTIKAN SEMUA CONTROLLER ADA
router.get('/', bukuController.getAllBuku);
router.get('/rekomendasi', bukuController.getRekomendasi);
router.get('/populer', bukuController.getPopuler);
router.get('/genres', bukuController.getGenres);
router.get('/:id', bukuController.getBukuById);

// Admin only routes
router.post('/', auth, adminOnly, upload.single('cover'), bukuValidation, bukuController.createBuku);
router.put('/:id', auth, adminOnly, upload.single('cover'), bukuValidation, bukuController.updateBuku);
router.delete('/:id', auth, adminOnly, bukuController.deleteBuku);

module.exports = router;