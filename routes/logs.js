express = require('express');
const router = express.Router();
const Log = require('../modules/log');

router.use(express.json());

router.post('/addLog', async (req, res) => {
  try {
    const { user_id, status, loginTime } = req.body;

    const logEntry = new Log({
      user_id,
      status,
      loginTime,
    });
    await logEntry.save();
    res.status(200).send('Wpis logu został utworzony');
  } catch (err) {
    res.status(500).send('Błąd podczas tworzenia wpisu logu');
  }
});

router.get('/getLogs', async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = {};
    if (user_id) {
      query.user_id = user_id;
    }

    const logs = await Log.find(query).sort({ loginTime: -1 });
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).send('Błąd podczas pobierania logów');
  }
});

module.exports = router;
