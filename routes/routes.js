const express = require("express");
const router = express.Router();
const Route = require("../modules/route");

router.use(express.json());

router.post("/addRoute", async (req, res) => {
  const {
    user_id,
    car_id,
    brand,
    model,
    start_location,
    end_location,
    distance,
    duration,
    status,
    date,
    description
  } = req.body;

  const route = new Route({
    user_id,
    car_id,
    brand,
    model,
    start_location,
    end_location,
    distance,
    duration,
    status,
    date,
    description
  });

  try {
    const newRoute = await route.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/getRoutes/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const routes = await Route.find({ user_id: userId });
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// router.delete("/deleteService/:serviceId", async (req, res) => {
//   const { serviceId } = req.params;

//   try {
//     const result = await Service.deleteOne({ _id: serviceId });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "Nie znaleziono serwisu." });
//     }
//     res.status(200).json({ message: "Serwis został poprawnie usunięty." });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.delete("/deleteServices/:carId", async (req, res) => {
//   const { carId } = req.params;

//   try {
//     const result = await Service.deleteMany({ car_id: carId});

//     if (result.deletedCount > 0) {
//       res.status(200).json({ message: `Usunięto ${result.deletedCount} serwisów`});
//     } else {
//       res.status(404).json({ message: `Nie znaleziono serwisów do usunięcia` });
//     }
//   } catch (error) {
//     console.error('Błąd podczas usuwania serwisów:', error);
//     res.status(500).json({ message: 'Błąd podczas usuwania serwisów' });
//   }
// });

module.exports = router;
