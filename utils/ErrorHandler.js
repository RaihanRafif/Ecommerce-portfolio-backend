// errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error stack ke console untuk debugging

    // Menentukan status code dan pesan berdasarkan tipe kesalahan
    const statusCode = err.statusCode || 500; // Gunakan status code dari error jika ada, default 500
    const message = err.message || 'Internal Server Error'; // Gunakan pesan dari error jika ada, default 'Internal Server Error'

    // Kirimkan response dengan status code dan pesan
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};

module.exports = errorHandler;
