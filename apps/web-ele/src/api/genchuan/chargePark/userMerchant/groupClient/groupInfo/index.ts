import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 集团信息 VO
export type GroupInfoVO = {
  id?: number;
  name: string;
  contact: string;
  phone: string;
  groupType: string;
  address?: string;
  registerTime: string;
  status: string;
  walletBalance?: number;
  auditorId?: number | null;
  auditTime?: string | null;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 集团信息分页请求
export type GroupInfoPageReqVO = PageParam & {
  name?: string;
  contact?: string;
  phone?: string;
  groupType?: string;
  address?: string;
  registerTime?: string;
  status?: string;
  walletBalance?: number;
  auditorId?: number;
  auditTime?: string;
  remark?: string;
};

export type GroupInfoAuditReqVO = {
  ids: number[];
  auditRemark?: string;
};

export type GroupInfoRejectReqVO = {
  ids: number[];
  auditRemark: string;
};

export type GroupInfoOperateReqVO = {
  ids: number[];
};

export type GroupInfoChartReqVO = {
  timeRange?: string;
};

export type GroupInfoChartVO = {
  groupGrowthTrend: Array<{
    date: string;
    count: number;
  }>;
  totalGroupCount: number;
  newGroupCount: number;
};

// 集团信息 API
export const GroupInfoApi = {
  getGroupInfoPage: async (params: GroupInfoPageReqVO) => {
    return await requestClient.get<PageResult<GroupInfoVO>>(
      '/usermerchant/group-info/page',
      { params },
    );
  },

  getGroupInfo: async (id: number) => {
    return await requestClient.get<GroupInfoVO>(
      '/usermerchant/group-info/get',
      {
        params: { id },
      },
    );
  },

  createGroupInfo: async (data: GroupInfoVO) => {
    return await requestClient.post('/usermerchant/group-info/create', data);
  },

  updateGroupInfo: async (data: GroupInfoVO) => {
    return await requestClient.put('/usermerchant/group-info/update', data);
  },

  importGroupInfo: async (file: File) => {
    return await requestClient.upload('/usermerchant/group-info/import', {
      file,
    });
  },

  exportGroupInfo: async (params: GroupInfoPageReqVO) => {
    return await requestClient.download('/usermerchant/group-info/export', {
      params,
    });
  },

  approveGroupInfo: async (data: GroupInfoAuditReqVO) => {
    return await requestClient.put('/usermerchant/group-info/approve', data);
  },

  rejectGroupInfo: async (data: GroupInfoRejectReqVO) => {
    return await requestClient.put('/usermerchant/group-info/reject', data);
  },

  enableGroupInfo: async (data: GroupInfoOperateReqVO) => {
    return await requestClient.put('/usermerchant/group-info/enable', data);
  },

  disableGroupInfo: async (data: GroupInfoOperateReqVO) => {
    return await requestClient.put('/usermerchant/group-info/disable', data);
  },

  getGroupInfoChart: async (params?: GroupInfoChartReqVO) => {
    return await requestClient.get<GroupInfoChartVO>(
      '/usermerchant/group-info/chart',
      { params },
    );
  },
};
