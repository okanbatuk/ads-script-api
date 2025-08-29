export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
  timestamp?: string;
};
