const express = require('express')
const router = express.Router()
const Fleet = require('../modules/fleet')

router.use(express.json())

router.post('/addVehicle', async (req, res) => {
    const { 
        user_id,
	    vin,
        mileage,
        brand, 
        model, 
        year,
        body_type,
        fuel_type,
        color,
        is_heritage_listed,
        technical_inspection_date,
        registration_number,
        insurance_expiry_date
    } = req.body;

    const vehicle = new Fleet({
        user_id,
	    vin,
        mileage,
        brand,
        model, 
        year,
        body_type,
        fuel_type,
        color,
        is_heritage_listed,
        technical_inspection_date,
        registration_number,
        insurance_expiry_date
    });

    try {
        const newVehicle = await vehicle.save();
        res.status(201).json(newVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/getVehicles/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const vehicles = await Fleet.find({user_id: userId});
        res.status(200).json(vehicles);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.delete('/deleteVehicle/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const result = await Fleet.deleteOne({_id: vehicleId});
        if (result.deletedCount === 0) {
            return res.status(404).json({message: 'Nie znaleziono pojazdu.'});
        }
        res.status(200).json({message: 'Pojazd został poprawnie usunięty.'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.put('/updateMileage/:vehicleId', async (req, res) => {
    const { vehicleId } = req.params;
    const { mileage } = req.body;

    try {
        const vehicle = await Fleet.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Nie znaleziono pojazdu.' });
        }
        vehicle.mileage = mileage;
        const updatedVehicle = await vehicle.save();
        res.status(200).json(updatedVehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router