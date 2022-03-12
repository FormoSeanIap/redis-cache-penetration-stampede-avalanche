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
  await cache.expire(CACHE_KEY, CACHE_EXP);
  // console.log(isFirst);
  if (!isFirst) {
    setTimeout(async () => {
      /*============ TODO: 為什麼有時候會失敗？是不是因為setTimeout可能會比promise早丟進queue而且還執行完 ============*/
      cacheData = await cache.get(CACHE_KEY);
      res.status(200).json({ data: JSON.parse(cacheData), source: "cache" });
    }, 1000);
    // res.status(200).json({msg: 'wait'});
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