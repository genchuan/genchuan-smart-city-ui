import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户运营报表 VO
export type UserOpReportVO = {
  createTime?: string;
  creator?: string;
  filterCondition?: null | string;
  id?: number;
  remark?: string;
  reportType: string;
  statTime: string;
  status?: string;
  timeScale: string;
};

// 用户运营报表分页请求
export type UserOpReportPageReqVO = PageParam & {
  createTime?: string;
  reportType?: string;
  statTime?: string;
  status?: string;
  timeScale?: string;
};

export type UserOpReportGenerateReqVO = {
  filterCondition: string;
  remark?: string;
};

export type UserOpReportChartReqVO = {
  reportId?: number;
  timeRange?: string;
};

export type UserOpReportChartVO = {
  coreIndex: {
    avgCreditScore: number;
    totalMemberCount: number;
    totalUserCount: number;
    userGrowthRate: number;
  };
  userOpTrend: Array<{
    date: string;
    memberCount: number;
    userCount: number;
  }>;
  userTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
};

export type UserOpReportDetailVO = UserOpReportVO & {
  compareSummary?: string;
  summary?: string;
};

// 用户运营报表 API
export const UserOpReportApi = {
  getUserOpReportPage: async (params: UserOpReportPageReqVO) => {
    return await requestClient.get<PageResult<UserOpReportVO>>(
      '/usermerchant/user-op-report/page',
      { params },
    );
  },

  getUserOpReport: async (id: number) => {
    return await requestClient.get<UserOpReportDetailVO>(
      '/usermerchant/user-op-report/get',
      {
        params: { id },
      },
    );
  },

  exportUserOpReport: async (params: UserOpReportPageReqVO) => {
    return await requestClient.download('/usermerchant/user-op-report/export', {
      params,
    });
  },

  generateUserOpReport: async (data: UserOpReportGenerateReqVO) => {
    return await requestClient.post(
      '/usermerchant/user-op-report/generate',
      data,
    );
  },

  getUserOpReportChart: async (params?: UserOpReportChartReqVO) => {
    return await requestClient.get<UserOpReportChartVO>(
      '/usermerchant/user-op-report/chart',
      { params },
    );
  },
};
