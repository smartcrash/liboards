
import { createClient } from 'redis';
import { REDIS_URL } from './constants';

const redisClient = createClient({ url: REDIS_URL })
redisClient.on('error', (error) => console.log('Redis Client Error', error));
redisClient.connect()

export { redisClient };
