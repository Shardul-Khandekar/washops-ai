require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const washRoutes = require('./routes/washRoutes');
const opsRoutes = require('./routes/opsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/washes', washRoutes);
app.use('/api/ops', opsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`WashOps Backend running on port ${PORT}`);
});