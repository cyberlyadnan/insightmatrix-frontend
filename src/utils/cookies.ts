import Cookies from "js-cookie";
import { COOKIE_KEYS } from "@/constants";

/** SSR-safe: returns undefined when `document` is missing */
export function getCookie(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  return Cookies.get(name);
}

export function setAuthCookies(accessToken: string, refreshToken?: string, expiresDays = 7) {
  Cookies.set(COOKIE_KEYS.accessToken, accessToken, {
    expires: expiresDays,
    sameSite: "lax",
    secure: envSecureCookies(),
  });
  if (refreshToken) {
    Cookies.set(COOKIE_KEYS.refreshToken, refreshToken, {
      expires: expiresDays,
      sameSite: "lax",
      secure: envSecureCookies(),
    });
  }
}

export function clearAuthCookies() {
  Cookies.remove(COOKIE_KEYS.accessToken);
  Cookies.remove(COOKIE_KEYS.refreshToken);
}

function envSecureCookies() {
  return typeof window !== "undefined" && window.location.protocol === "https:";
}
