import type { PageParam, PageResult } from '@vben/request';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

export type MemberPointVO = {
  bizId?: number | string;
  bizType?: number | string;
  changeAmount?: number;
  changeReason?: string;
  changeType?: number | string;
  checkBy?: string;
  checkResult?: string;
  checkTime?: number | string;
  createTime?: number | string;
  creator?: string;
  description?: string;
  id?: number;
  mobile?: string;
  nickname?: string;
  status?: number | string;
  title?: string;
  totalPoint?: number;
  updater?: string;
  updateTime?: number | string;
  userId?: number;
  userName?: string;
};

export type MemberPointPageReqVO = PageParam & {
  bizId?: number | string;
  bizType?: number | string;
  changeAmount?: number | string;
  changeReason?: string;
  changeType?: number | string;
  checkBy?: string;
  checkResult?: string;
  checkTime?: string[];
  createTime?: string | string[];
  description?: string;
  nickname?: string;
  status?: number | string;
  title?: string;
  totalPoint?: number | string;
  updateTime?: string[];
  userId?: number;
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

function buildPointQuery(params: MemberPointPageReqVO) {
  return normalizeQueryDateTimeRanges(params, [
    'checkTime',
    'createTime',
    'updateTime',
  ]);
}

export const MemberPointApi = {
  getMemberPointPage: async (params: MemberPointPageReqVO) => {
    return await requestClient.get<PageResult<MemberPointVO>>(
      '/usermerchant/member-point/page',
      {
        params: buildPointQuery(params),
      },
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
      params: buildPointQuery(params),
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
