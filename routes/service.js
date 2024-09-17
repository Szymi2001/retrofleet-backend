const express = require('express');
const router = express.Router();
const Service = require('../modules/service');

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

router.post('/addService', async (req, res) => {
  const {
    user_id,
    car_id,
    brand,
    model,
    price,
    date,
    isoDate,
    mileage,
    description,
    type,
  } = req.body;

  const service = new Service({
    user_id,
    car_id,
    brand,
    model,
    price,
    date,
    isoDate,
    mileage,
    description,
    type,
  });

  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getServices/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const services = await Service.find({ user_id: userId });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getService/:carId', async (req, res) => {
  const { carId } = req.params;

  try {
    const service = await Service.find({ car_id: carId });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getTotalPrice/:carId', async (req, res) => {
  const { carId } = req.params;

  try {
    const service = await Service.find({ car_id: carId });

    //Sumowanie wydatków
    const totalPrice = service.reduce(
      (total, service) => total + service.price,
      0
    );

    res.status(200).json({
      totalPrice,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getTotalPriceByType/:carId', async (req, res) => {
  const { carId } = req.params;

  try {
    const service = await Service.find({ car_id: carId });

    //Sumowanie wydatków po typie serwisu
    const totalPriceMap = new Map();

    service.forEach(service => {
      const { type, price } = service;

      if (totalPriceMap.has(type)) {
        const currentTotal = totalPriceMap.get(type);
        totalPriceMap.set(type, currentTotal + price);
      } else {
        totalPriceMap.set(type, price);
      }
    });

    const totalPriceByType = Array.from(totalPriceMap.entries()).map(
      ([type, totalPrice]) => ({
        type,
        totalPrice,
      })
    );

    res.status(200).json({
      totalPriceByType,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getTotalPriceByMonth/:carId', async (req, res) => {
  const { carId } = req.params;
  const year = parseInt(req.query.year, 10);

  try {
    const services = await Service.find({ car_id: carId });

    // Filtrowanie dokumentów na podstawie przekazanego roku
    const filteredServices = services.filter(service => {
      const serviceDate = new Date(service.isoDate);
      const serviceYear = serviceDate.getFullYear();
      console.log(`Service year: ${serviceYear}`);
      return serviceYear === year;
    });

    // Sumowanie wydatków po miesiącu
    const totalPriceMap = new Map();

    filteredServices.forEach(service => {
      const { price, isoDate } = service;
      const month = new Date(isoDate).getMonth() + 1;

      if (totalPriceMap.has(month)) {
        const currentTotal = totalPriceMap.get(month);
        totalPriceMap.set(month, currentTotal + price);
      } else {
        totalPriceMap.set(month, price);
      }
    });

    // Dodanie miesięcy, które nie występują w danych
    for (let month = 1; month <= 12; month++) {
      if (!totalPriceMap.has(month)) {
        totalPriceMap.set(month, 0);
      }
    }

    const totalPriceByMonth = Array.from(totalPriceMap.entries())
      .map(([month, totalPrice]) => ({
        year,
        month,
        totalPrice,
      }))
      .sort((a, b) => a.month - b.month);

    // Wyświetlenie sumy wydatków miesięcznie
    console.log('Total price by month:', totalPriceByMonth);

    res.status(200).json({
      totalPriceByMonth,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteService/:serviceId', async (req, res) => {
  const { serviceId } = req.params;

  try {
    const result = await Service.deleteOne({ _id: serviceId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Nie znaleziono serwisu.' });
    }
    res.status(200).json({ message: 'Serwis został poprawnie usunięty.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteServices/:carId', async (req, res) => {
  const { carId } = req.params;

  try {
    const result = await Service.deleteMany({ car_id: carId });

    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({ message: `Usunięto ${result.deletedCount} serwisów` });
    } else {
      res.status(404).json({ message: `Nie znaleziono serwisów do usunięcia` });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania serwisów:', error);
    res.status(500).json({ message: 'Błąd podczas usuwania serwisów' });
  }
});

module.exports = router;
