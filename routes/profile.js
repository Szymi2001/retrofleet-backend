const express = require('express')
const router = express.Router()
const User = require('../modules/user')

router.use(express.json())

router.get('/getUserInfo/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const userInfo = await User.findById(userId);
        if (!userInfo) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        
        res.status(200).json(userInfo);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/updateUserInfo', async (req, res) => {
    const { userId, name, surname } = req.body;

    const existingUser = await User.findOne({ _id: userId });
    
    try {
        if (name && surname) {
            existingUser.name = name;
            existingUser.surname = surname;
        }

        const updatedUser = await existingUser.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/setRemindQuestions', async (req, res) => {
    const { userId, first_question, first_answer, second_question, second_answer } = req.body;

    const existingUser = await User.findOne({ _id: userId });

    try {
        if (first_question && first_answer && second_question && second_answer) {
            existingUser.first_question = first_question;
            existingUser.first_answer = first_answer;
            existingUser.second_question = second_question;
            existingUser.second_answer = second_answer;
        }

        const updatedUser = await existingUser.save();
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/getRemindQuestions', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ message: 'Brakujące userId' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }

        const remindQuestions = {
            first_question: user.first_question,
            second_question: user.second_question
        };

        res.json({ remindQuestions });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//usuwanie konta użytkownika wraz z jego powiązaniami (events, fleets, images, services, users)

module.exports = router
