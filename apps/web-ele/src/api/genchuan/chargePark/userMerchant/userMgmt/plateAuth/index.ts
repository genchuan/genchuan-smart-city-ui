import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 车牌认证 VO
export type PlateAuthVO = {
  id?: number;
  userId: number;
  carId: number;
  plateNo: string;
  drivingLicense: string;
  applyTime: string;
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

// 车牌认证分页请求
export type PlateAuthPageReqVO = PageParam & {
  userId?: number;
  carId?: number;
  plateNo?: string;
  applyTime?: string;
  status?: string;
  auditorId?: number;
  auditTime?: string;
  remark?: string;
};

export type PlateAuthBatchAuditReqVO = {
  ids: number[];
  auditResult: string;
  auditRemark?: string;
};

export type PlateAuthAuditReqVO = {
  ids: number[];
  auditRemark?: string;
};

export type PlateAuthRejectReqVO = {
  ids: number[];
  auditRemark: string;
};

export type PlateAuthOperateReqVO = {
  ids: number[];
};

export type PlateAuthChartReqVO = {
  timeRange?: string;
};

export type PlateAuthChartVO = {
  authTrend: Array<{
    date: string;
    count: number;
  }>;
  authCount: number;
  authPassRate: number;
};

// 车牌认证 API
export const PlateAuthApi = {
  getPlateAuthPage: async (params: PlateAuthPageReqVO) => {
    return await requestClient.get<PageResult<PlateAuthVO>>(
      '/usermerchant/plate-auth/page',
      { params },
    );
  },

  getPlateAuth: async (id: number) => {
    return await requestClient.get<PlateAuthVO>(
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
      { params },
    );
  },
};
