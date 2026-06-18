const Favorit = require('../models/Favorit');
const Buku = require('../models/Buku');
const { validationResult } = require('express-validator');

exports.getFavoritUser = async (req, res) => {
    try {
        const favorit = await Favorit.findByUser(req.user.id);
        res.json(favorit);
    } catch (error) {
        console.error('Get favorit error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.tambahFavorit = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg 
            });
        }

        const { buku_id } = req.body;
        
        // Check if buku exists
        const buku = await Buku.findById(buku_id);
        if (!buku) {
            return res.status(404).json({ 
                error: 'Buku tidak ditemukan!' 
            });
        }

        // Check if already favorited
        const existing = await Favorit.findOne(req.user.id, buku_id);
        if (existing) {
            return res.status(400).json({ 
                error: 'Buku sudah ada di favorit!' 
            });
        }

        await Favorit.create(req.user.id, buku_id);
        
        res.status(201).json({
            success: true,
            message: 'Buku berhasil ditambahkan ke favorit!'
        });
    } catch (error) {
        console.error('Tambah favorit error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.hapusFavorit = async (req, res) => {
    try {
        const { bukuId } = req.params;
        
        const affected = await Favorit.delete(req.user.id, bukuId);
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'Favorit tidak ditemukan!' 
            });
        }

        res.json({
            success: true,
            message: 'Buku berhasil dihapus dari favorit!'
        });
    } catch (error) {
        console.error('Hapus favorit error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.cekFavorit = async (req, res) => {
    try {
        const { bukuId } = req.params;
        const isFavorit = await Favorit.findOne(req.user.id, bukuId);
        
        res.json({
            isFavorit: !!isFavorit
        });
    } catch (error) {
        console.error('Cek favorit error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.getFavoritCount = async (req, res) => {
    try {
        const { bukuId } = req.params;
        const count = await Favorit.countByBuku(bukuId);
        
        res.json({
            count
        });
    } catch (error) {
        console.error('Get favorit count error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};