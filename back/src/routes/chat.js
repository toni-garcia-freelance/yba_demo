const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const completion = require('../services/chatGptService');

router.post('/message', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const user = req.user;

        // Call the ChatGPT service
        const gptResponse = await completion(message, req.user.id);

        res.status(200).json({ 
            message: 'OK',
            response: gptResponse 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Error sending message' });
    }
});

module.exports = router; 