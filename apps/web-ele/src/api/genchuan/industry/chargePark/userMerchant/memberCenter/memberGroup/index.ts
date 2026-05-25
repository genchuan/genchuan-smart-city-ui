import type { PageParam, PageResult } from '@vben/request';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

export type MemberGroupVO = {
  createTime?: number | string;
  creator?: string;
  description?: string;
  effectiveTime?: number | string;
  groupUserCount?: number;
  id?: number;
  memberCount?: number;
  memberUserCount?: number;
  name: string;
  remark?: string;
  rule?: string;
  status?: number | string;
  updater?: string;
  updateTime?: number | string;
  userCount?: number;
};

export type MemberGroupPageReqVO = PageParam & {
  createTime?: string | string[];
  description?: string;
  effectiveTime?: string[];
  name?: string;
  remark?: string;
  rule?: string;
  status?: number | string;
  updateTime?: string[];
};

export type MemberGroupOperateReqVO = {
  ids: number[];
};

export type MemberGroupChartReqVO = {
  timeRange?: string;
};

export type MemberGroupChartVO = {
  groupCount: number;
  groupUserCount: number;
  groupUserDistribution: Array<{
    count: number;
    group: string;
  }>;
};

export const MemberGroupApi = {
  getMemberGroupPage: async (params: MemberGroupPageReqVO) => {
    return await requestClient.get<PageResult<MemberGroupVO>>(
      '/usermerchant/member-group/page',
      {
        params: normalizeQueryDateTimeRanges(params, [
          'createTime',
          'effectiveTime',
          'updateTime',
        ]),
      },
    );
  },

  getMemberGroup: async (id: number) => {
    return await requestClient.get<MemberGroupVO>(
      '/usermerchant/member-group/get',
      {
        params: { id },
      },
    );
  },

  createMemberGroup: async (data: MemberGroupVO) => {
    return await requestClient.post('/usermerchant/member-group/create', data);
  },

  saveMemberGroup: async (data: MemberGroupVO) => {
    return await requestClient.post('/usermerchant/member-group/save', data);
  },

  updateMemberGroup: async (data: MemberGroupVO) => {
    return await requestClient.put('/usermerchant/member-group/update', data);
  },

  enableMemberGroup: async (data: MemberGroupOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-group/enable', data);
  },

  disableMemberGroup: async (data: MemberGroupOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-group/disable', data);
  },

  getMemberGroupChart: async (params?: MemberGroupChartReqVO) => {
    return await requestClient.get<MemberGroupChartVO>(
      '/usermerchant/member-group/chart',
      { params },
    );
  },
};
