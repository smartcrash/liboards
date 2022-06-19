
import { createClient } from 'redis';
import { REDIS_HOST, REDIS_PORT } from './constants';

const redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}` })

redisClient.on('error', (error) => console.log('Redis Client Error', error));
redisClient.connect()

export { redisClient }
