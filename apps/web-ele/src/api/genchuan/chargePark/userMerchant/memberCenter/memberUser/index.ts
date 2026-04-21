import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员用户 VO
export type MemberUserVO = Record<string, unknown>;

export type MemberUserPageReqVO = PageParam & Record<string, unknown>;

export type MemberUserOperateReqVO = {
  ids: number[];
};

export type MemberUserChartReqVO = {
  timeRange?: string;
};

export type MemberUserChartVO = {
  memberGrowthTrend: Array<{
    date: string;
    count: number;
  }>;
  totalMemberCount: number;
  newMemberCount: number;
};

// 会员用户 API
export const MemberUserApi = {
  getMemberUserPage: async (params: MemberUserPageReqVO) => {
    return await requestClient.get<PageResult<MemberUserVO>>(
      '/usermerchant/member-user/page',
      { params },
    );
  },

  getMemberUser: async (id: number) => {
    return await requestClient.get<MemberUserVO>(
      '/usermerchant/member-user/get',
      {
        params: { id },
      },
    );
  },

  createMemberUser: async (data: MemberUserVO) => {
    return await requestClient.post('/usermerchant/member-user/create', data);
  },

  updateMemberUser: async (data: MemberUserVO) => {
    return await requestClient.put('/usermerchant/member-user/update', data);
  },

  importMemberUser: async (file: File) => {
    return await requestClient.upload('/usermerchant/member-user/import', {
      file,
    });
  },

  exportMemberUser: async (params: MemberUserPageReqVO) => {
    return await requestClient.download('/usermerchant/member-user/export', {
      params,
    });
  },

  enableMemberUser: async (data: MemberUserOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-user/enable', data);
  },

  disableMemberUser: async (data: MemberUserOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-user/disable', data);
  },

  getMemberUserChart: async (params?: MemberUserChartReqVO) => {
    return await requestClient.get<MemberUserChartVO>(
      '/usermerchant/member-user/chart',
      { params },
    );
  },
};
