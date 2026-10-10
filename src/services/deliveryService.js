
import Delivery from "../models/Delivery.js";
import { isIP } from "node:net";

const isPublicWebhookUrl = (value) => {
    let url;

    try {
        url = new URL(value);
    } catch {
        return false;
    }

    if (url.protocol !== "https:" && url.protocol !== "http:") {
        return false;
    }

    if (url.username || url.password) {
        return false;
    }

    const hostname = url.hostname.toLowerCase();

    if (
        hostname === "localhost" ||
        hostname.endsWith(".localhost") ||
        hostname.endsWith(".local") ||
        hostname === "metadata.google.internal"
    ) {
        return false;
    }

    // Basic IPv4 private, loopback, link-local and reserved range checks.
    if (isIP(hostname) === 4) {
        const parts = hostname.split(".").map(Number);
        const [a, b] = parts;

        if (
            a === 0 ||
            a === 10 ||
            a === 127 ||
            (a === 169 && b === 254) ||
            (a === 172 && b >= 16 && b <= 31) ||
            (a === 192 && b === 168) ||
            (a === 100 && b >= 64 && b <= 127) ||
            a >= 224
        ) {
            return false;
        }
    }

    if (isIP(hostname) === 6) {
        return false;
    }

    return true;
};

export const deliverEvent = async (event, endpoints) => {
    return Promise.all(
        endpoints.map(async (endpoint) => {
            const delivery = await Delivery.create({
                userId: event.userId,
                eventId: event._id,
                endpointId: endpoint._id,
                url: endpoint.url,
                status: "pending"
            });

            delivery.attempts = 1;

            try {
                if (!isPublicWebhookUrl(endpoint.url)) {
                    delivery.status = "failed";
                    delivery.error = "Webhook URL is not allowed";
                } else {
                    const response = await fetch(endpoint.url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Hookshot-Event-Id": String(event._id),
                            "X-Hookshot-Event-Type": event.type
                        },
                        body: JSON.stringify({
                            id: String(event._id),
                            type: event.type,
                            data: event.data,
                            createdAt: event.createdAt
                        }),
                        signal: AbortSignal.timeout(5000),
                        redirect: "error"
                    });

                    delivery.statusCode = response.status;
                    delivery.responseBody = (
                        await response.text()
                    ).slice(0, 2000);

                    if (response.ok) {
                        delivery.status = "success";
                        delivery.deliveredAt = new Date();
                    } else {
                        delivery.status = "failed";
                        delivery.error =
                            "Endpoint returned HTTP " + response.status;
                    }
                }
            } catch (error) {
                delivery.status = "failed";
                delivery.error = error.message;
            }

            await delivery.save();

            return {
                deliveryId: delivery._id,
                endpointId: endpoint._id,
                status: delivery.status,
                statusCode: delivery.statusCode,
                error: delivery.error
            };
        })
    );
};
