import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员签到 VO
export type MemberSignVO = Record<string, unknown>;

export type MemberSignPageReqVO = PageParam & Record<string, unknown>;

export type MemberSignChartReqVO = {
  timeRange?: string;
};

export type MemberSignChartVO = {
  signTrend: Array<{
    date: string;
    count: number;
  }>;
  signUserDistribution: Array<{
    type: string;
    count: number;
  }>;
  todaySignCount: number;
  signRate: number;
};

// 会员签到 API
export const MemberSignApi = {
  getMemberSignPage: async (params: MemberSignPageReqVO) => {
    return await requestClient.get<PageResult<MemberSignVO>>(
      '/usermerchant/member-sign/page',
      { params },
    );
  },

  getMemberSign: async (id: number) => {
    return await requestClient.get<MemberSignVO>(
      '/usermerchant/member-sign/get',
      {
        params: { id },
      },
    );
  },

  exportMemberSign: async (params: MemberSignPageReqVO) => {
    return await requestClient.download('/usermerchant/member-sign/export', {
      params,
    });
  },

  getMemberSignChart: async (params?: MemberSignChartReqVO) => {
    return await requestClient.get<MemberSignChartVO>(
      '/usermerchant/member-sign/chart',
      { params },
    );
  },
};
