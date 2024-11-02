const express = require("express");
const axios = require("axios");
const router = express.Router();
const Conversation = require('../models/Message'); 


const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-base';

const makeRequestWithRetry = async (inputText) => {
    const options = {
        method: "POST",
        url: HUGGING_FACE_API_URL,
        headers: {
           'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
        },
        data: { inputs: inputText },
    };

    const response = await axios(options);
    return response.data;
};

router.post("/chat", async (req, res) => {
    const { message } = req.body;

    try {
        const botResponse = await makeRequestWithRetry(message);

        // Save conversation to MongoDB
        const conversation = new Conversation({
            userMessage: message,
            botResponse: botResponse[0].generated_text || 'No response',
        });
        await conversation.save();

        res.json({ reply: botResponse[0].generated_text });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error processing your request" });
    }
});

module.exports = router;
