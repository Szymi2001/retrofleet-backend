const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../modules/user');

router.use(express.json());

router.post('/login', async (req, res) => {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Użytkownik o podanym loginie nie istnieje' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nieprawidłowe hasło' });
    }
    console.log('User authenticated:', user);
    res.status(200).json({ id: user._id });
  } catch (error) {
    console.error('Błąd podczas logowania:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera.' });
  }
});

router.post('/register', async (req, res) => {
  const { login, password, email } = req.body;

  // Sprawdź, czy użytkownik o podanym adresie email już istnieje w bazie danych
  const existingUser = await User.findOne({ login });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: 'Użytkownik o podanym loginie już istnieje' });
  }

  // Haszuj hasło przed zapisaniem do bazy danych
  const hashedPassword = await bcrypt.hash(password, 10); // Haszowanie hasła z solą

  const user = new User({
    login,
    password: hashedPassword,
    email,
    name: '',
    surname: '',
    first_question: '',
    first_answer: '',
    second_question: '',
    second_answer: '',
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/changePassword', async (req, res) => {
  const { userId, old_password, new_password } = req.body;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Użytkownik o podanym identyfikatorze nie istnieje' });
    }

    const isPasswordValid = await bcrypt.compare(
      `${old_password}`,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Nieprawidłowe hasło' });
    }

    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Hasło zostało zmienione pomyślnie' });
  } catch (error) {
    res.status(500).json({ message: 'Wystąpił błąd', error: error.message });
  }
});

router.post('/getUserIdByLogin', async (req, res) => {
  const { login } = req.body;

  try {
    const user = await User.findOne({ login });
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Użytkownik o podanym loginie nie istnieje' });
    }

    res.status(200).json({ user_id: user._id });
  } catch (error) {
    console.error('Błąd podczas pobierania user_id:', error);
    res.status(500).json({ message: 'Wystąpił błąd serwera' });
  }
});

module.exports = router;
