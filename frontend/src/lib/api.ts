const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const TOKEN_KEY = 'sgcursos.token';

export class ApiError extends Error {
  status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.status = status;
  }
}

function extractMessage(data: unknown): string {
  if (typeof data === 'object' && data && 'message' in data) {
    const message = (data as { message: unknown }).message;
    return Array.isArray(message) ? message.join(', ') : String(message);
  }
  return 'Não foi possível concluir a operação';
}

export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event('sgcursos:unauthorized'));
    }
    throw new ApiError(extractMessage(data), response.status);
  }
  return data as T;
}

export const apiUrl = API_URL;
