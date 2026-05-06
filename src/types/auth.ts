import type { User } from "./user";

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
