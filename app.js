require('dotenv').config();
const express = require('express');
const { normalCache } = require('./normalCache');
const { penetration } = require('./cachePenetration');
const { stampede } = require('./cacheStampede');
const { avalanche } = require('./cacheAvalanche');
const { asyncHandler } = require('./util');

const app = express();

app.get('/normal', asyncHandler(normalCache));
app.get('/penetration', asyncHandler(penetration));
app.get('/stampede', asyncHandler(stampede));
app.get('/avalanche', asyncHandler(avalanche));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

app.listen(3000);