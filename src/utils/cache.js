const cache = new Map();

let hits = 0;
let misses = 0;

export const get = (key) => {
    const entry = cache.get(key);

    if (!entry) {
        misses++;
        return null;
    }

    if (Date.now() >= entry.expiry) {
        cache.delete(key);
        misses++;
        return null;
    }

    hits++;
    return entry.value;
};

export const set = (key, value, ttlMs) => {
    cache.set(key, {
        value,
        expiry: Date.now() + ttlMs
    });
};

export const del = (key) => {
    cache.delete(key);
};

export const getStats = () => {
    return {
        hits,
        misses,
        entries: cache.size
    };
};