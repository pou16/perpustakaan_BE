const db = require('../config/database');

class Favorit {
    static async findByUser(userId) {
        const [rows] = await db.query(
            `SELECT f.*, b.judul, b.penulis, b.genre, b.rating, b.cover, b.stok
             FROM favorit f 
             JOIN buku b ON f.buku_id = b.id 
             WHERE f.user_id = ? 
             ORDER BY f.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async findOne(userId, bukuId) {
        const [rows] = await db.query(
            'SELECT * FROM favorit WHERE user_id = ? AND buku_id = ?',
            [userId, bukuId]
        );
        return rows[0];
    }

    static async create(userId, bukuId) {
        const [result] = await db.query(
            'INSERT INTO favorit (user_id, buku_id) VALUES (?, ?)',
            [userId, bukuId]
        );
        return result.insertId;
    }

    static async delete(userId, bukuId) {
        const [result] = await db.query(
            'DELETE FROM favorit WHERE user_id = ? AND buku_id = ?',
            [userId, bukuId]
        );
        return result.affectedRows;
    }

    static async countByUser(userId) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM favorit WHERE user_id = ?',
            [userId]
        );
        return rows[0].total;
    }

    static async countByBuku(bukuId) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM favorit WHERE buku_id = ?',
            [bukuId]
        );
        return rows[0].total;
    }

    static async getTotalFavorit() {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM favorit');
        return rows[0].total;
    }

    static async findMostFavorited(limit = 5) {
        const [rows] = await db.query(
            `SELECT b.id, b.judul, b.penulis, b.genre, b.rating, 
             COUNT(f.id) as favorit_count
             FROM buku b
             LEFT JOIN favorit f ON b.id = f.buku_id
             GROUP BY b.id
             ORDER BY favorit_count DESC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }
}

module.exports = Favorit;