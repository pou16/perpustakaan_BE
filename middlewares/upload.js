const { uploadCover, uploadMultiple, validateFile } = require('../config/upload');
const path = require('path');

// Middleware untuk upload cover dengan error handling
const handleCoverUpload = (req, res, next) => {
    uploadCover(req, res, (err) => {
        if (err) {
            // Error dari multer
            if (err.code === 'FILE_TOO_LARGE') {
                return res.status(400).json({
                    error: 'Ukuran file terlalu besar. Maksimal 2MB.'
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    error: 'Hanya boleh upload 1 file.'
                });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    error: 'Field name harus "cover".'
                });
            }
            return res.status(400).json({
                error: err.message || 'Gagal upload file.'
            });
        }

        // Validasi file
        if (req.file) {
            const validation = validateFile(req.file);
            if (!validation.valid) {
                // Hapus file yang sudah terupload jika tidak valid
                const fs = require('fs');
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    error: validation.message
                });
            }
        }

        next();
    });
};

// Middleware untuk multiple upload
const handleMultipleUpload = (req, res, next) => {
    uploadMultiple(req, res, (err) => {
        if (err) {
            if (err.code === 'FILE_TOO_LARGE') {
                return res.status(400).json({
                    error: 'Ukuran file terlalu besar. Maksimal 2MB.'
                });
            }
            return res.status(400).json({
                error: err.message || 'Gagal upload file.'
            });
        }

        // Validasi semua file
        const files = req.files || {};
        for (const [fieldname, fileList] of Object.entries(files)) {
            for (const file of fileList) {
                const validation = validateFile(file);
                if (!validation.valid) {
                    // Hapus semua file yang sudah terupload
                    const fs = require('fs');
                    for (const [f, fl] of Object.entries(req.files || {})) {
                        for (const fl of fl) {
                            if (fs.existsSync(fl.path)) {
                                fs.unlinkSync(fl.path);
                            }
                        }
                    }
                    return res.status(400).json({
                        error: validation.message
                    });
                }
            }
        }

        next();
    });
};

// Middleware untuk generate URL file
const generateFileUrls = (req, res, next) => {
    const { getFileUrl } = require('../config/upload');
    
    // Tambahkan method ke response locals
    res.locals.getFileUrl = (fileName, folder = 'covers') => {
        return getFileUrl(req, fileName, folder);
    };
    
    next();
};

module.exports = {
    handleCoverUpload,
    handleMultipleUpload,
    generateFileUrls
};