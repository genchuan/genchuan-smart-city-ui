import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户信用 VO
export type UserCreditVO = {
  createTime?: string;
  creator?: string;
  creditLevel: string;
  creditScore: number;
  id?: number;
  nickname?: string;
  phone?: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  ruleCode?: string;
  ruleDesc?: string;
  updater?: string;
  updateTime?: string;
  userId: number;
  userName?: string;
  userType?: string;
};

// 用户信用分页请求
export type UserCreditPageReqVO = PageParam & {
  creditLevel?: string;
  creditScore?: number | string;
  nickname?: string;
  remark?: string;
  ruleCode?: string;
  updateTime?: string[];
  userId?: number;
};

export type UserCreditOperateReqVO = {
  ids: number[];
};

export type UserCreditChangeRecordVO = {
  afterScore?: number;
  beforeScore?: number;
  changeReason?: string;
  changeTime?: number | string;
  id?: number;
  operator?: string;
};

export type UserCreditAuditLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type UserCreditDetailVO = UserCreditVO & {
  auditLogs?: UserCreditAuditLogVO[];
  auditSummary?: string;
  changeRecords?: UserCreditChangeRecordVO[];
};

export type UserCreditChartReqVO = {
  timeRange?: string;
};

export type UserCreditChartVO = {
  avgCreditScore: number;
  creditLevelDistribution: Array<{
    count: number;
    level: string;
  }>;
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
    return await requestClient.get<UserCreditDetailVO>(
      '/usermerchant/user-credit/get',
      {
        params: { id },
      },
    );
  },

  exportUserCredit: async (params: UserCreditPageReqVO) => {
    return await requestClient.download(
      '/usermerchant/user-credit/export-excel',
      {
        params,
      },
    );
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
