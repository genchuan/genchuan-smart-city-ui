import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员积分 VO
export type MemberPointVO = {
  bizId?: number | string;
  bizType?: number | string;
  checkResult?: string;
  createTime?: number | string;
  description?: string;
  id?: number;
  nickname?: string;
  point?: number;
  status?: string;
  title?: string;
  totalPoint?: number;
  updateTime?: number | string;
  userId?: number;
};

export type MemberPointPageReqVO = PageParam & {
  bizType?: number | string;
  createTime?: string | string[];
  nickname?: string;
  point?: number | string;
  status?: string;
};

export type MemberPointCheckReqVO = {
  checkResult: string;
  id: number;
};

export type MemberPointChartReqVO = {
  timeRange?: string;
};

export type MemberPointChartVO = {
  pointChangeCount: number;
  pointTrend: Array<{
    count: number;
    date: string;
  }>;
  totalPoint: number;
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
