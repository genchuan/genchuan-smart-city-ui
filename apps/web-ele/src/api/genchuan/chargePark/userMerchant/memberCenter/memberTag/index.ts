import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员标签 VO
export type MemberTagVO = {
  createTime?: number | string;
  description?: string;
  id?: number;
  name: string;
  status?: number | string;
  updateTime?: number | string;
  userCount?: number;
};

export type MemberTagPageReqVO = PageParam & {
  createTime?: string | string[];
  name?: string;
  status?: number | string;
};

export type MemberTagOperateReqVO = {
  ids: number[];
};

export type MemberTagChartReqVO = {
  timeRange?: string;
};

export type MemberTagChartVO = {
  tagCount: number;
  tagDistribution: Array<{
    count: number;
    type: string;
  }>;
  tagUserCount: number;
};

// 会员标签 API
export const MemberTagApi = {
  getMemberTagPage: async (params: MemberTagPageReqVO) => {
    return await requestClient.get<PageResult<MemberTagVO>>(
      '/usermerchant/member-tag/page',
      { params },
    );
  },

  getMemberTag: async (id: number) => {
    return await requestClient.get<MemberTagVO>(
      '/usermerchant/member-tag/get',
      {
        params: { id },
      },
    );
  },

  createMemberTag: async (data: MemberTagVO) => {
    return await requestClient.post('/usermerchant/member-tag/create', data);
  },

  updateMemberTag: async (data: MemberTagVO) => {
    return await requestClient.put('/usermerchant/member-tag/update', data);
  },

  importMemberTag: async (file: File) => {
    return await requestClient.upload('/usermerchant/member-tag/import', {
      file,
    });
  },

  exportMemberTag: async (params: MemberTagPageReqVO) => {
    return await requestClient.download('/usermerchant/member-tag/export', {
      params,
    });
  },

  enableMemberTag: async (data: MemberTagOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-tag/enable', data);
  },

  disableMemberTag: async (data: MemberTagOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-tag/disable', data);
  },

  getMemberTagChart: async (params?: MemberTagChartReqVO) => {
    return await requestClient.get<MemberTagChartVO>(
      '/usermerchant/member-tag/chart',
      { params },
    );
  },
};
