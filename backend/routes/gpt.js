const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your `.env`
});

// POST /api/gpt
router.post('/', async (req, res) => {
  try {
    const { message, model = 'gpt-3.5-turbo' } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message content is required and must be a string.' });
    }

    // Call OpenAI chat API
    const chatCompletion = await openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content: message }],
    });

    const reply = chatCompletion.choices[0]?.message?.content || 'No response from assistant.';
    res.status(200).json({ reply });

  } catch (error) {
    console.error('❌ GPT API Error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Unable to fetch response from OpenAI.' });
  }
});



module.exports = router;
