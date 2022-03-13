const { db, cache } = require('./model');
const { CACHE_KEY, CACHE_EXP, product_id } = require('./testData');

const penetration = async (req, res, next) => {
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

  try {
    [[dbData]] = await db.execute(sql, preSta);
  } catch (err) {
    console.error(`Get db data error: ${err}`);
  }
  /*============ cache penetration prevention ============*/  
  if (!dbData) dbData = {};
  try {
    await cache.set(CACHE_KEY, JSON.stringify(dbData));
    await cache.expire(CACHE_KEY, CACHE_EXP);
    res.status(200).json({ data: dbData, source: "DB" });
    return;
  } catch (err) {
    console.error(`Set cache data error: ${err}`);
  } 
}

module.exports = { penetration };