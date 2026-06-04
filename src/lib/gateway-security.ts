/**
 * Client-side gateway security flags — must stay aligned with backend SECURITY_* env vars.
 * When disabled, routing start skips reCAPTCHA and proceeds directly to prescreen/redirect.
 */

function envBool(value: string | undefined, defaultVal: boolean): boolean {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return defaultVal;
}

/** Master switch — mirrors backend SECURITY_GATEWAY_ENABLED (default off until explicitly enabled). */
export function isGatewaySecurityEnabled(): boolean {
  return envBool(process.env.NEXT_PUBLIC_SECURITY_GATEWAY_ENABLED, false);
}

/** Captcha sub-switch — mirrors backend SECURITY_CAPTCHA_ENABLED. */
export function isGatewayCaptchaEnabled(): boolean {
  if (!isGatewaySecurityEnabled()) return false;
  return envBool(process.env.NEXT_PUBLIC_SECURITY_CAPTCHA_ENABLED, false);
}

export function getGatewayCaptchaSiteKey(override?: string): string {
  return (override ?? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
}

/** True when the routing UI should load and submit reCAPTCHA before gateway start. */
export function isGatewayCaptchaActive(siteKeyOverride?: string): boolean {
  return isGatewayCaptchaEnabled() && Boolean(getGatewayCaptchaSiteKey(siteKeyOverride));
}

/** Show captcha when env enables it or the routing API explicitly requires a challenge. */
export function shouldShowRoutingCaptcha(
  siteKey: string,
  backendRequiresCaptcha?: boolean
): boolean {
  const key = siteKey.trim();
  if (!key) return false;
  if (backendRequiresCaptcha) return true;
  return isGatewayCaptchaActive(key);
}
