import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 车牌认证 VO
export type PlateAuthVO = {
  applyTime: string;
  auditorId?: null | number;
  auditRemark?: null | string;
  auditTime?: null | string;
  carId: number;
  createTime?: string;
  creator?: string;
  drivingLicense: string;
  id?: number;
  plateNo: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updateTime?: string;
  userId: number;
};

export type PlateAuthUserVO = {
  id?: number;
  nickname?: string;
  phone?: string;
  remark?: string;
  userType?: string;
};

export type PlateAuthCarVO = {
  bindTime?: number | string;
  carType?: string;
  id?: number;
  plateColor?: string;
  plateNo?: string;
  status?: string;
  userId?: number;
};

export type PlateAuthOperatorVO = {
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

export type PlateAuthAuditLogVO = {
  action?: string;
  content?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type PlateAuthDetailVO = PlateAuthVO & {
  auditLogs?: PlateAuthAuditLogVO[];
  auditorInfo?: null | PlateAuthOperatorVO;
  carInfo?: null | PlateAuthCarVO;
  userInfo?: null | PlateAuthUserVO;
};

// 车牌认证分页请求
export type PlateAuthPageReqVO = PageParam & {
  applyTime?: string[];
  auditorId?: number;
  auditTime?: string[];
  carId?: number;
  plateNo?: string;
  remark?: string;
  status?: string;
  userId?: number;
};

export type PlateAuthBatchAuditReqVO = {
  auditRemark?: string;
  auditResult: string;
  ids: number[];
};

export type PlateAuthAuditReqVO = {
  auditRemark?: string;
  ids: number[];
};

export type PlateAuthRejectReqVO = {
  auditRemark: string;
  ids: number[];
};

export type PlateAuthOperateReqVO = {
  ids: number[];
};

export type PlateAuthChartReqVO = {
  timeRange?: string;
};

export type PlateAuthChartVO = {
  authCount: number;
  authPassRate: number;
  authTrend: Array<{
    count: number;
    date: string;
  }>;
};

// 车牌认证 API
export const PlateAuthApi = {
  getPlateAuthPage: async (params: PlateAuthPageReqVO) => {
    return await requestClient.get<PageResult<PlateAuthVO>>(
      '/usermerchant/plate-auth/page',
      {
        params,
      },
    );
  },

  getPlateAuth: async (id: number) => {
    return await requestClient.get<PlateAuthDetailVO>(
      '/usermerchant/plate-auth/get',
      {
        params: { id },
      },
    );
  },

  batchAuditPlateAuth: async (data: PlateAuthBatchAuditReqVO) => {
    return await requestClient.put(
      '/usermerchant/plate-auth/batch-audit',
      data,
    );
  },

  exportPlateAuth: async (params: PlateAuthPageReqVO) => {
    return await requestClient.download('/usermerchant/plate-auth/export', {
      params,
    });
  },

  approvePlateAuth: async (data: PlateAuthAuditReqVO) => {
    return await requestClient.put('/usermerchant/plate-auth/approve', data);
  },

  rejectPlateAuth: async (data: PlateAuthRejectReqVO) => {
    return await requestClient.put('/usermerchant/plate-auth/reject', data);
  },

  reauthPlateAuth: async (data: PlateAuthOperateReqVO) => {
    return await requestClient.put('/usermerchant/plate-auth/reauth', data);
  },

  getPlateAuthChart: async (params?: PlateAuthChartReqVO) => {
    return await requestClient.get<PlateAuthChartVO>(
      '/usermerchant/plate-auth/chart',
      {
        params,
      },
    );
  },
};
