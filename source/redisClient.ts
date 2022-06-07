
import { createClient } from 'redis';

const redisClient = createClient()

redisClient.on('error', (error) => console.log('Redis Client Error', error));
redisClient.connect()

export { redisClient }
