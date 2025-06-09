import Cookies from "js-cookie";

// Safe functions that work in both client and server environments
export const getCookie = (name, parse = false) => {
  if (typeof window === "undefined") {
    return null; // Server-side, return null
  }

  try {
    const value = Cookies.get(name);
    if (!value) return null;
    return parse ? JSON.parse(value) : value;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
};

export const setCookie = (name, value, days = 7) => {
  if (typeof window === "undefined") {
    return; // Server-side, do nothing
  }

  try {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    Cookies.set(name, stringValue, { expires: days, sameSite: "strict" });
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
  }
};

export const removeCookie = (name) => {
  if (typeof window === "undefined") {
    return; // Server-side, do nothing
  }

  try {
    Cookies.remove(name);
  } catch (error) {
    console.error(`Error removing cookie ${name}:`, error);
  }
};
