import { Redis } from "@upstash/redis";

let blacklistRedis;

const getRedis = () => {
  if (!blacklistRedis) {
    blacklistRedis = Redis.fromEnv();
  }
  return blacklistRedis;
};

//store the token to blacklist
export const addToBlacklist = async (jti, expiresInSeconds) => {
  await getRedis().set(`blacklist:${jti}`, "blacklisted", {
    ex: expiresInSeconds,
  });
};
//Check if token is blacklisted
export const isTokenBlackListed = async (jti) => {
  const blacklisted = await getRedis().get(`blacklist:${jti}`);
  return !!blacklisted;
};
