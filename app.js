require('dotenv').config();
const express = require('express');
const { normalCache } = require('./normalCache');
const { penetration } = require('./cachePenetration');
const { stampede } = require('./cacheStampede');
const { asyncHandler } = require('./util');

const app = express();

app.get('/', asyncHandler(normalCache));
app.get('/penetration', asyncHandler(penetration));
app.get('/stampede', asyncHandler(stampede));

app.listen(3000);