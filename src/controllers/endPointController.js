import Endpoint from "../models/EndPoint.js";
import { invalidateEndpointCache } from "../utils/endpointsHelper.js";
const validUrl = (value) => {
  try { const parsed = new URL(value); return ["http:", "https:"].includes(parsed.protocol); }
  catch { return false; }
};
export const createEndpoint = async (req, res) => {
  try {
    const url = String(req.body.url || "").trim();
    if (!url) return res.status(400).json({ message: "URL is required" });
    if (!validUrl(url)) return res.status(400).json({ message: "Enter a valid HTTP or HTTPS URL" });
    const endpoint = await Endpoint.create({ userId: req.user.id, url });
    invalidateEndpointCache(req.user.id);
    return res.status(201).json({ message: "Endpoint created successfully", endpoint });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Unable to create endpoint" }); }
};
export const getEndpoints = async (req, res) => {
  try { const endpoints = await Endpoint.find({ userId: req.user.id }).sort({ createdAt: -1 }); return res.status(200).json({ endpoints }); }
  catch (error) { console.error(error); return res.status(500).json({ message: "Unable to fetch endpoints" }); }
};
export const updateEndpoint = async (req, res) => {
  try {
    const { id } = req.params; const { url, active } = req.body;
    if (url !== undefined && (typeof url !== "string" || !validUrl(url.trim()))) return res.status(400).json({ message: "Enter a valid HTTP or HTTPS URL" });
    if (active !== undefined && typeof active !== "boolean") return res.status(400).json({ message: "Active must be true or false" });
    const endpoint = await Endpoint.findOne({ _id: id, userId: req.user.id });
    if (!endpoint) return res.status(404).json({ message: "Endpoint not found" });
    if (url !== undefined) endpoint.url = url.trim();
    if (active !== undefined) endpoint.active = active;
    await endpoint.save(); invalidateEndpointCache(req.user.id);
    return res.status(200).json({ message: "Endpoint updated successfully", endpoint });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Unable to update endpoint" }); }
};
export const deleteEndpoint = async (req, res) => {
  try {
    const endpoint = await Endpoint.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!endpoint) return res.status(404).json({ message: "Endpoint not found" });
    invalidateEndpointCache(req.user.id);
    return res.status(200).json({ message: "Endpoint deleted successfully" });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Unable to delete endpoint" }); }
};
