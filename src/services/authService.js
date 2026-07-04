import { getFriendlyError } from '@/lib/friendlyErrors';
const TOKEN_KEY = 'wtv_api_token';
const USER_KEY = 'wtv_current_user';
const API_BASE = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/api\/v1\/?$/, '');

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setStoredAuth(token, user = null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);

  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else if (!token) localStorage.removeItem(USER_KEY);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function buildUrl(path) {
  const base = (API_BASE || '').replace(/\/$/, '');
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // normalize short paths
  if (normalizedPath === '/login') normalizedPath = '/api/v1/auth/login';
  if (normalizedPath === '/logout') normalizedPath = '/api/v1/auth/logout';
  if (normalizedPath === '/me') normalizedPath = '/api/v1/auth/me';

  return `${base}${normalizedPath}`;
}

async function parseResponseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function request(path, options = {}) {
  const token = getStoredToken();
  const timeoutMs = options.timeoutMs || 20000;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    Accept: 'application/json',
    ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(buildUrl(path), { ...options, headers, signal: options.signal || controller?.signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw Object.assign(new Error('Request timed out. Please try again.'), { status: 408, title: 'Request timeout' });
    }
    throw error;
  } finally {
    if (timer) clearTimeout(timer);
  }
  const body = await parseResponseBody(response);

  if (!response.ok) {
    const rawFieldErrors = body?.errors || null;
    const validation = rawFieldErrors ? Object.values(rawFieldErrors).flat().join(' ') : '';
    const technicalMessage = validation || body?.message || body?.raw || `Request failed (${response.status})`;
    const friendly = getFriendlyError({ message: technicalMessage, status: response.status });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('wtv-api-error', { detail: { message: technicalMessage, status: response.status } }));
    }
    const error = new Error(friendly.description);
    error.title = friendly.title;
    error.status = response.status;
    error.technicalMessage = technicalMessage;
    error.fieldErrors = rawFieldErrors;
    throw error;
  }

  return body;
}

export function unwrapData(response) {
  return response && Object.prototype.hasOwnProperty.call(response, 'data') ? response.data : response;
}

export async function login(payload) {
  const response = await request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: payload.email, password: payload.password }),
  });
  const data = unwrapData(response) || {};
  const token = data.token || null;
  const user = data.user || null;
  setStoredAuth(token, user);
  return { ...response, token, user, raw: response };
}

export async function submitApplication(payload) {
  return request('/api/v1/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function register(payload) {
  return submitApplication(payload);
}

export async function getCurrentUser() {
  const response = await request('/api/v1/auth/me');
  const data = unwrapData(response);
  const user = data?.user || data;
  const token = getStoredToken();
  setStoredAuth(token, user);
  return user;
}

export async function logout() {
  try {
    if (getStoredToken()) await request('/api/v1/auth/logout', { method: 'POST' });
  } finally {
    clearStoredAuth();
  }
}
