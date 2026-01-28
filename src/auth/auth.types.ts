export type LoginPayload = {
  username: string; // tu backend usa username (email)
  password: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  role?: string;
};

export type JwtPayload = {
  id?: number;
  username?: string;
  role?: string;
  roles?: string[];
};
