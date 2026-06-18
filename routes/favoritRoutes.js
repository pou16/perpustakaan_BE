const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const favoritController = require('../controllers/favoritController');
const { auth } = require('../middlewares/auth');

// Validation
const favoritValidation = [
    body('buku_id')
        .notEmpty().withMessage('Buku ID wajib diisi')
        .isInt().withMessage('Buku ID harus berupa angka')
];

// Routes
router.get('/', auth, favoritController.getFavoritUser);
router.post('/', auth, favoritValidation, favoritController.tambahFavorit);
router.delete('/:bukuId', auth, favoritController.hapusFavorit);
router.get('/cek/:bukuId', auth, favoritController.cekFavorit);
router.get('/count/:bukuId', favoritController.getFavoritCount);

module.exports = router;