const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Taskhubb AI Proxy Server is running' });
});

// OpenAI Chat Completion endpoint
app.post('/api/chat/completions', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || { message: 'Proxy server error' }
    });
  }
});

// OpenAI Completion endpoint (legacy)
app.post('/api/completions', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || { message: 'Proxy server error' }
    });
  }
});

// OpenAI Embeddings endpoint
app.post('/api/embeddings', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || { message: 'Proxy server error' }
    });
  }
});

// OpenAI Models endpoint
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.openai.com/v1/models',
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error || { message: 'Proxy server error' }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Taskhubb AI Proxy Server running on port ${PORT}`);
});

