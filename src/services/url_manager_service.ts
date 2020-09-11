import { getRedisClient } from "../core/redis";

const SET_NAME = "ODIN_DISCOVERED_URLS";

const redis = getRedisClient();

const redisKey = (url: URL) => url.toString();

const clearDiscoveredUrls = () => redis.del(SET_NAME);

const addToDiscoveredUrls = (url: URL) => redis.sadd(SET_NAME, redisKey(url));

const isAlreadyDiscovered = (url: URL) =>
  redis.sismember(SET_NAME, redisKey(url));

export { clearDiscoveredUrls, addToDiscoveredUrls, isAlreadyDiscovered };
