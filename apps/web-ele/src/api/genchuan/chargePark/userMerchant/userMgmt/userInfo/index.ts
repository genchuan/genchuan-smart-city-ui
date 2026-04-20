import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户信息 VO
export type UserInfoVO = {
  id?: number;
  nickname: string;
  phone: string;
  userType: string;
  status: string;
  registerTime: string;
  loginTime?: string;
  walletBalance?: number;
  carCount?: number;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updater?: string;
  updateTime?: string;
};

// 用户信息分页请求
export type UserInfoPageReqVO = PageParam & {
  nickname?: string;
  phone?: string;
  userType?: string;
  status?: string;
  registerTime?: string;
  loginTime?: string;
  walletBalance?: number;
  carCount?: number;
  remark?: string;
};

export type UserInfoOperateReqVO = {
  ids: number[];
};

export type UserInfoChartReqVO = {
  timeRange?: string;
};

export type UserInfoChartVO = {
  userGrowthTrend: Array<{
    date: string;
    count: number;
  }>;
  userTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  totalUserCount: number;
  newUserCount: number;
};

// 用户信息 API
export const UserInfoApi = {
  getUserInfoPage: async (params: UserInfoPageReqVO) => {
    return await requestClient.get<PageResult<UserInfoVO>>(
      '/usermerchant/user-info/page',
      { params },
    );
  },

  getUserInfo: async (id: number) => {
    return await requestClient.get<UserInfoVO>('/usermerchant/user-info/get', {
      params: { id },
    });
  },

  createUserInfo: async (data: UserInfoVO) => {
    return await requestClient.post('/usermerchant/user-info/create', data);
  },

  updateUserInfo: async (data: UserInfoVO) => {
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
      { params },
    );
  },
};
