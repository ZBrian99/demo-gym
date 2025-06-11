export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface JwtUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
