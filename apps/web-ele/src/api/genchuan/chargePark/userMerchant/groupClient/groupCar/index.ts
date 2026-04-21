import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 集团车辆 VO
export type GroupCarVO = {
  id?: number;
  groupId: number;
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

// 集团车辆分页请求
export type GroupCarPageReqVO = PageParam & {
  groupId?: number;
  plateNo?: string;
  plateColor?: string;
  carType?: string;
  bindTime?: string;
  status?: string;
  auditorId?: number;
  auditTime?: string;
  remark?: string;
};

export type GroupCarAuditReqVO = {
  ids: number[];
  auditRemark?: string;
};

export type GroupCarRejectReqVO = {
  ids: number[];
  auditRemark: string;
};

export type GroupCarOperateReqVO = {
  ids: number[];
};

export type GroupCarChartReqVO = {
  timeRange?: string;
};

export type GroupCarChartVO = {
  carTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  bindCarCount: number;
  auditPassRate: number;
};

// 集团车辆 API
export const GroupCarApi = {
  getGroupCarPage: async (params: GroupCarPageReqVO) => {
    return await requestClient.get<PageResult<GroupCarVO>>(
      '/usermerchant/group-car/page',
      { params },
    );
  },

  getGroupCar: async (id: number) => {
    return await requestClient.get<GroupCarVO>('/usermerchant/group-car/get', {
      params: { id },
    });
  },

  createGroupCar: async (data: GroupCarVO) => {
    return await requestClient.post('/usermerchant/group-car/create', data);
  },

  updateGroupCar: async (data: GroupCarVO) => {
    return await requestClient.put('/usermerchant/group-car/update', data);
  },

  importGroupCar: async (file: File) => {
    return await requestClient.upload('/usermerchant/group-car/import', {
      file,
    });
  },

  exportGroupCar: async (params: GroupCarPageReqVO) => {
    return await requestClient.download('/usermerchant/group-car/export', {
      params,
    });
  },

  approveGroupCar: async (data: GroupCarAuditReqVO) => {
    return await requestClient.put('/usermerchant/group-car/approve', data);
  },

  rejectGroupCar: async (data: GroupCarRejectReqVO) => {
    return await requestClient.put('/usermerchant/group-car/reject', data);
  },

  unbindGroupCar: async (data: GroupCarOperateReqVO) => {
    return await requestClient.put('/usermerchant/group-car/unbind', data);
  },

  rebindGroupCar: async (data: GroupCarOperateReqVO) => {
    return await requestClient.put('/usermerchant/group-car/rebind', data);
  },

  getGroupCarChart: async (params?: GroupCarChartReqVO) => {
    return await requestClient.get<GroupCarChartVO>(
      '/usermerchant/group-car/chart',
      { params },
    );
  },
};
