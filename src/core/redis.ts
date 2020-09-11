import IORedis, { Redis } from "ioredis";
const connections: Redis[] = [];

export const getRedisClient = () => {
  const redis = new IORedis();
  connections.push(redis);
  return redis;
};

process.on(
  "SIGINT",
  async () => await Promise.all(connections.map((r) => r.quit()))
);
