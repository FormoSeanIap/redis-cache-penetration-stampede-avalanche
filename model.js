require('dotenv').config()

const mysql = require('mysql2/promise');
const redis = require('redis');

const db = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB_NAME,
});

const cache = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PWD,
});

cache.connect();

cache.on('ready', () => {
  console.log('Redis is ready');
});

cache.on("error", (err) => {
  console.log("Redis error: ", err);
});

module.exports =  { db, cache };