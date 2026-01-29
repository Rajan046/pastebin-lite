import { fsStorage } from './storage-fs';
import { redisStorage } from './storage-redis';

const useRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

if (!useRedis) {
    console.log("Using File System storage (local). Data will be saved to /data/pastes.json");
} else {
    console.log("Using Vercel KV (Redis) for storage.");
}

export const storage = useRedis ? redisStorage : fsStorage;
