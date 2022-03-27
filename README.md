# cache-test
- This is a simple cache test for cache penetration, cache stampede, and cache avalanche.
- Can be used to understand the basic ideas of these three topics. 

## Deployment
1. npm install
2. Start MySQL Server (ver. 8.0 or higher)
3. Import database:
   i. mysql -u <user_name> -p <stylish_db_name> < stylish_backend.sql
4. Build one redis client (ver. 6.2.6 or higher)
5. Create .env file based on .env-template
6. (optional) Build 8 redis client at port 7000, 7001, 7002, 7003, 7004, 7005, 7006, 7007, based on https://www.youtube.com/watch?v=N8BkmdZzxDg&t=402s

## Testing
- There are four APIs, in app.js
- Use nodemon app.js to start the server, and test it sending requests to these four APIs.

### normal 
- Send requests to normal API (localhost:3000/). Will see first response from DB, and second response from cache. (cache expiration time is 10 seconds)
- Set product_id in testData.js as any integer other than 1 (like -1), and send requests again. Will see all responses from DB.

### penetration
- Send requests to penetration API(localhost:3000/penetration), while product_id remains -1. Will see first response from DB, while any other response from cache. 
- Will have to change product_id back to 1, for other testings. 
- See "cache penetration prevention" in cachePenetration.js 

### stampede
- Open terminal, and execute node testers.js, to send three API requests simultaneously (to localhost:3000/stampede). 
- Will see only one response from DB, but two other from cache.
- See "cache stampede prevention" in cacheStampede.js

### avalanche
- Remember to turn on the eight cache clients, in redis-cluster modes, as mentioned in deployment.
- Send requests to localhost:3000/avalanche. Will only get first response from DB in every ten seconds.
- Try to shutdown one master server which receive the data (probably the one who listens to port 7002) in the redis cluster.
- That master server will be replaced by its slave server, and the service will go down for a period of time based on how you set the configure files in redis cluster. 
