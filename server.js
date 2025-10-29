const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Enable CORS for all origins
app.use(cors());

// IMPORTANT: Increase body size limit for images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Root endpoint - health check
app.get('/', (req, res) => {
  res.json({ status: 'Taskhubb AI Proxy Server is running' });
});

// Test endpoint to check if API key is configured
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API endpoint is working',
    hasApiKey: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Main proxy endpoint for OpenAI chat completions
app.post('/api/chat/completions', async (req, res) => {
  console.log('Received request:', {
    model: req.body.model,
    messageCount: req.body.messages?.length,
    timestamp: new Date().toISOString()
  });

  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY environment variable is not set');
    return res.status(500).json({ 
      error: 'Server configuration error: API key not configured' 
    });
  }

  try {
    // Make request to OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('OpenAI API response received successfully');
    res.json(response.data);
    
  } catch (error) {
    console.error('OpenAI API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      type: error.response?.data?.error?.type,
      code: error.response?.data?.error?.code
    });
    
    // Pass through OpenAI error responses
    if (error.response?.data) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: {
          message: error.message || 'Internal server error',
          type: 'proxy_error'
        }
      });
    }
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // WRONG - missing parentheses
console.log(`Server running on port ${PORT}`);
console.log(`API Key configured: ${!!process.env.OPENAI_API_KEY}`);
});
