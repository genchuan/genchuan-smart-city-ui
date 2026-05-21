import type { PageParam, PageResult } from '@vben/request';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

export type MemberSignVO = {
  continuousDays?: number;
  createTime?: number | string;
  creator?: string;
  experience?: number;
  id?: number;
  point?: number;
  signDate?: number | string;
  status?: number | string;
  updater?: string;
  updateTime?: number | string;
  userId?: number;
};

export type MemberSignPageReqVO = PageParam & {
  continuousDays?: number;
  createTime?: string | string[];
  experience?: number;
  point?: number;
  signDate?: string[];
  status?: number | string;
  updateTime?: string[];
  userId?: number;
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

function buildSignQuery(params: MemberSignPageReqVO) {
  return normalizeQueryDateTimeRanges(params, [
    'createTime',
    'signDate',
    'updateTime',
  ]);
}

export const MemberSignApi = {
  getMemberSignPage: async (params: MemberSignPageReqVO) => {
    return await requestClient.get<PageResult<MemberSignVO>>(
      '/usermerchant/member-sign/page',
      {
        params: buildSignQuery(params),
      },
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
      params: buildSignQuery(params),
    });
  },

  getMemberSignChart: async (params?: MemberSignChartReqVO) => {
    return await requestClient.get<MemberSignChartVO>(
      '/usermerchant/member-sign/chart',
      { params },
    );
  },
};
