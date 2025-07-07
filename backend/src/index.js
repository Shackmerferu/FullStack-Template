const express = require('express');
const path = require('path');
const morgan = require('morgan');
const itemsRouter = require('./routes/items');
const statsRouter = require('./routes/stats');
const cors = require('cors');
const { getCookie, notFound } = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:3000' }));

// Basic middleware
app.use(express.json());
app.use(logger);
app.use(morgan('dev'));

// Root route to prevent "Route Not Found" error on "/"
app.get('/', (req, res) => {
  res.send('API Backend is running and ready to serve requests.');
});

// Routes
app.use('/api/items', itemsRouter);
app.use('/api/stats', statsRouter);

// Not Found
app.use('*', notFound);

getCookie();

app.listen(port, () => console.log('Backend running on http://localhost:' + port));
