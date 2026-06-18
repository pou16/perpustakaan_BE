const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const komentarController = require('../controllers/komentarController');
const { auth } = require('../middlewares/auth');

// Validation
const komentarValidation = [
    body('komentar')
        .notEmpty().withMessage('Komentar wajib diisi')
        .isLength({ min: 3 }).withMessage('Komentar minimal 3 karakter'),
    body('rating')
        .optional()
        .isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1-5')
];

// Routes
router.get('/buku/:bukuId', komentarController.getKomentarBuku);
router.post('/buku/:bukuId', auth, komentarValidation, komentarController.tambahKomentar);
router.put('/:id', auth, komentarValidation, komentarController.updateKomentar);
router.delete('/:id', auth, komentarController.hapusKomentar);
router.get('/user/me', auth, komentarController.getKomentarUser);

module.exports = router;