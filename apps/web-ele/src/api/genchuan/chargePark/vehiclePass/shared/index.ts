import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export interface VehiclePassRecord {
  id?: number | string;
  [key: string]: any;
}

export interface VehiclePassActionRequestConfig {
  key: string;
  method: 'delete' | 'get' | 'post' | 'put';
  path: string;
  payloadMode?: 'body' | 'query';
}

export interface VehiclePassApiFactoryConfig {
  basePath: string;
  actions?: VehiclePassActionRequestConfig[];
}

export interface VehiclePassApiBundle {
  actions: Record<string, (payload?: Record<string, any>) => Promise<any>>;
  create: (payload?: Record<string, any>) => Promise<any>;
  export: (params?: Record<string, any>) => Promise<any>;
  getChart: (params?: Record<string, any>) => Promise<any>;
  getDetail: (id: number | string) => Promise<any>;
  getPage: (params: PageParam) => Promise<PageResult<VehiclePassRecord>>;
  update: (payload?: Record<string, any>) => Promise<any>;
}

function appendQuery(
  url: string,
  payload?: null | Record<string, any>,
): string {
  if (!payload || Object.keys(payload).length === 0) {
    return url;
  }
  const searchParams = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          searchParams.append(key, String(item));
        }
      });
      return;
    }
    searchParams.append(key, String(value));
  });
  const queryString = searchParams.toString();
  if (!queryString) {
    return url;
  }
  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
}

async function requestByMethod(
  method: VehiclePassActionRequestConfig['method'],
  url: string,
  payload?: Record<string, any>,
  payloadMode: 'body' | 'query' = 'body',
) {
  if (method === 'get') {
    return requestClient.get(url, {
      params: payload,
    });
  }
  if (method === 'delete') {
    return requestClient.delete(appendQuery(url, payload));
  }
  if (method === 'post') {
    return payloadMode === 'query'
      ? requestClient.post(url, undefined, {
          params: payload,
        })
      : requestClient.post(url, payload);
  }
  return payloadMode === 'query'
    ? requestClient.put(url, undefined, {
        params: payload,
      })
    : requestClient.put(url, payload);
}

export function createVehiclePassApi(
  config: VehiclePassApiFactoryConfig,
): VehiclePassApiBundle {
  const baseUrl = `/vehiclepass/${config.basePath}`;
  const actionMap = Object.fromEntries(
    (config.actions ?? []).map((action) => [
      action.key,
      (payload?: Record<string, any>) =>
        requestByMethod(
          action.method,
          `${baseUrl}/${action.path}`,
          payload,
          action.payloadMode,
        ),
    ]),
  ) as Record<string, (payload?: Record<string, any>) => Promise<any>>;

  return {
    getPage: (params: PageParam) =>
      requestClient.get<PageResult<VehiclePassRecord>>(`${baseUrl}/page`, {
        params,
      }),
    getDetail: (id: number | string) =>
      requestClient.get<VehiclePassRecord>(
        appendQuery(`${baseUrl}/get`, { id }),
      ),
    create: (payload?: Record<string, any>) =>
      requestClient.post(`${baseUrl}/create`, payload),
    update: (payload?: Record<string, any>) =>
      requestClient.put(`${baseUrl}/update`, payload),
    export: (params?: Record<string, any>) =>
      requestClient.download(`${baseUrl}/export`, {
        params,
      }),
    getChart: (params?: Record<string, any>) =>
      requestClient.get(`${baseUrl}/chart`, {
        params,
      }),
    actions: actionMap,
  };
}
