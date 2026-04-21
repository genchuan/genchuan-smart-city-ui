import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员等级 VO
export type MemberLevelVO = Record<string, unknown>;

export type MemberLevelPageReqVO = PageParam & Record<string, unknown>;

export type MemberLevelSaveReqVO = Record<string, unknown>;

export type MemberLevelOperateReqVO = {
  ids: number[];
};

export type MemberLevelChartReqVO = {
  timeRange?: string;
};

export type MemberLevelChartVO = {
  levelUserDistribution: Array<{
    level: string;
    count: number;
  }>;
  levelCount: number;
  levelUpgradeRate: number;
};

// 会员等级 API
export const MemberLevelApi = {
  getMemberLevelPage: async (params: MemberLevelPageReqVO) => {
    return await requestClient.get<PageResult<MemberLevelVO>>(
      '/usermerchant/member-level/page',
      { params },
    );
  },

  getMemberLevel: async (id: number) => {
    return await requestClient.get<MemberLevelVO>(
      '/usermerchant/member-level/get',
      {
        params: { id },
      },
    );
  },

  createMemberLevel: async (data: MemberLevelVO) => {
    return await requestClient.post('/usermerchant/member-level/create', data);
  },

  saveMemberLevel: async (data: MemberLevelSaveReqVO) => {
    return await requestClient.post('/usermerchant/member-level/save', data);
  },

  updateMemberLevel: async (data: MemberLevelVO) => {
    return await requestClient.put('/usermerchant/member-level/update', data);
  },

  enableMemberLevel: async (data: MemberLevelOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-level/enable', data);
  },

  disableMemberLevel: async (data: MemberLevelOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-level/disable', data);
  },

  getMemberLevelChart: async (params?: MemberLevelChartReqVO) => {
    return await requestClient.get<MemberLevelChartVO>(
      '/usermerchant/member-level/chart',
      { params },
    );
  },
};
