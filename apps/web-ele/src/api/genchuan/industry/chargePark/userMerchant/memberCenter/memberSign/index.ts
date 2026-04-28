import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员签到 VO
export type MemberSignVO = {
  createTime?: number | string;
  day?: number;
  description?: string;
  id?: number;
  nickname?: string;
  point?: number;
  updateTime?: number | string;
  userId?: number;
};

export type MemberSignPageReqVO = PageParam & {
  createTime?: string | string[];
  nickname?: string;
};

export type MemberSignChartReqVO = {
  timeRange?: string;
};

export type MemberSignChartVO = {
  signRate: number;
  signTrend: Array<{
    count: number;
    date: string;
  }>;
  signUserDistribution: Array<{
    count: number;
    type: string;
  }>;
  todaySignCount: number;
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
