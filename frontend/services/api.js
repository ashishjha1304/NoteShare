import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const session = localStorage.getItem("session");
        if (session) {
            const parsed = JSON.parse(session);
            config.headers.Authorization = `Bearer ${parsed.access_token}`;
        }
    }
    return config;
});

export default api;
