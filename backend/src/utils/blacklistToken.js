import { Redis } from "@upstash/redis";

export const blacklistRedis = Redis.fromEnv();

//store the token to blacklist
export const addToBlacklist = async (jti, expiresInSeconds) => {
  await blacklistRedis.set(`blacklist:${jti}`, "blacklisted", {
    ex: expiresInSeconds,
  });
};
//Check if token is blacklisted
export const isTokenBlackListed = async (jti) => {
  const blacklisted = await blacklistRedis.get(`blacklist:${jti}`);
  return !!blacklisted;
};
