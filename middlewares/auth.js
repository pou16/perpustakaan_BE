// middlewares/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ 
                error: 'Akses ditolak. Token tidak ditemukan.' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia123');
        req.user = decoded;
        next();
    } catch (error) {
        console.error('❌ Auth error:', error.message);
        res.status(401).json({ 
            error: 'Token tidak valid atau kadaluarsa.' 
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Akses ditolak. Hanya untuk admin.' 
        });
    }
    next();
};

const siswaOnly = (req, res, next) => {
    if (req.user.role !== 'siswa') {
        return res.status(403).json({ 
            error: 'Akses ditolak. Hanya untuk siswa.' 
        });
    }
    next();
};

module.exports = { auth, adminOnly, siswaOnly };