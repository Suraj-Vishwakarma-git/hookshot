import Endpoint from "../models/EndPoint.js";
import * as cache from "./cache.js";

const TTL = 5 * 60 * 1000;
let endpointDbQueryCount = 0;
export const getActiveEndpoints = async (userId) => {
  const key = "endpoints:" + userId;
  const cachedEndpoints = cache.get(key);
  if (cachedEndpoints !== null) return cachedEndpoints;
  endpointDbQueryCount++;
  const endpoints = await Endpoint.find({ userId, active: true });
  cache.set(key, endpoints, TTL);
  return endpoints;
};
export const invalidateEndpointCache = (userId) => cache.del("endpoints:" + userId);
export const getEndpointDbQueryCount = () => endpointDbQueryCount;
