import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户信息 VO
export type UserInfoVO = {
  carCount?: number;
  createTime?: string;
  creator?: string;
  id?: number;
  loginTime?: string;
  nickname: string;
  phone: string;
  registerTime: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updater?: string;
  updateTime?: string;
  userType: string;
  walletBalance?: number;
};

export type UserInfoCreateReqVO = {
  carCount?: number;
  loginTime?: string;
  nickname: string;
  phone: string;
  registerTime: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  userType: string;
  walletBalance?: number;
};

export type UserInfoUpdateReqVO = UserInfoCreateReqVO & {
  id: number;
};

// 用户信息分页请求
export type UserInfoPageReqVO = PageParam & {
  carCount?: number;
  loginTime?: string;
  nickname?: string;
  phone?: string;
  registerTime?: string;
  remark?: string;
  status?: string;
  userType?: string;
  walletBalance?: number;
};

export type UserInfoOperateReqVO = {
  ids: number[];
};

export type UserInfoOperatorVO = {
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

export type UserInfoWalletLogVO = {
  afterBalance?: number;
  amount?: number;
  id?: number;
  remark?: string;
  time?: number | string;
  type?: string;
};

export type UserInfoCarVO = {
  bindTime?: number | string;
  carType?: string;
  id?: number;
  plateColor?: string;
  plateNo?: string;
  status?: string;
  userId?: number;
};

export type UserInfoAuditLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type UserInfoDetailVO = UserInfoVO & {
  auditLogs?: UserInfoAuditLogVO[];
  auditSummary?: string;
  cars?: UserInfoCarVO[];
  creatorId?: number;
  creatorInfo?: null | UserInfoOperatorVO;
  updaterId?: number;
  updaterInfo?: null | UserInfoOperatorVO;
  walletLogs?: UserInfoWalletLogVO[];
};

export type UserInfoChartReqVO = {
  timeRange?: string;
};

export type UserInfoChartVO = {
  newUserCount: number;
  totalUserCount: number;
  userGrowthTrend: Array<{
    count: number;
    date: string;
  }>;
  userTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
};

// 用户信息 API
export const UserInfoApi = {
  getUserInfoPage: async (params: UserInfoPageReqVO) => {
    return await requestClient.get<PageResult<UserInfoVO>>(
      '/usermerchant/user-info/page',
      {
        params,
      },
    );
  },

  getUserInfo: async (id: number) => {
    return await requestClient.get<UserInfoDetailVO>(
      '/usermerchant/user-info/get',
      {
        params: { id },
      },
    );
  },

  createUserInfo: async (data: UserInfoCreateReqVO) => {
    return await requestClient.post('/usermerchant/user-info/create', data);
  },

  updateUserInfo: async (data: UserInfoUpdateReqVO) => {
    return await requestClient.put('/usermerchant/user-info/update', data);
  },

  importUserInfo: async (file: File) => {
    return await requestClient.upload('/usermerchant/user-info/import', {
      file,
    });
  },

  exportUserInfo: async (params: UserInfoPageReqVO) => {
    return await requestClient.download('/usermerchant/user-info/export', {
      params,
    });
  },

  enableUserInfo: async (data: UserInfoOperateReqVO) => {
    return await requestClient.put('/usermerchant/user-info/enable', data);
  },

  disableUserInfo: async (data: UserInfoOperateReqVO) => {
    return await requestClient.put('/usermerchant/user-info/disable', data);
  },

  getUserInfoChart: async (params?: UserInfoChartReqVO) => {
    return await requestClient.get<UserInfoChartVO>(
      '/usermerchant/user-info/chart',
      {
        params,
      },
    );
  },
};
