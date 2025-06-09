import Cookies from "js-cookie";

/**
 * Set a cookie with the given name, value, and expiry days
 */
export const setCookie = (name, value, days) => {
  Cookies.set(name, value, {
    expires: days,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name) => {
  return Cookies.get(name);
};

/**
 * Remove a cookie by name
 */
export const removeCookie = (name) => {
  Cookies.remove(name);
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name) => {
  return !!getCookie(name);
};
