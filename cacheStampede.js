const { db, cache } = require('./model');
const { CACHE_KEY, product_id, CACHE_EXP } = require('./testData');

const stampede = async (req, res, next) => {
  
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
  
  /*============ cache stampede prevention ============*/
  const isFirst = await cache.SETNX(CACHE_KEY);
  // console.log(isFirst);
  await cache.expire(CACHE_KEY, CACHE_EXP);
  if (!isFirst) {
    while(true) {
      cacheData = await cache.get(CACHE_KEY);
      if (cacheData) {
        res.status(200).json({ data: JSON.parse(cacheData), source: "cache" });
        break;
      }
    }
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

module.exports = { stampede };