require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Konfiguracja multer do przechowywania plików w pamięci
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('image'), (req, res) => {
    const userId = req.headers['user-id'];
    const carId = req.headers['car-id'];

    if (!userId || !carId) {
        return res.status(400).json({ message: 'User ID and Car ID are required' });
    }
    console.log('UserId: ' + userId, 'carId: ' + carId)

    const uploadToCloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `uploads/${userId}`,
                    public_id: carId,
                    overwrite: true
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });
    };

    uploadToCloudinary(req.file.buffer)
        .then((result) => {
            res.status(201).json({
                message: 'Plik przesłany pomyślnie do Cloudinary',
                url: result.secure_url
            });
        })
        .catch((error) => {
            console.error('Błąd przesyłu pliku:', error);
            res.status(500).json({ message: 'Błąd przesyłu pliku' });
        });
});

router.get('/download/:userId', async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        return res.status(400).json({ message: 'Id użytkownika jest wymagane' });
    }

    try {
        // Pobranie wszystkich zasobów z folderu userId
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `uploads/${userId}`,
            max_results: 100
        });

        // Mapowanie wyników na listę URL-i obrazów
        const imageDetails = result.resources.map(resource => {
            const carId = resource.public_id.split('/').pop();
            return {
                carId: carId,
                url: resource.secure_url
            };  
        });

        res.status(200).json({
            images: imageDetails
        });
    } catch (error) {
        console.error('Błąd pobierania obrazów:', error);
        res.status(500).json({ message: 'Błąd pobierania obrazów' });
    }
});

router.delete('/delete/:userId/:carId', async (req, res) => {
    const { userId, carId } = req.params;

    if (!userId || !carId) {
        return res.status(400).json({ message: 'Id użytkownika i pojazdu jest wymagane' });
    }

    try {
        const result = await cloudinary.uploader.destroy(
            `uploads/${userId}/${carId}`,
            {
                resource_type: 'image'
            }
        );

        if (result.result === 'ok') {
            return res.status(200).json({ message: 'Plik został usunięty' });
        } else {
            return res.status(404).json({ message: 'Plik nie został znaleziony' });
        }
    } catch (error) {
        console.error('Błąd usuwania pliku:', error);
        return res.status(500).json({ message: 'Błąd usuwania pliku' });
    }
});

module.exports = router;