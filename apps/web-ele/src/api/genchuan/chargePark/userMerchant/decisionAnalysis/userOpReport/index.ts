import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户运营报表 VO
export type UserOpReportVO = {
  id?: number;
  reportType: string;
  timeScale: string;
  statTime: string;
  createTime?: string;
  filterCondition?: string | null;
  status?: string;
  creator?: string;
  remark?: string;
};

// 用户运营报表分页请求
export type UserOpReportPageReqVO = PageParam & {
  reportType?: string;
  timeScale?: string;
  statTime?: string;
  createTime?: string;
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
  userOpTrend: Array<{
    date: string;
    userCount: number;
    memberCount: number;
  }>;
  userTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  coreIndex: {
    totalUserCount: number;
    totalMemberCount: number;
    avgCreditScore: number;
    userGrowthRate: number;
  };
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
    return await requestClient.get<UserOpReportVO>(
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
