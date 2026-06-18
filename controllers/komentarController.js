const Komentar = require('../models/Komentar');
const Buku = require('../models/Buku');
const { validationResult } = require('express-validator');

exports.getKomentarBuku = async (req, res) => {
    try {
        const { bukuId } = req.params;
        const komentar = await Komentar.findByBuku(bukuId);
        const averageRating = await Komentar.getAverageRating(bukuId);
        
        res.json({
            komentar,
            average_rating: averageRating,
            total: komentar.length
        });
    } catch (error) {
        console.error('Get komentar error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.tambahKomentar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg 
            });
        }

        const { komentar, rating } = req.body;
        const { bukuId } = req.params;

        // Check if buku exists
        const buku = await Buku.findById(bukuId);
        if (!buku) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }

        // Create komentar
        const id = await Komentar.create({
            user_id: req.user.id,
            buku_id: bukuId,
            komentar,
            rating: rating || 0
        });

        // Update buku rating
        await Buku.updateRating(bukuId);

        // Get the new komentar
        const newKomentar = await Komentar.findByBuku(bukuId);
        
        res.status(201).json({
            success: true,
            message: 'Komentar berhasil ditambahkan!',
            komentar: newKomentar[0],
            average_rating: await Komentar.getAverageRating(bukuId)
        });
    } catch (error) {
        console.error('Tambah komentar error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.updateKomentar = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg 
            });
        }

        const { id } = req.params;
        const { komentar, rating } = req.body;

        // Check if komentar exists and belongs to user
        const existing = await Komentar.findByBuku(id);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ 
                error: 'Komentar tidak ditemukan!' 
            });
        }

        // TODO: Check ownership

        const affected = await Komentar.update(id, { komentar, rating });
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'Komentar tidak ditemukan!' 
            });
        }

        res.json({
            success: true,
            message: 'Komentar berhasil diupdate!'
        });
    } catch (error) {
        console.error('Update komentar error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.hapusKomentar = async (req, res) => {
    try {
        const { id } = req.params;

        // Get komentar info
        const komentarList = await Komentar.findByBuku(id);
        if (!komentarList || komentarList.length === 0) {
            return res.status(404).json({ 
                error: 'Komentar tidak ditemukan!' 
            });
        }

        const komentar = komentarList[0];
        const bukuId = komentar.buku_id;

        const affected = await Komentar.delete(id);
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'Komentar tidak ditemukan!' 
            });
        }

        // Update buku rating
        await Buku.updateRating(bukuId);

        res.json({
            success: true,
            message: 'Komentar berhasil dihapus!'
        });
    } catch (error) {
        console.error('Hapus komentar error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.getKomentarUser = async (req, res) => {
    try {
        const komentar = await Komentar.findByUser(req.user.id);
        res.json(komentar);
    } catch (error) {
        console.error('Get komentar user error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};