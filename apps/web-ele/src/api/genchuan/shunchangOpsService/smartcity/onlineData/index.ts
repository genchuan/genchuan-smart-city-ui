import type { PageParam } from '@vben/request';

import { RequestClient } from '@vben/request';

// 创建独立的请求客户端，用于访问第三方采集服务器
const collectClient = new RequestClient({
  baseURL: 'http://117.78.19.248:20000',
});

export namespace OnlineDataApi {
  /** 登录参数 */
  export interface LoginParams {
    account: string;
    password: string;
  }

  /** 登录结果 */
  export interface LoginResult {
    message?: string;
    count?: number;
    data?: {
      account: string;
      id: number;
      lastOnline?: string;
      name: string;
      token: string;
      type?: number;
    };
  }

  /** 设备信息 */
  export interface Device {
    id: number;
    sn: string;
    name: string;
    type: string;
    typeName?: string;
    status: number;
    enable?: number;
    warmStatus?: number;
    onlineStatus?: number;
    lastOnline?: string;
    rssi?: number;
    voltage?: number;
    waterHeight?: number;
    waterSpeed?: number;
    currentFlow?: number;
    totalFlow?: number;
    longitude?: number;
    latitude?: number;
    address?: string;
    serialNum?: string;
    period?: number;
    versionHardware?: number;
    versionSoftware?: number;
  }

  /** 设备数据 */
  export interface DeviceData {
    name: string;
    sn: string;
    type: string;
    rssi: number;
    voltage: number;
    collectTime: string;
    uploadTime: string;
    currentFlow: number;
    totalFlow: number;
    waterHeight: number;
    waterSpeed: number;
  }

  /** 分页结果 */
  export interface PageResult<T> {
    list: T[];
    total: number;
  }

  /** 设备列表查询参数 */
  export interface DeviceListParams extends PageParam {
    type?: string;
  }

  /** 设备数据查询参数 */
  export interface DeviceDataParams extends PageParam {
    type?: string;
    sn?: string;
    start?: string;
    end?: string;
  }
}

// 存储token，用于后续的请求
let cachedToken: null | string = null;

/** 登录接口 */
export async function loginApi(data: OnlineDataApi.LoginParams) {
  const formData = new FormData();
  formData.append('account', data.account);
  formData.append('password', data.password);

  const result = await collectClient.post<OnlineDataApi.LoginResult>(
    '/user/login',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  // 缓存token - 根据实际响应结构：result.data.data.token
  const token = result.data?.data?.token;
  if (token) {
    cachedToken = token;
  } else {
    console.error('[OnlineDataApi] Token获取失败，响应结构:', result);
  }

  return result;
}

/** 获取缓存的token */
export function getCachedToken(): null | string {
  return cachedToken;
}

/** 设置token */
export function setCachedToken(token: null | string) {
  cachedToken = token;
}

/** 确保已登录并获取有效token */
async function ensureLoggedIn(): Promise<null | string> {
  let token = getCachedToken();
  if (!token) {
    const result = await loginApi({
      account: 'fjytshjzlyxgs',
      password: 'bmw123456',
    });
    token = getCachedToken();
  }
  return token;
}

/** 查询设备列表 */
export async function getDeviceList(
  params: OnlineDataApi.DeviceListParams,
): Promise<OnlineDataApi.PageResult<OnlineDataApi.Device>> {
  // 确保已登录
  const token = await ensureLoggedIn();

  if (!token) {
    console.error('[OnlineDataApi] 无法获取有效token');
    return {
      list: [],
      total: 0,
    };
  }

  const response = await collectClient.get<any>('/monitor_list', {
    params: {
      page: params.pageNo?.toString(),
      limit: params.pageSize?.toString(),
      type: params.type || 'YW01',
    },
    headers: {
      token,
    },
  });

  console.log('[OnlineDataApi] 设备列表响应:', response);

  // 实际返回格式: { code: 200, message: "请求成功", count: 8, data: [...] }
  const data = response.data;

  // 格式1: { code: 200, data: [...], count: 8 }
  if (data && Array.isArray(data.data)) {
    return {
      list: data.data,
      total: data.data.length,
    };
  }
  console.error('[OnlineDataApi] 无法解析设备列表数据:', data);
  return {
    list: [],
    total: 0,
  };
}

/** 查询液位计设备数据 */
export async function getDeviceData(
  params: OnlineDataApi.DeviceDataParams,
): Promise<OnlineDataApi.PageResult<OnlineDataApi.DeviceData>> {
  // 确保已登录
  const token = await ensureLoggedIn();

  if (!token) {
    console.error('[OnlineDataApi] 无法获取有效token');
    return {
      list: [],
      total: 0,
    };
  }

  console.log(
    '[OnlineDataApi] 请求设备数据，token:',
    `${token.slice(0, 20)}...`,
  );

  const response = await collectClient.get<any>(
    '/water_monitor/data_condition',
    {
      params: {
        page: params.pageNo?.toString(),
        limit: params.pageSize?.toString(),
        type: params.type || 'YW01',
        sn: params.sn,
        start: params.start,
        end: params.end,
      },
      headers: {
        token,
      },
    },
  );

  console.log('[OnlineDataApi] 设备数据响应:', response);

  // 适配第三方接口返回格式
  // 实际返回格式: { code: 200, message: "请求成功", count: X, data: [...] }
  const data = response.data;

  // 格式1: { code: 200, data: [...], count: X }
  if (data && Array.isArray(data.data)) {
    return {
      list: data.data,
      total: data.count || data.data.length,
    };
  }

  console.error('[OnlineDataApi] 无法解析设备数据:', data);
  return {
    list: [],
    total: 0,
  };
}
