const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfiguracja Multer dla zapisywania plików
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let userId = req.headers['user-id'];
        let userUploadPath = path.join('uploads', userId);

        if (!fs.existsSync(userUploadPath)) {
            fs.mkdirSync(userUploadPath, { recursive: true });
        }

        cb(null, userUploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, 'profile_image' + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Endpoint do przesyłania pliku
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        res.status(201).json({ message: 'Plik przesłany pomyślnie' });
    } catch (err) {
        console.error('Błąd przesyłu pliku:', err);
        res.status(500).json({ message: 'Błąd przesyłu pliku' });
    }
});

// Endpoint do pobierania zdjęć
router.get('/download/:userId', (req, res) => {
    const { userId } = req.params;
    const userDir = path.join(__dirname, '../uploads', userId, 'profile_image');

    // Sprawdzenie istnienia pliku
    if (fs.existsSync(userDir)) {
        const imageBuffer = fs.readFileSync(userDir);
        const base64Image = Buffer.from(imageBuffer).toString('base64');
        const base64String = `data:image/png;base64,${base64Image}`;
        res.json([base64String]);
    } else {
        res.status(404).json({ message: 'Plik nie znaleziony' });
    }
});

// Endpoint do usuwania zdjęcia
router.delete('/delete/:userId', (req, res) => {
    const { userId } = req.params;
    const filePath = path.join(__dirname, '../uploads', userId, 'profile_image');

    // Sprawdzenie istnienia pliku i jego usunięcie
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Błąd usuwania pliku:', err);
                return res.status(500).json({ message: 'Błąd podczas usuwania pliku' });
            }
            res.status(200).json({ message: 'Plik został pomyślnie usunięty' });
        });
    } else {
        res.status(404).json({ message: 'Plik nie znaleziony' });
    }
});

module.exports = router;
