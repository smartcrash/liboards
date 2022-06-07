
import { createClient } from 'redis';

const redis = createClient({ legacyMode: true })
redis.connect().catch(console.error)

export { redis }
