require('dotenv').config()
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();

//MongoDB
const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;

// Ścieżki do certyfikatu i klucza
const keyPath = path.join(__dirname, 'localhost.key');
const certPath = path.join(__dirname, 'localhost.crt');

// Certyfikat SSL
const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

const allowedOrigins = [
    'http://localhost:8100',
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Niedozwolony dostęp do tego źródłą'))
        }
    },
    credentials: true
}));

app.use(express.json())

mongoose.connect(DATABASE_URI, {
}).then(() => {
    console.log('Połączono z bazą MongoDB')
}).catch(error => {
    console.error('Błąd połączenia z bazą danych:', error);
    process.exit(1);
});

const userRouter = require('./routes/users');
const fleetRouter = require('./routes/fleets');
const serviceRouter = require('./routes/service');
const carImageRouter = require('./routes/carImage');
const profileImageRouter = require('./routes/profileImage');
const profileRouter = require('./routes/profile');
const eventRouter = require('./routes/events');
const logRouter = require('./routes/logs');
const routeRouter = require('./routes/routes');
const googlePlacesRouter = require('./routes/googlePlaces');

app.use('/users', userRouter);
app.use('/fleet', fleetRouter);
app.use('/service', serviceRouter);
app.use('/carImage', carImageRouter);
app.use('/profileImage', profileImageRouter);
app.use('/profile', profileRouter);
app.use('/event', eventRouter);
app.use('/log', logRouter);
app.use('/route', routeRouter);
app.use('/googlePlaces', googlePlacesRouter);

// https.createServer(options, app).listen(PORT, () => {
//     console.log('Serwer działa na porcie: ' + process.env.PORT);
// });
app.listen(PORT, () => {
    console.log('Serwer działa na porcie: ' + process.env.PORT)
});


