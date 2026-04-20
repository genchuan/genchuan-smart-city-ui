import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户车辆 VO
export type UserCarVO = {
  id?: number;
  userId: number;
  plateNo: string;
  plateColor: string;
  carType: string;
  bindTime: string;
  status: string;
  auditorId?: number | null;
  auditTime?: string | null;
  auditRemark?: string | null;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 用户车辆分页请求
export type UserCarPageReqVO = PageParam & {
  userId?: number;
  plateNo?: string;
  plateColor?: string;
  carType?: string;
  bindTime?: string;
  status?: string;
  auditorId?: number;
  auditTime?: string;
  remark?: string;
};

export type UserCarAuditReqVO = {
  ids: number[];
  auditRemark?: string;
};

export type UserCarOperateReqVO = {
  ids: number[];
};

export type UserCarChartReqVO = {
  timeRange?: string;
};

export type UserCarChartVO = {
  carTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  bindCarCount: number;
  auditPassRate: number;
};

// 用户车辆 API
export const UserCarApi = {
  getUserCarPage: async (params: UserCarPageReqVO) => {
    return await requestClient.get<PageResult<UserCarVO>>(
      '/usermerchant/user-car/page',
      { params },
    );
  },

  getUserCar: async (id: number) => {
    return await requestClient.get<UserCarVO>('/usermerchant/user-car/get', {
      params: { id },
    });
  },

  createUserCar: async (data: UserCarVO) => {
    return await requestClient.post('/usermerchant/user-car/create', data);
  },

  updateUserCar: async (data: UserCarVO) => {
    return await requestClient.put('/usermerchant/user-car/update', data);
  },

  importUserCar: async (file: File) => {
    return await requestClient.upload('/usermerchant/user-car/import', {
      file,
    });
  },

  exportUserCar: async (params: UserCarPageReqVO) => {
    return await requestClient.download('/usermerchant/user-car/export', {
      params,
    });
  },

  approveUserCar: async (data: UserCarAuditReqVO) => {
    return await requestClient.put('/usermerchant/user-car/approve', data);
  },

  rejectUserCar: async (data: Required<UserCarAuditReqVO>) => {
    return await requestClient.put('/usermerchant/user-car/reject', data);
  },

  unbindUserCar: async (data: UserCarOperateReqVO) => {
    return await requestClient.put('/usermerchant/user-car/unbind', data);
  },

  rebindUserCar: async (data: UserCarOperateReqVO) => {
    return await requestClient.put('/usermerchant/user-car/rebind', data);
  },

  getUserCarChart: async (params?: UserCarChartReqVO) => {
    return await requestClient.get<UserCarChartVO>(
      '/usermerchant/user-car/chart',
      { params },
    );
  },
};
