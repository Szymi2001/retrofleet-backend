const express = require('express');
const router = express.Router();
const Event = require('../modules/event');

router.use(express.json());

router.post('/addEvent', async (req, res) => {
  const { user_id, title, subTitle, startDate, startTime, endDate, endTime } = req.body;

  const event = new Event({
    user_id,
    title,
    subTitle,
    startDate,
    startTime,
    endDate,
    endTime,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getEvents/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await Event.find({ user_id: userId }).select(
      'title subTitle startDate startTime endDate endTime -_id'
    );
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/deleteEvent/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const result = await Service.deleteOne({ _id: eventId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Nie znaleziono serwisu.' });
    }
    res.status(200).json({ message: 'Serwis został poprawnie usunięty.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
