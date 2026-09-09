require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { nanoid } = require('nanoid');
const Url = require('./models/Url');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Create a short URL
app.post('/api/shorten', async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: 'originalUrl is required' });
    }

    const shortCode = nanoid(7);
    const newUrl = new Url({ originalUrl, shortCode });
    await newUrl.save();

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      shortCode,
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all URLs (for dashboard list)
app.get('/api/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    const summary = urls.map((url) => ({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      totalClicks: url.clicks.length,
      createdAt: url.createdAt,
    }));
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get detailed click stats for one URL
app.get('/api/urls/:shortCode/stats', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      totalClicks: url.clicks.length,
      clicks: url.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Redirect + log click
app.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).send('URL not found');

    url.clicks.push({
      referrer: req.get('Referrer') || 'direct',
      userAgent: req.get('User-Agent') || 'unknown',
    });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).send('Something went wrong');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});