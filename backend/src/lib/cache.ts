import Redis from 'ioredis';

let client: Redis | null = null;

if (process.env.REDIS_URL) {
  try {
    client = new Redis(process.env.REDIS_URL);
    client.on('error', (e) => console.error('Redis error', e));
    console.log('Redis client initialized');
  } catch (err) {
    console.error('Failed to initialize Redis', err);
    client = null;
  }
} else {
  // no redis configured
  client = null;
}

export async function cacheGet(key: string) {
  if (!client) return null;
  try {
    const v = await client.get(key);
    return v;
  } catch (err) {
    return null;
  }
}

export async function cacheSet(key: string, value: any, ttlSeconds = 60) {
  if (!client) return;
  try {
    await client.set(key, typeof value === 'string' ? value : JSON.stringify(value), 'EX', ttlSeconds);
  } catch (err) {
    // ignore cache set errors
  }
}

export async function cacheDel(key: string) {
  if (!client) return;
  try {
    await client.del(key);
  } catch (err) {
    // ignore
  }
}

export default client;
