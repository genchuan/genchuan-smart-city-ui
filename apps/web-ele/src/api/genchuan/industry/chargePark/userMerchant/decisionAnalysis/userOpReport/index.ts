import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 用户运营报表 VO
export type UserOpReportVO = {
  avgCreditScore?: number;
  bindCarCount?: number;
  createTime?: string;
  creator?: string;
  filterCondition?: null | string;
  id?: number;
  linkMerchantCount?: number;
  newGroupCount?: number;
  newMemberCount?: number;
  newMerchantCount?: number;
  newUserCount?: number;
  plateAuthCount?: number;
  rechargeAmount?: number;
  remark?: string;
  reportCycle?: string;
  reportStatus?: string;
  reportType: string;
  sendCouponCount?: number;
  statEndTime?: string;
  statStartTime?: string;
  statTime: string;
  status?: string;
  timeScale: string;
};

// 用户运营报表分页请求
export type UserOpReportPageReqVO = PageParam & {
  createTime?: string;
  reportCycle?: string;
  reportStatus?: string;
  reportType?: string;
  statEndTime?: string[];
  statStartTime?: string[];
  statTime?: string;
  status?: string;
  timeScale?: string;
};

export type UserOpReportGenerateReqVO = {
  filterCondition?: string;
  remark?: string;
  reportCycle?: string;
  statEndTime?: string;
  statStartTime?: string;
};

export type UserOpReportChartReqVO = {
  reportCycle?: string;
  reportId?: number;
  statEndTime?: string;
  statStartTime?: string;
  timeRange?: string;
};

export type UserOpReportChartVO = {
  barData?: {
    carType?: Array<{ name: string; value: number }>;
    groupType?: Array<{ name: string; value: number }>;
    merchantType?: Array<{ name: string; value: number }>;
    userType?: Array<{ name: string; value: number }>;
  };
  cardData?: {
    avgCreditScore?: number;
    bindCarCount?: number;
    linkMerchantCount?: number;
    newGroupCount?: number;
    newMemberCount?: number;
    newMerchantCount?: number;
    newUserCount?: number;
    plateAuthCount?: number;
    rechargeAmount?: number;
    sendCouponCount?: number;
  };
  coreIndex: {
    avgCreditScore: number;
    totalMemberCount: number;
    totalUserCount: number;
    userGrowthRate: number;
  };
  lineData?: {
    plateAuth?: Array<{ count: number; date: string }>;
    rechargeAmount?: Array<{ amount: number; date: string }>;
    sendCoupon?: Array<{ count: number; date: string }>;
    userGrowth?: Array<{ count: number; date: string }>;
  };
  pieData?: {
    creditLevel?: Array<{ name: string; value: number }>;
    memberLevel?: Array<{ name: string; value: number }>;
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
  barData?: UserOpReportChartVO['barData'];
  compareSummary?: string;
  coreIndex?: UserOpReportChartVO['coreIndex'];
  creditLevelDistribution?: Record<string, number>;
  exportCount?: number;
  lineData?: UserOpReportChartVO['lineData'];
  memberLevelDistribution?: Record<string, number>;
  pieData?: UserOpReportChartVO['pieData'];
  summary?: string;
  userOpTrend?: UserOpReportChartVO['userOpTrend'];
  userTypeDistribution?: UserOpReportChartVO['userTypeDistribution'];
};

// 用户运营报表 API
export const UserOpReportApi = {
  getUserOpReportPage: async (params: UserOpReportPageReqVO) => {
    return await requestClient.get<PageResult<UserOpReportVO>>(
      '/usermerchant/cycle-report/page',
      { params },
    );
  },

  getUserOpReport: async (id: number) => {
    return await requestClient.get<UserOpReportDetailVO>(
      '/usermerchant/cycle-report/get',
      {
        params: { id },
      },
    );
  },

  exportUserOpReport: async (params: UserOpReportPageReqVO) => {
    return await requestClient.download('/usermerchant/cycle-report/export', {
      params,
    });
  },

  createUserOpReport: async (data: UserOpReportGenerateReqVO) => {
    return await requestClient.post('/usermerchant/cycle-report/create', data);
  },

  generateUserOpReport: async (data: UserOpReportGenerateReqVO) => {
    return await requestClient.post(
      '/usermerchant/cycle-report/generate',
      data,
    );
  },

  getUserOpReportChart: async (_params?: UserOpReportChartReqVO) => {
    return {
      coreIndex: {
        avgCreditScore: 0,
        totalMemberCount: 0,
        totalUserCount: 0,
        userGrowthRate: 0,
      },
      userOpTrend: [],
      userTypeDistribution: [],
    } as UserOpReportChartVO;
  },
};
