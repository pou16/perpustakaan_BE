const db = require('../config/database');

class Komentar {
    static async findByBuku(bukuId) {
        const [rows] = await db.query(
            `SELECT k.*, u.nama_lengkap, u.username 
             FROM komentar k 
             JOIN users u ON k.user_id = u.id 
             WHERE k.buku_id = ? 
             ORDER BY k.created_at DESC`,
            [bukuId]
        );
        return rows;
    }

    static async findByUser(userId) {
        const [rows] = await db.query(
            `SELECT k.*, b.judul as buku_judul, b.cover 
             FROM komentar k 
             JOIN buku b ON k.buku_id = b.id 
             WHERE k.user_id = ? 
             ORDER BY k.created_at DESC`,
            [userId]
        );
        return rows;
    }

    static async create(komentarData) {
        const { user_id, buku_id, komentar, rating } = komentarData;
        const [result] = await db.query(
            'INSERT INTO komentar (user_id, buku_id, komentar, rating) VALUES (?, ?, ?, ?)',
            [user_id, buku_id, komentar, rating || 0]
        );
        return result.insertId;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM komentar WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async update(id, komentarData) {
        const { komentar, rating } = komentarData;
        const [result] = await db.query(
            'UPDATE komentar SET komentar = ?, rating = ? WHERE id = ?',
            [komentar, rating, id]
        );
        return result.affectedRows;
    }

    static async countByBuku(bukuId) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM komentar WHERE buku_id = ?',
            [bukuId]
        );
        return rows[0].total;
    }

    static async countByUser(userId) {
        const [rows] = await db.query(
            'SELECT COUNT(*) as total FROM komentar WHERE user_id = ?',
            [userId]
        );
        return rows[0].total;
    }

    static async getAverageRating(bukuId) {
        const [rows] = await db.query(
            'SELECT COALESCE(AVG(rating), 0) as avg_rating FROM komentar WHERE buku_id = ?',
            [bukuId]
        );
        return rows[0].avg_rating;
    }

    static async getLatest(limit = 5) {
        const [rows] = await db.query(
            `SELECT k.*, u.nama_lengkap, b.judul as buku_judul
             FROM komentar k
             JOIN users u ON k.user_id = u.id
             JOIN buku b ON k.buku_id = b.id
             ORDER BY k.created_at DESC
             LIMIT ?`,
            [limit]
        );
        return rows;
    }
}

module.exports = Komentar;