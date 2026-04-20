import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员分组 VO
export type MemberGroupVO = Record<string, unknown>;

export type MemberGroupPageReqVO = PageParam & Record<string, unknown>;

export type MemberGroupSaveReqVO = Record<string, unknown>;

export type MemberGroupOperateReqVO = {
  ids: number[];
};

export type MemberGroupChartReqVO = {
  timeRange?: string;
};

export type MemberGroupChartVO = {
  groupUserDistribution: Array<{
    group: string;
    count: number;
  }>;
  groupCount: number;
  groupUserCount: number;
};

// 会员分组 API
export const MemberGroupApi = {
  getMemberGroupPage: async (params: MemberGroupPageReqVO) => {
    return await requestClient.get<PageResult<MemberGroupVO>>(
      '/usermerchant/member-group/page',
      { params },
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

  saveMemberGroup: async (data: MemberGroupSaveReqVO) => {
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
