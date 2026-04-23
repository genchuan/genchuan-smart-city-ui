import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员等级 VO
export type MemberLevelVO = {
  backgroundUrl?: string;
  bgUrl?: string;
  createTime?: number | string;
  discountPercent?: number;
  experience?: number;
  icon?: string;
  id?: number;
  level?: number;
  name: string;
  remark?: string;
  status?: number | string;
  updateTime?: number | string;
  userCount?: number;
  value?: number;
};

export type MemberLevelPageReqVO = PageParam & {
  createTime?: string | string[];
  name?: string;
  status?: number | string;
};

export type MemberLevelSaveReqVO = MemberLevelVO;

export type MemberLevelOperateReqVO = {
  ids: number[];
};

export type MemberLevelChartReqVO = {
  timeRange?: string;
};

export type MemberLevelChartVO = {
  levelCount: number;
  levelUpgradeRate: number;
  levelUserDistribution: Array<{
    count: number;
    level: string;
  }>;
};

function normalizeMemberLevel(data?: MemberLevelVO) {
  if (!data) {
    return data;
  }
  return {
    ...data,
    backgroundUrl: data.backgroundUrl ?? data.bgUrl,
    level: data.level ?? data.value,
  };
}

function buildMemberLevelPayload(data: MemberLevelVO) {
  return {
    ...data,
    bgUrl: data.backgroundUrl ?? data.bgUrl,
    value: data.level ?? data.value,
  };
}

// 会员等级 API
export const MemberLevelApi = {
  getMemberLevelPage: async (params: MemberLevelPageReqVO) => {
    const result = await requestClient.get<PageResult<MemberLevelVO>>(
      '/usermerchant/member-level/page',
      { params },
    );
    return {
      ...result,
      list: Array.isArray(result.list)
        ? result.list.map((item) => normalizeMemberLevel(item) as MemberLevelVO)
        : [],
    };
  },

  getMemberLevel: async (id: number) => {
    const result = await requestClient.get<MemberLevelVO>(
      '/usermerchant/member-level/get',
      {
        params: { id },
      },
    );
    return normalizeMemberLevel(result) as MemberLevelVO;
  },

  createMemberLevel: async (data: MemberLevelVO) => {
    return await requestClient.post(
      '/usermerchant/member-level/create',
      buildMemberLevelPayload(data),
    );
  },

  saveMemberLevel: async (data: MemberLevelSaveReqVO) => {
    return await requestClient.post(
      '/usermerchant/member-level/save',
      buildMemberLevelPayload(data),
    );
  },

  updateMemberLevel: async (data: MemberLevelVO) => {
    return await requestClient.put(
      '/usermerchant/member-level/update',
      buildMemberLevelPayload(data),
    );
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
