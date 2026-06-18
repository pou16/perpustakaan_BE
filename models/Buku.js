// models/Buku.js
const db = require('../config/database');

class Buku {
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM buku ORDER BY created_at DESC');
            return rows;
        } catch (error) {
            console.error('❌ Buku.findAll error:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM buku WHERE id = ?', [id]);
            return rows[0];
        } catch (error) {
            console.error('❌ Buku.findById error:', error);
            throw error;
        }
    }

    static async findRekomendasi(limit = 10) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM buku WHERE rating >= 4.0 ORDER BY rating DESC, created_at DESC LIMIT ?',
                [limit]
            );
            return rows;
        } catch (error) {
            console.error('❌ Buku.findRekomendasi error:', error);
            throw error;
        }
    }

    static async findPopuler(limit = 8) {
        try {
            const [rows] = await db.query(
                `SELECT b.*, COUNT(f.id) as favorit_count 
                 FROM buku b 
                 LEFT JOIN favorit f ON b.id = f.buku_id 
                 GROUP BY b.id 
                 ORDER BY favorit_count DESC, b.rating DESC 
                 LIMIT ?`,
                [limit]
            );
            return rows;
        } catch (error) {
            console.error('❌ Buku.findPopuler error:', error);
            throw error;
        }
    }

    static async getGenres() {
        try {
            const [rows] = await db.query(
                'SELECT DISTINCT genre FROM buku WHERE genre IS NOT NULL ORDER BY genre'
            );
            return rows.map(row => row.genre);
        } catch (error) {
            console.error('❌ Buku.getGenres error:', error);
            throw error;
        }
    }

    static async getGenreStats() {
        try {
            const [rows] = await db.query(
                `SELECT genre, COUNT(*) as total 
                 FROM buku 
                 WHERE genre IS NOT NULL 
                 GROUP BY genre 
                 ORDER BY total DESC`
            );
            return rows;
        } catch (error) {
            console.error('❌ Buku.getGenreStats error:', error);
            throw error;
        }
    }

    static async create(bukuData) {
        const { 
            judul, penulis, penerbit, tahun_terbit, 
            genre, rating, cover, stok, deskripsi 
        } = bukuData;
        
        const [result] = await db.query(
            `INSERT INTO buku 
             (judul, penulis, penerbit, tahun_terbit, genre, rating, cover, stok, deskripsi) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [judul, penulis, penerbit, tahun_terbit, genre, rating || 0, cover, stok || 1, deskripsi]
        );
        return result.insertId;
    }

    static async update(id, bukuData) {
        const { 
            judul, penulis, penerbit, tahun_terbit, 
            genre, rating, cover, stok, deskripsi 
        } = bukuData;
        
        const [result] = await db.query(
            `UPDATE buku SET 
             judul = ?, penulis = ?, penerbit = ?, 
             tahun_terbit = ?, genre = ?, rating = ?, 
             cover = ?, stok = ?, deskripsi = ? 
             WHERE id = ?`,
            [judul, penulis, penerbit, tahun_terbit, genre, rating, cover, stok, deskripsi, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM buku WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Buku;