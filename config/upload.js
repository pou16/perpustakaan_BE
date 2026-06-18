const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Pastikan folder uploads ada
const uploadDir = path.join(__dirname, '../uploads');
const coversDir = path.join(uploadDir, 'covers');

// Buat folder jika belum ada
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(coversDir)) {
    fs.mkdirSync(coversDir, { recursive: true });
}

// Konfigurasi storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Tentukan folder berdasarkan type
        let folder = 'uploads';
        if (file.fieldname === 'cover') {
            folder = 'uploads/covers';
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // Buat nama file unik
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueId}${ext}`;
        cb(null, fileName);
    }
});

// Filter file
const fileFilter = (req, file, cb) => {
    // Validasi tipe file
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'image/jpg'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.'), false);
    }
};

// Konfigurasi multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 2097152, // 2MB default
        files: 1 // Maksimal 1 file
    },
    fileFilter: fileFilter
});

// Middleware untuk single file upload
const uploadCover = upload.single('cover');

// Middleware untuk multiple file upload
const uploadMultiple = upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'attachment', maxCount: 3 }
]);

// Fungsi untuk menghapus file
const deleteFile = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

// Fungsi untuk menghapus cover berdasarkan nama
const deleteCover = (coverName) => {
    if (!coverName) return false;
    const filePath = path.join(coversDir, coverName);
    return deleteFile(filePath);
};

// Fungsi untuk mendapatkan URL file
const getFileUrl = (req, fileName, folder = 'covers') => {
    if (!fileName) return null;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return `${baseUrl}/uploads/${folder}/${fileName}`;
};

// Fungsi untuk validasi file
const validateFile = (file) => {
    if (!file) {
        return { valid: false, message: 'File tidak ditemukan' };
    }

    // Validasi ukuran
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 2097152;
    if (file.size > maxSize) {
        return { 
            valid: false, 
            message: `Ukuran file terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB` 
        };
    }

    // Validasi dimensi (opsional)
    // Bisa ditambahkan jika diperlukan

    return { valid: true };
};

module.exports = {
    upload,
    uploadCover,
    uploadMultiple,
    deleteFile,
    deleteCover,
    getFileUrl,
    validateFile,
    uploadDir,
    coversDir
};