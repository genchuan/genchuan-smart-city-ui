import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户车辆 VO
export type UserCarVO = {
  auditorId?: null | number;
  auditorName?: string;
  auditRemark?: null | string;
  auditTime?: null | string;
  bindTime: string;
  carType: string;
  createTime?: string;
  creator?: string;
  id?: number;
  phone?: string;
  plateColor: string;
  plateNo: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updateTime?: string;
  userId: number;
  nickname?: string;
};

export type UserCarCreateReqVO = {
  auditorId?: null | number;
  auditRemark?: null | string;
  auditTime?: null | string;
  bindTime: string;
  carType: string;
  plateColor: string;
  plateNo: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  userId: number;
};

export type UserCarUpdateReqVO = UserCarCreateReqVO & {
  id: number;
};

// 用户车辆分页请求
export type UserCarPageReqVO = PageParam & {
  auditorId?: number;
  auditTime?: string[];
  bindTime?: string[];
  carType?: string;
  plateColor?: string;
  plateNo?: string;
  remark?: string;
  status?: string;
  userId?: number;
  nickname?: string;
};

export type UserCarAuditReqVO = {
  auditRemark?: string;
  ids: number[];
};

export type UserCarOperateReqVO = {
  ids: number[];
};

export type UserCarUserVO = {
  id?: number;
  nickname?: string;
  phone?: string;
  remark?: string;
  userType?: string;
};

export type UserCarOperatorVO = {
  account?: string;
  dept?: string;
  deptName?: string;
  email?: string;
  id?: number;
  mobile?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  role?: string;
  roleNames?: string[];
};

export type UserCarBindingLogVO = {
  action?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type UserCarDetailVO = UserCarVO & {
  auditorInfo?: null | UserCarOperatorVO;
  bindingLogs?: UserCarBindingLogVO[];
  creatorInfo?: null | UserCarOperatorVO;
  userInfo?: null | UserCarUserVO;
};

export type UserCarChartReqVO = {
  timeRange?: string;
};

export type UserCarChartVO = {
  auditPassRate: number;
  bindCarCount: number;
  carTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
};

// 用户车辆 API
export const UserCarApi = {
  getUserCarPage: async (params: UserCarPageReqVO) => {
    return await requestClient.get<PageResult<UserCarVO>>(
      '/usermerchant/user-car/page',
      {
        params,
      },
    );
  },

  getUserCar: async (id: number) => {
    return await requestClient.get<UserCarDetailVO>(
      '/usermerchant/user-car/get',
      {
        params: { id },
      },
    );
  },

  createUserCar: async (data: UserCarCreateReqVO) => {
    return await requestClient.post('/usermerchant/user-car/create', data);
  },

  updateUserCar: async (data: UserCarUpdateReqVO) => {
    return await requestClient.put('/usermerchant/user-car/update', data);
  },

  importUserCar: async (file: File) => {
    return await requestClient.upload('/usermerchant/user-car/import', {
      file,
    });
  },

  importUserCarTemplate: async () => {
    return await requestClient.download('/usermerchant/user-car/template');
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
      {
        params,
      },
    );
  },
};
