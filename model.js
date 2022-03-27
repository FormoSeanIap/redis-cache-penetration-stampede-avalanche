require('dotenv').config()

const mysql = require('mysql2/promise');
const redis = require('redis');
const ioRedis = require("ioredis");

const db = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB_NAME,
});

const cache = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },  
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

const redisCluster = new ioRedis.Cluster([
  {
    port: process.env.CLUSTER_1_PORT,
    host: process.env.CLUSTER_1_HOST,
  },
  // {
  //   port: 7001,
  //   host: "127.0.0.1",
  // },
  // {
  //   port: 7002,
  //   host: "127.0.0.1",
  // },
  // {
  //   port: 7003,
  //   host: "127.0.0.1",
  // },
  // {
  //   port: 7004,
  //   host: "127.0.0.1",
  // },
  // {
  //   port: 7005,
  //   host: "127.0.0.1",
  // },
  // {
  //   port: 7006,
  //   host: "127.0.0.1",
  // },
  // {
  //   port: 7007,
  //   host: "127.0.0.1",
  // },
]);

module.exports =  { db, cache, redisCluster };