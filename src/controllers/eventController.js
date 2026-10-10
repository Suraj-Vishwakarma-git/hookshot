import Event from "../models/Event.js";
import Delivery from "../models/Delivery.js";
import { getActiveEndpoints } from "../utils/endpointsHelper.js";
import { deliverEvent } from "../services/deliveryService.js";

export const createEvent = async (req, res) => {
  try {
    const type = String(req.body.type || "").trim(); const { data } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];
    if (!type || data === undefined || data === null) return res.status(400).json({ message: "Event type and data are required" });
    if (typeof data !== "object" || Array.isArray(data)) return res.status(400).json({ message: "Event data must be a JSON object" });
    if (typeof idempotencyKey !== "string" || !idempotencyKey.trim()) return res.status(400).json({ message: "Idempotency-Key header is required" });
    const key = idempotencyKey.trim();
    const already = await Event.findOne({ userId: req.user.id, idempotencyKey: key });
    if (already) {
      const deliveries = await Delivery.find({ userId: req.user.id, eventId: already._id }).sort({ createdAt: 1 });
      return res.status(200).json({ message: "Event already exists", event: already, deliveries });
    }
    const endpoints = await getActiveEndpoints(req.user.id);
    const event = await Event.create({ userId: req.user.id, type, data, idempotencyKey: key, endpointIds: endpoints.map((endpoint) => endpoint._id) });
    let deliveries = []; let warning = null;
    try { deliveries = await deliverEvent(event, endpoints); }
    catch (error) { console.error("Webhook delivery processing failed:", error); warning = "Event saved, but delivery processing encountered an error"; }
    return res.status(201).json({ message: "Event created successfully", event, deliveries, ...(warning ? { warning } : {}) });
  } catch (error) {
    if (error.code === 11000) {
      const existingEvent = await Event.findOne({ userId: req.user.id, idempotencyKey: req.headers["idempotency-key"]?.trim() });
      if (existingEvent) {
        const deliveries = await Delivery.find({ userId: req.user.id, eventId: existingEvent._id });
        return res.status(200).json({ message: "Event already exists", event: existingEvent, deliveries });
      }
    }
    console.error("Event creation failed:", error);
    return res.status(500).json({ message: "Unable to create event" });
  }
};
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({ events });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Unable to fetch events" }); }
};
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    const deliveries = await Delivery.find({ eventId: event._id, userId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ event, deliveries });
  } catch (error) { console.error(error); return res.status(400).json({ message: "Invalid event ID or unable to fetch event" }); }
};
