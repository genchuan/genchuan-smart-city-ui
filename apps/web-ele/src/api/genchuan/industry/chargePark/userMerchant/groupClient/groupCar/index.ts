import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 集团车辆 VO
export type GroupCarVO = {
  auditorId?: null | number;
  auditorName?: string;
  auditRemark?: null | string;
  auditTime?: null | string;
  bindTime: string;
  carType: string;
  createTime?: string;
  creator?: string;
  groupId: number;
  groupName?: string;
  id?: number;
  plateColor: string;
  plateNo: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updateTime?: string;
};

export type GroupCarCreateReqVO = {
  auditorId?: null | number;
  auditRemark?: null | string;
  auditTime?: null | string;
  bindTime: string;
  carType: string;
  groupId: number;
  plateColor: string;
  plateNo: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
};

export type GroupCarUpdateReqVO = GroupCarCreateReqVO & {
  id: number;
};

// 集团车辆分页请求
export type GroupCarPageReqVO = PageParam & {
  auditorId?: number;
  auditTime?: string[];
  bindTime?: string[];
  carType?: string;
  groupId?: number;
  plateColor?: string;
  plateNo?: string;
  remark?: string;
  status?: string;
};

export type GroupCarAuditReqVO = {
  auditRemark?: string;
  ids: number[];
};

export type GroupCarRejectReqVO = {
  auditRemark: string;
  ids: number[];
};

export type GroupCarOperateReqVO = {
  ids: number[];
};

export type GroupCarGroupVO = {
  contact?: string;
  groupType?: string;
  id?: number;
  name?: string;
  phone?: string;
  remark?: string;
};

export type GroupCarOperatorVO = {
  account?: string;
  dept?: string;
  deptName?: string;
  id?: number;
  mobile?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  role?: string;
  roleNames?: string[];
};

export type GroupCarBindingLogVO = {
  action?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type GroupCarDetailVO = GroupCarVO & {
  auditorInfo?: GroupCarOperatorVO | null;
  bindingLogs?: GroupCarBindingLogVO[];
  creatorInfo?: GroupCarOperatorVO | null;
  groupInfo?: GroupCarGroupVO | null;
};

export type GroupCarChartReqVO = {
  timeRange?: string;
};

export type GroupCarChartVO = {
  auditPassRate: number;
  bindCarCount: number;
  carTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
};

// 集团车辆 API
export const GroupCarApi = {
  getGroupCarPage: async (params: GroupCarPageReqVO) => {
    return await requestClient.get<PageResult<GroupCarVO>>(
      '/usermerchant/group-car/page',
      {
        params,
      },
    );
  },

  getGroupCar: async (id: number) => {
    return await requestClient.get<GroupCarDetailVO>(
      '/usermerchant/group-car/get',
      {
        params: { id },
      },
    );
  },

  createGroupCar: async (data: GroupCarCreateReqVO) => {
    return await requestClient.post('/usermerchant/group-car/create', data);
  },

  updateGroupCar: async (data: GroupCarUpdateReqVO) => {
    return await requestClient.put('/usermerchant/group-car/update', data);
  },

  importGroupCar: async (file: File) => {
    return await requestClient.upload('/usermerchant/group-car/import', {
      file,
    });
  },

  importGroupCarTemplate: async () => {
    return await requestClient.download('/usermerchant/group-car/template', {
      responseReturn: 'raw',
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
      {
        params,
      },
    );
  },
};
