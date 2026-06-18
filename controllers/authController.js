// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        console.log('📝 ===== LOGIN ATTEMPT =====');
        console.log('📝 Username:', req.body.username);
        
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username dan password wajib diisi!' 
            });
        }
        
        const user = await User.findByUsername(username);
        console.log('👤 User ditemukan:', user ? 'Yes' : 'No');
        
        if (!user) {
            return res.status(401).json({ 
                error: 'Username atau password salah!' 
            });
        }

        // Cek password (plain text untuk development)
        let isValid = user.password === password;
        console.log('✅ Password valid:', isValid);
        
        if (!isValid) {
            return res.status(401).json({ 
                error: 'Username atau password salah!' 
            });
        }

        // Generate token
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            },
            process.env.JWT_SECRET || 'rahasia123',
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            success: true,
            token,
            user: userWithoutPassword
        });
        
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server: ' + error.message 
        });
    }
};

exports.register = async (req, res) => {
    try {
        console.log('📝 Register attempt:', req.body);
        
        const { username, password, nama_lengkap, role } = req.body;
        
        if (!username || !password || !nama_lengkap) {
            return res.status(400).json({ 
                error: 'Semua field wajib diisi!' 
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password minimal 6 karakter!' 
            });
        }
        
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Username sudah digunakan!' 
            });
        }

        const userId = await User.create({
            username,
            password,
            nama_lengkap,
            role: role || 'siswa'
        });

        res.status(201).json({ 
            success: true,
            message: 'Registrasi berhasil! Silakan login.',
            userId 
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server: ' + error.message 
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }
        res.json(user);
    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { nama_lengkap } = req.body;
        
        const affected = await User.update(req.user.id, { nama_lengkap });
        
        if (affected === 0) {
            return res.status(404).json({ 
                error: 'User tidak ditemukan!' 
            });
        }

        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            message: 'Profile berhasil diupdate!',
            user
        });
    } catch (error) {
        console.error('❌ Update profile error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        
        const user = await User.findById(req.user.id);
        
        if (user.password !== old_password) {
            return res.status(401).json({ 
                error: 'Password lama salah!' 
            });
        }

        await User.updatePassword(req.user.id, new_password);

        res.json({
            success: true,
            message: 'Password berhasil diubah!'
        });
    } catch (error) {
        console.error('❌ Change password error:', error);
        res.status(500).json({ 
            error: 'Terjadi kesalahan pada server.' 
        });
    }
};

exports.logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logout berhasil!'
    });
};