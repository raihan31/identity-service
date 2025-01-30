const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch(err => {
    console.log(err);
});

module.exports = client;