const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;


app.use(cors());
app.use(bodyParser.json());


const MONGO_URI = 'mongodb://localhost:27017/ayurvedic_chatbot';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const faqSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const FAQ = mongoose.model('FAQ', faqSchema);


app.get('/', (req, res) => {
  res.send('Ayurvedic Chatbot API');
});


app.get('/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/faqs', async (req, res) => {
  const { question, answer } = req.body;
  try {
    const newFAQ = new FAQ({ question, answer });
    await newFAQ.save();
    res.status(201).json(newFAQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/chat', async (req, res) => {
  const { query } = req.body;
  try {
    const matchedFAQ = await FAQ.findOne({
      question: { $regex: query, $options: 'i' }, 
    });

    if (matchedFAQ) {
      res.json({ response: matchedFAQ.answer });
    } else {
      res.json({ response: "I'm sorry, I couldn't find an answer to your query. Please try rephrasing." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
