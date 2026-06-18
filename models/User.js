// models/User.js
const db = require('../config/database');

class User {
    static async findAll() {
        const [rows] = await db.query(
            'SELECT id, username, nama_lengkap, role, created_at FROM users ORDER BY created_at DESC'
        );
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query(
            'SELECT id, username, nama_lengkap, role, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async findByUsername(username) {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        return rows[0];
    }

    static async create(userData) {
        const { username, password, nama_lengkap, role } = userData;
        
        const [result] = await db.query(
            'INSERT INTO users (username, password, nama_lengkap, role) VALUES (?, ?, ?, ?)',
            [username, password, nama_lengkap, role || 'siswa']
        );
        return result.insertId;
    }

    static async update(id, userData) {
        const { nama_lengkap, role } = userData;
        const [result] = await db.query(
            'UPDATE users SET nama_lengkap = ?, role = ? WHERE id = ?',
            [nama_lengkap, role, id]
        );
        return result.affectedRows;
    }

    static async updatePassword(id, newPassword) {
        const [result] = await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [newPassword, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = User;