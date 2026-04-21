import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户信用 VO
export type UserCreditVO = {
  id?: number;
  userId: number;
  creditScore: number;
  creditLevel: string;
  ruleCode?: string;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 用户信用分页请求
export type UserCreditPageReqVO = PageParam & {
  userId?: number;
  creditScore?: number;
  creditLevel?: string;
  updateTime?: string;
  ruleCode?: string;
  remark?: string;
};

export type UserCreditOperateReqVO = {
  ids: number[];
};

export type UserCreditChartReqVO = {
  timeRange?: string;
};

export type UserCreditChartVO = {
  creditLevelDistribution: Array<{
    level: string;
    count: number;
  }>;
  avgCreditScore: number;
  lowCreditUserCount: number;
};

// 用户信用 API
export const UserCreditApi = {
  getUserCreditPage: async (params: UserCreditPageReqVO) => {
    return await requestClient.get<PageResult<UserCreditVO>>(
      '/usermerchant/user-credit/page',
      { params },
    );
  },

  getUserCredit: async (id: number) => {
    return await requestClient.get<UserCreditVO>(
      '/usermerchant/user-credit/get',
      {
        params: { id },
      },
    );
  },

  exportUserCredit: async (params: UserCreditPageReqVO) => {
    return await requestClient.download('/usermerchant/user-credit/export', {
      params,
    });
  },

  remindUserCredit: async (data: UserCreditOperateReqVO) => {
    return await requestClient.put('/usermerchant/user-credit/remind', data);
  },

  getUserCreditChart: async (params?: UserCreditChartReqVO) => {
    return await requestClient.get<UserCreditChartVO>(
      '/usermerchant/user-credit/chart',
      { params },
    );
  },
};
