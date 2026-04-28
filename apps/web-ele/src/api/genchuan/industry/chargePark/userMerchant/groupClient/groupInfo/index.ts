import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 集团信息 VO
export type GroupInfoVO = {
  address?: string;
  auditorId?: null | number;
  auditorName?: string;
  auditTime?: null | string;
  contact: string;
  createTime?: string;
  creator?: string;
  groupType: string;
  id?: number;
  name: string;
  phone: string;
  registerTime: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updater?: string;
  updateTime?: string;
  walletBalance?: number;
};

export type GroupInfoCreateReqVO = {
  address?: string;
  contact: string;
  groupType: string;
  name: string;
  phone: string;
  registerTime: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  walletBalance?: number;
};

export type GroupInfoUpdateReqVO = GroupInfoCreateReqVO & {
  id: number;
};

// 集团信息分页请求
export type GroupInfoPageReqVO = PageParam & {
  address?: string;
  auditorId?: number;
  auditTime?: string;
  contact?: string;
  groupType?: string;
  name?: string;
  phone?: string;
  registerTime?: string;
  remark?: string;
  status?: string;
  walletBalance?: number;
};

export type GroupInfoOperateReqVO = {
  ids: number[];
};

export type GroupInfoAuditReqVO = {
  auditRemark?: string;
  ids: number[];
};

export type GroupInfoRejectReqVO = {
  auditRemark: string;
  ids: number[];
};

export type GroupInfoOperatorVO = {
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

export type GroupAccountLogVO = {
  afterBalance?: number;
  amount?: number;
  id?: number;
  remark?: string;
  time?: number | string;
  type?: string;
};

export type GroupCarInfoVO = {
  carType?: string;
  id?: number;
  plateColor?: string;
  plateNo?: string;
  status?: string;
};

export type GroupInfoAuditLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type GroupInfoDetailVO = GroupInfoVO & {
  accountLogs?: GroupAccountLogVO[];
  auditLogs?: GroupInfoAuditLogVO[];
  auditorInfo?: GroupInfoOperatorVO | null;
  auditSummary?: string;
  cars?: GroupCarInfoVO[];
  creatorId?: number;
  creatorInfo?: GroupInfoOperatorVO | null;
  updaterId?: number;
  updaterInfo?: GroupInfoOperatorVO | null;
};

export type GroupInfoChartReqVO = {
  timeRange?: string;
};

export type GroupInfoChartVO = {
  groupGrowthTrend: Array<{
    count: number;
    date: string;
  }>;
  newGroupCount: number;
  totalGroupCount: number;
};

// 集团信息 API
export const GroupInfoApi = {
  getGroupInfoPage: async (params: GroupInfoPageReqVO) => {
    return await requestClient.get<PageResult<GroupInfoVO>>(
      '/usermerchant/group-info/page',
      {
        params,
      },
    );
  },

  getGroupInfo: async (id: number) => {
    return await requestClient.get<GroupInfoDetailVO>(
      '/usermerchant/group-info/get',
      {
        params: { id },
      },
    );
  },

  createGroupInfo: async (data: GroupInfoCreateReqVO) => {
    return await requestClient.post('/usermerchant/group-info/create', data);
  },

  updateGroupInfo: async (data: GroupInfoUpdateReqVO) => {
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
      {
        params,
      },
    );
  },
};
