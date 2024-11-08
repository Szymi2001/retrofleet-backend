require('dotenv').config();
const express = require('express');
const router = express.Router();
const https = require('https');

//GooglePlaces API key
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

router.use(express.json());

router.get('/getCities', (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const url = new URL(
    'https://maps.googleapis.com/maps/api/place/autocomplete/json'
  );
  url.searchParams.append('input', query);
  url.searchParams.append('types', '(cities)');
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('language', 'pl');

  https
    .get(url, apiRes => {
      let data = '';

      apiRes.on('data', chunk => {
        data += chunk;
        console.log('Raw data from Google API:', data);
      });

      apiRes.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);
          const cities = jsonResponse.predictions.map(prediction => ({
            label: prediction.description,
            value: prediction.description,
            place_id: prediction.place_id // Zapisz place_id, aby uzyskać współrzędne
          }));

          // Uzyskaj współrzędne dla każdego miasta
          const cityPromises = cities.map(city => getCityCoordinates(city.place_id));
          Promise.all(cityPromises)
            .then(coordinates => {
              const citiesWithCoordinates = cities.map((city, index) => ({
                label: city.label,
                value: city.value,
                latitude: coordinates[index].lat,
                longitude: coordinates[index].lng,
              }));

              res.json(citiesWithCoordinates);
            })
            .catch(error => {
              console.error('Błąd podczas uzyskiwania współrzędnych:', error.message);
              res.status(500).json({ error: 'Błąd serwera' });
            });
        } catch (error) {
          console.error('Błąd parsowania odpowiedzi:', error.message);
          res.status(500).json({ error: 'Błąd serwera' });
        }
      });
    })
    .on('error', error => {
      console.error('Błąd:', error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    });
});

const getCityCoordinates = (placeId) => {
  return new Promise((resolve, reject) => {
    const url = new URL(
      'https://maps.googleapis.com/maps/api/geocode/json'
    );
    url.searchParams.append('place_id', placeId);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('language', 'pl');

    https.get(url, apiRes => {
      let data = '';

      apiRes.on('data', chunk => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);
          if (jsonResponse.status === 'OK') {
            const location = jsonResponse.results[0].geometry.location;
            resolve(location);
          } else {
            reject(new Error('Nie można uzyskać współrzędnych dla tego miejsca'));
          }
        } catch (error) {
          reject(new Error('Błąd parsowania odpowiedzi geocode'));
        }
      });
    }).on('error', error => {
      reject(new Error('Błąd przy zapytaniu geocode'));
    });
  });
};

router.get('/getDistance', (req, res) => {
  const { startLocation, endLocation } = req.query;

  if (!startLocation || !endLocation) {
    return res
      .status(400)
      .json({ error: 'StartLocation and EndLocation are required' });
  }

  const url = new URL(
    'https://maps.googleapis.com/maps/api/distancematrix/json'
  );
  url.searchParams.append('origins', startLocation);
  url.searchParams.append('destinations', endLocation);
  url.searchParams.append('key', API_KEY);
  url.searchParams.append('language', 'pl');

  https
    .get(url, apiRes => {
      let data = '';

      apiRes.on('data', chunk => {
        data += chunk;
      });

      apiRes.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);
          const element = jsonResponse.rows[0].elements[0];

          if (element.status === 'OK') {
            const distance = (element.distance.value / 1000).toFixed(2);
            const duration = element.duration.text;

            res.json({ distance: `${distance} km`, duration });
          } else {
            console.error('Nie można obliczyć odległości:', element.status);
            res.status(400).json({ error: 'Nie można obliczyć odległości.' });
          }
        } catch (error) {
          console.error('Błąd parsowania odpowiedzi:', error.message);
          res.status(500).json({ error: 'Błąd serwera' });
        }
      });
    })
    .on('error', error => {
      console.error('Błąd:', error.message);
      res.status(500).json({ error: 'Błąd serwera' });
    });
});

module.exports = router;
