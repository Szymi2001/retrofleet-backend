const express = require('express');
const router = express.Router();
const Fueling = require('../modules/fueling');

const monthsMap = {
  styczeń: 1,
  luty: 2,
  marzec: 3,
  kwiecień: 4,
  maj: 5,
  czerwiec: 6,
  lipiec: 7,
  sierpień: 8,
  wrzesień: 9,
  październik: 10,
  listopad: 11,
  grudzień: 12,
};

router.use(express.json());

router.post('/addFueling', async (req, res) => {
  const {
    user_id,
    car_id,
    brand,
    model,
    price,
    date,
    mileage,
    description,
    fuelType,
    fuelAmount,
    transactionType,
    receiptNumber
  } = req.body;

  const fueling = new Fueling({
    user_id,
    car_id,
    brand,
    model,
    price,
    date,
    mileage,
    description,
    fuelType,
    fuelAmount,
    transactionType,
    receiptNumber
  });

  try {
    const newFueling = await fueling.save();
    res.status(201).json(newFueling);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getFuelings/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const fuelings = await Fueling.find({ user_id: userId });
    res.status(200).json(fuelings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getFueling/:carId', async (req, res) => {
  const { carId } = req.params;

  try {
    const fueling = await Fueling.find({ car_id: carId });
    res.status(200).json(fueling);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// router.delete('/deleteService/:serviceId', async (req, res) => {
//   const { serviceId } = req.params;

//   try {
//     const result = await Service.deleteOne({ _id: serviceId });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'Nie znaleziono serwisu.' });
//     }
//     res.status(200).json({ message: 'Serwis został poprawnie usunięty.' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.delete('/deleteServices/:carId', async (req, res) => {
//   const { carId } = req.params;

//   try {
//     const result = await Service.deleteMany({ car_id: carId });

//     if (result.deletedCount > 0) {
//       res
//         .status(200)
//         .json({ message: `Usunięto ${result.deletedCount} serwisów` });
//     } else {
//       res.status(404).json({ message: `Nie znaleziono serwisów do usunięcia` });
//     }
//   } catch (error) {
//     console.error('Błąd podczas usuwania serwisów:', error);
//     res.status(500).json({ message: 'Błąd podczas usuwania serwisów' });
//   }
// });

module.exports = router;
