require('dotenv').config()
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')
const cors = require('cors')

const app = express();

//MongoDB
const DATABASE_URI = process.env.DATABASE_URI;

app.use(cors({ 
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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
const fuelingRouter = require('./routes/fuelings');
const carImageRouter = require('./routes/carImage');
const profileImageRouter = require('./routes/profileImage');
const profileRouter = require('./routes/profile');
const eventRouter = require('./routes/events');
const routeRouter = require('./routes/routes');
const googlePlacesRouter = require('./routes/googlePlaces');

app.use('/users', userRouter);
app.use('/fleet', fleetRouter);
app.use('/service', serviceRouter);
app.use('/fueling', fuelingRouter);
app.use('/carImage', carImageRouter);
app.use('/profileImage', profileImageRouter);
app.use('/profile', profileRouter);
app.use('/event', eventRouter);
app.use('/route', routeRouter);
app.use('/googlePlaces', googlePlacesRouter);

app.listen(() => {
    console.log('Server is working...');
});


