// Basic API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
}
