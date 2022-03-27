const { db, cache } = require('./model');
const { CACHE_KEY, CACHE_EXP, product_id } = require('./testData');

const normalCache = async (req, res, next) => {
  let cacheData;

  try {
    cacheData = await cache.get(CACHE_KEY);
  } catch (err) {
    console.error(`Get cache data error: ${err}`);
  }

  if (cacheData) {
    res.status(200).json({ data: JSON.parse(cacheData), source: "cache" });
    return;
  } 

  const sql = 'SELECT * FROM products WHERE id = ?';
  const preSta = [product_id];
  let dbData;
  console.log('test')
  try {
    [[dbData]] = await db.execute(sql, preSta);
  } catch (err) {
    console.error(`Get db data error: ${err}`);
  }

  if (dbData) {
    try {
      await cache.set(CACHE_KEY, JSON.stringify(dbData));
      await cache.expire(CACHE_KEY, CACHE_EXP);
    } catch (err) {
      console.error(`Set cache data error: ${err}`);
    }
  } else {    
    dbData = {};
  }
  
  res.status(200).json({ data: dbData, source: "DB" });
  return;  
}

module.exports = { normalCache };