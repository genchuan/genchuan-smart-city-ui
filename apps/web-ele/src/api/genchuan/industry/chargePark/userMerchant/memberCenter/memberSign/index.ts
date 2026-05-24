import type { PageParam, PageResult } from '@vben/request';

import dayjs from 'dayjs';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

export type MemberSignVO = {
  continuousDays?: number;
  createTime?: number | string;
  creator?: string;
  experience?: number;
  id?: number;
  mobile?: string;
  nickname?: string;
  point?: number;
  signDate?: number | string;
  status?: number | string;
  updater?: string;
  updateTime?: number | string;
  userId?: number;
  userName?: string;
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

const QUERY_DATE_FORMAT = 'YYYY-MM-DD';

function formatQueryDateRange(value?: unknown) {
  if (!Array.isArray(value) || value.length !== 2) {
    return undefined;
  }

  const range = value.map((item) => dayjs(item));

  if (range.some((item) => !item.isValid())) {
    return undefined;
  }

  return range.map((item) => item.format(QUERY_DATE_FORMAT));
}

function buildSignQuery(params: MemberSignPageReqVO) {
  const nextParams = normalizeQueryDateTimeRanges(params, [
    'createTime',
    'updateTime',
  ]);
  const signDate = formatQueryDateRange(nextParams.signDate);

  if (signDate) {
    nextParams.signDate = signDate;
  }

  return nextParams;
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
