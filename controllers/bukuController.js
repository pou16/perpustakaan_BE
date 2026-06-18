// controllers/bukuController.js
const Buku = require('../models/Buku');
const { validationResult } = require('express-validator');

// GET all books
exports.getAllBuku = async (req, res) => {
    try {
        console.log('📚 Getting all books...');
        const buku = await Buku.findAll();
        console.log('📚 Books found:', buku.length);
        res.json(buku);
    } catch (error) {
        console.error('❌ Get all buku error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server: ' + error.message 
        });
    }
};

// GET book by ID
exports.getBukuById = async (req, res) => {
    try {
        console.log('📚 Getting book by ID:', req.params.id);
        const buku = await Buku.findById(req.params.id);
        if (!buku) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }
        res.json(buku);
    } catch (error) {
        console.error('❌ Get buku by id error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

// GET recommendations
exports.getRekomendasi = async (req, res) => {
    try {
        console.log('📚 Getting recommendations...');
        const buku = await Buku.findRekomendasi();
        console.log('📚 Recommendations found:', buku.length);
        res.json(buku);
    } catch (error) {
        console.error('❌ Get rekomendasi error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server: ' + error.message 
        });
    }
};

// GET popular books
exports.getPopuler = async (req, res) => {
    try {
        console.log('📚 Getting popular books...');
        const buku = await Buku.findPopuler();
        console.log('📚 Popular books found:', buku.length);
        res.json(buku);
    } catch (error) {
        console.error('❌ Get populer error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server: ' + error.message 
        });
    }
};

// GET genres
exports.getGenres = async (req, res) => {
    try {
        console.log('📚 Getting genres...');
        const genres = await Buku.getGenres();
        const stats = await Buku.getGenreStats();
        res.json({ genres, stats });
    } catch (error) {
        console.error('❌ Get genres error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

// POST create book
exports.createBuku = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg 
            });
        }

        const bukuData = req.body;
        if (req.file) {
            bukuData.cover = req.file.filename;
        }

        const id = await Buku.create(bukuData);
        const buku = await Buku.findById(id);
        
        res.status(201).json({
            success: true,
            message: 'Buku berhasil ditambahkan!',
            buku
        });
    } catch (error) {
        console.error('❌ Create buku error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

// PUT update book
exports.updateBuku = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg 
            });
        }

        const bukuData = req.body;
        const existingBuku = await Buku.findById(req.params.id);
        
        if (!existingBuku) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }

        if (req.file) {
            bukuData.cover = req.file.filename;
        }

        const affected = await Buku.update(req.params.id, bukuData);
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }

        const buku = await Buku.findById(req.params.id);
        res.json({
            success: true,
            message: 'Buku berhasil diupdate!',
            buku
        });
    } catch (error) {
        console.error('❌ Update buku error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

// DELETE book
exports.deleteBuku = async (req, res) => {
    try {
        const existingBuku = await Buku.findById(req.params.id);
        if (!existingBuku) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }

        const affected = await Buku.delete(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }

        res.json({
            success: true,
            message: 'Buku berhasil dihapus!'
        });
    } catch (error) {
        console.error('❌ Delete buku error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};