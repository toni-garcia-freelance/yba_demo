const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize, testConnection } = require('./config/database');
const User = require('./src/models/User');
const authRoutes = require('./src/routes/auth');
const tasksRoutes = require('./src/routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
testConnection();

// Sync database
sequelize.sync({ force: false })
  .then(() => console.log('Database synchronized'))
  .catch(err => console.error('Error syncing database:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});  