import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 2000;

// Middleware to serve static files
app.use(express.static('public'));
app.use(express.json());

// Set up the AI model
let model;
try {
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  console.log('Model initialized successfully');
} catch (error) {
  console.error('Error initializing model:', error);
}

// Route for handling the AI request
app.post('/generate', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'No question provided.' });
  }

  if (!model) {
    return res.status(500).json({ error: 'Model not initialized.' });
  }

  try {
    const response = await model.generate({ prompt: question });
    res.json({ response: response.data });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});