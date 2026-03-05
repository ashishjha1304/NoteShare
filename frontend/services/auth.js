import api from "./api";

export const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    return res.data;
};

export const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
};

export const getSession = () => {
    if (typeof window === "undefined") return null;
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
};

export const getUser = () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const saveSession = (session, user) => {
    localStorage.setItem("session", JSON.stringify(session));
    localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
    localStorage.removeItem("session");
    localStorage.removeItem("user");
};

export const isLoggedIn = () => {
    return !!getSession();
};

export const isAdmin = () => {
    const user = getUser();
    return user?.role === "admin";
};
