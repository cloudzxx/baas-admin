import { getToken } from './utils';

const BASE_URL = '/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, unknown>;
}

function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  if (token) {
    return { Authorization: `JWT ${token}` };
  }
  return {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw { status: response.status, data, url: response.url };
  }
  return response.json();
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;
  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    ...getAuthHeaders(),
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!(fetchOptions.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  return handleResponse<T>(response);
}

export function createCrudService<T = unknown>(resource: string) {
  return {
    list: (params?: Record<string, unknown>) =>
      apiRequest<{ data: T[]; total: number }>(`/${resource}`, { params }),
    get: (id: string) => apiRequest<T>(`/${resource}/${id}`),
    create: (data: Record<string, unknown> | FormData) =>
      apiRequest<T>(`/${resource}`, {
        method: 'POST',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    update: (id: string, data: Record<string, unknown> | FormData) =>
      apiRequest<T>(`/${resource}/${id}`, {
        method: 'PUT',
        body: data instanceof FormData ? data : JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiRequest<T>(`/${resource}/${id}`, { method: 'DELETE' }),
  };
}

export function customRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  return apiRequest<T>(endpoint, options);
}
