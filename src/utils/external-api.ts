/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
import 'dotenv/config';
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/* ================================
   Interfaces
================================ */

interface LoginResponse {
  data: {
    accessToken: string;
  };
}

/* ================================
   Token State (In-Memory)
================================ */

let accessToken: string | null = null;
let loginPromise: Promise<string> | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

/* ================================
   Axios Instance
================================ */

export const externalApi: AxiosInstance = axios.create({
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ================================
   Login Function
================================ */

async function login(): Promise<string> {
  const baseURL = process.env.URL_API;
  if (!baseURL) {
    throw new Error('URL_API environment variable is missing in .env');
  }

  const response: AxiosResponse<LoginResponse> = await axios.post(
    `${baseURL}/auth-svc/auth/login`,
    {
      username: process.env.USERNAME_API,
      password: process.env.PASSWORD_API,
    },
  );

  const token = response.data?.data?.accessToken;

  if (!token) {
    throw new Error('Cannot get token from login response');
  }

  accessToken = token;
  return token;
}

async function getOrFetchToken(): Promise<string> {
  if (accessToken) {
    return accessToken;
  }
  if (!loginPromise) {
    loginPromise = login().finally(() => {
      loginPromise = null;
    });
  }
  return loginPromise;
}

/* ================================
   Refresh Queue Helpers
================================ */

function subscribeTokenRefresh(
  resolve: (token: string) => void,
  reject: (err: unknown) => void,
) {
  refreshSubscribers.push({ resolve, reject });
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
}

function onRefreshFailed(err: unknown) {
  refreshSubscribers.forEach(({ reject }) => reject(err));
  refreshSubscribers = [];
}

/* ================================
   Request Interceptor
================================ */

externalApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const baseURL = process.env.URL_API;
    if (!baseURL) {
      throw new Error('URL_API environment variable is missing in .env');
    }
    config.baseURL = baseURL;

    const token = await getOrFetchToken();
    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  },
  (error) => Promise.reject(error),
);

/* ================================
   Response Interceptor
================================ */

externalApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // รอ token ໃຫມ່
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.set('Authorization', `Bearer ${token}`);
            resolve(externalApi(originalRequest));
          }, reject);
        });
      }

      isRefreshing = true;

      try {
        accessToken = null;
        const newToken = await login();
        accessToken = newToken;

        onRefreshed(newToken);

        originalRequest.headers.set('Authorization', `Bearer ${newToken}`);

        return externalApi(originalRequest);
      } catch (err) {
        onRefreshFailed(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
