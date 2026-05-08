const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const candidateRoutes = require('./routes/candidateRoutes');
const matchRoutes = require('./routes/matchRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api', matchRoutes); // /api/match and /api/ai/shortlist

app.get('/', (req, res) => {
  res.send('Candidate Profile Shortlisting System API is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
