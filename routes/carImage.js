const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
        let carId = req.headers['car-id'];
        let extension = path.extname(file.originalname);

        cb(null, `${carId}${extension}`);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        res.status(201).json({ message: 'Plik przesłany pomyślnie'});
    } catch (err) {
        console.error('Błąd przesyłu pliku:', err);
        res.status(500).json({ message: 'Błąd przesyłu pliku' });
    }
});

router.get('/download/:userId', (req, res) => {
    const { userId } = req.params;
    const userDir = path.join(__dirname, '../uploads', userId);

    fs.readdir(userDir, (err, files) => {
        if (err) {
            console.error('Błąd odczytu katalogu:', err);
            return res.status(500).json({message: 'Błąd podczas odczytu katalogu'});
        }

        const filteredFiles = files.filter(file => {
            const fileNameWithoutExt = path.parse(file).name;
            return fileNameWithoutExt !== 'profile_image';
        });

        const images = [];

        filteredFiles.forEach(file => {
            const imagePath = path.join(userDir, file);
            const imageBuffer = fs.readFileSync(imagePath);
            const base64Image = Buffer.from(imageBuffer).toString('base64');
            const base64String = `data:image/png;base64,${base64Image}`;
            images.push(base64String);
        });
        res.json(images);
    });
});

router.delete('/delete/:userId/:carId', (req, res) => {
    const { userId, carId } = req.params;
    const userDir = path.join(__dirname, '../uploads', userId);

    fs.readdir(userDir, (err, files) => {
        if (err) {
            console.error('Błąd odczytu katalogu:', err);
            return res.status(500).json({ message: 'Błąd podczas odczytu katalogu' });
        }

        const fileToDelete = files.find(file => {
            const fileBaseName = path.basename(file, path.extname(file));
            return fileBaseName === carId;
        });

        if (fileToDelete) {
            const filePath = path.join(userDir, fileToDelete);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Błąd usuwania pliku:', err);
                    return res.status(500).json({ message: 'Błąd podczas usuwania pliku' });
                }

                res.status(200).json({ message: 'Plik został pomyślnie usunięty' });
            });
        } else {
            return;
        }
    });
});

module.exports = router;
