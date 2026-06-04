type GatewayApiPayload = {
  sessionToken?: string;
  requiresCaptcha?: boolean;
};

export function parseGatewayApiResponse<T extends GatewayApiPayload>(
  res: Response,
  text: string,
  defaultError: string
): T {
  let data: { data?: T; message?: string } = {};
  try {
    data = text ? (JSON.parse(text) as typeof data) : {};
  } catch {
    /* ignore malformed JSON */
  }

  if (!res.ok) {
    throw new Error(data.message || defaultError);
  }

  if (!data.data) {
    throw new Error(data.message || defaultError);
  }

  // Captcha challenge is a valid intermediate state — session token may be absent.
  if (data.data.requiresCaptcha) {
    return data.data;
  }

  if (!data.data.sessionToken) {
    throw new Error(data.message || defaultError);
  }

  return data.data;
}
