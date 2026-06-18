const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user by id error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: errors.array()[0].msg 
            });
        }

        const { nama_lengkap, role } = req.body;
        
        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }

        const affected = await User.update(req.params.id, { nama_lengkap, role });
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }

        const updatedUser = await User.findById(req.params.id);
        res.json({
            success: true,
            message: 'User berhasil diupdate!',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }

        // Prevent deleting yourself
        if (req.params.id == req.user.id) {
            return res.status(400).json({ 
                error: 'Tidak dapat menghapus akun sendiri!' 
            });
        }

        const affected = await User.delete(req.params.id);
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }

        res.json({
            success: true,
            message: 'User berhasil dihapus!'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.getUserStats = async (req, res) => {
    try {
        const total = await User.count();
        const latest = await User.findLatest(5);
        
        res.json({
            total,
            latest
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }

        // Prevent changing own role
        if (req.params.id == req.user.id) {
            return res.status(400).json({ 
                error: 'Tidak dapat mengubah role sendiri!' 
            });
        }

        const affected = await User.update(req.params.id, { 
            nama_lengkap: user.nama_lengkap, 
            role 
        });

        res.json({
            success: true,
            message: 'Role user berhasil diubah!'
        });
    } catch (error) {
        console.error('Change user role error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};