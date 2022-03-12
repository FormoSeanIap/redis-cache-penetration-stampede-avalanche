require('dotenv').config()
const mysql = require('mysql2/promise');
const express = require('express');

const db = mysql.createPool({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PWD,
  database : process.env.DB_NAME,
});

const app = express();

app.get('/', async (req, res) => {
  const sql = 'SELECT * FROM products WHERE id = ?';
  const preSta = [1];
  const [[{id: result}]] = await db.execute(sql, preSta);
  console.log(result);
  res.send('root');
})

app.listen(3000);