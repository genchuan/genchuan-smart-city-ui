import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员积分 VO
export type MemberPointVO = Record<string, unknown>;

export type MemberPointPageReqVO = PageParam & Record<string, unknown>;

export type MemberPointCheckReqVO = Record<string, unknown>;

export type MemberPointChartReqVO = {
  timeRange?: string;
};

export type MemberPointChartVO = {
  pointTrend: Array<{
    date: string;
    count: number;
  }>;
  totalPoint: number;
  pointChangeCount: number;
};

// 会员积分 API
export const MemberPointApi = {
  getMemberPointPage: async (params: MemberPointPageReqVO) => {
    return await requestClient.get<PageResult<MemberPointVO>>(
      '/usermerchant/member-point/page',
      { params },
    );
  },

  getMemberPoint: async (id: number) => {
    return await requestClient.get<MemberPointVO>(
      '/usermerchant/member-point/get',
      {
        params: { id },
      },
    );
  },

  exportMemberPoint: async (params: MemberPointPageReqVO) => {
    return await requestClient.download('/usermerchant/member-point/export', {
      params,
    });
  },

  checkMemberPoint: async (data: MemberPointCheckReqVO) => {
    return await requestClient.put('/usermerchant/member-point/check', data);
  },

  getMemberPointChart: async (params?: MemberPointChartReqVO) => {
    return await requestClient.get<MemberPointChartVO>(
      '/usermerchant/member-point/chart',
      { params },
    );
  },
};
