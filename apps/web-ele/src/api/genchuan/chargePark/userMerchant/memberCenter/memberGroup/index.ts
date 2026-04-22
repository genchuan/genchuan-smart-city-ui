import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员分组 VO
export type MemberGroupVO = {
  createTime?: number | string;
  description?: string;
  id?: number;
  name: string;
  remark?: string;
  status?: number | string;
  updateTime?: number | string;
  userCount?: number;
};

export type MemberGroupPageReqVO = PageParam & {
  createTime?: string | string[];
  name?: string;
  status?: number | string;
};

export type MemberGroupSaveReqVO = MemberGroupVO;

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

function normalizeMemberGroup(data?: MemberGroupVO) {
  if (!data) {
    return data;
  }
  return {
    ...data,
    description: data.description ?? data.remark,
  };
}

function buildMemberGroupPayload(data: MemberGroupVO) {
  const { description, ...rest } = data;

  return {
    ...rest,
    remark: description ?? data.remark,
  };
}

// 会员分组 API
export const MemberGroupApi = {
  getMemberGroupPage: async (params: MemberGroupPageReqVO) => {
    const result = await requestClient.get<PageResult<MemberGroupVO>>(
      '/usermerchant/member-group/page',
      { params },
    );
    return {
      ...result,
      list: Array.isArray(result.list)
        ? result.list.map((item) => normalizeMemberGroup(item) as MemberGroupVO)
        : [],
    };
  },

  getMemberGroup: async (id: number) => {
    const result = await requestClient.get<MemberGroupVO>(
      '/usermerchant/member-group/get',
      {
        params: { id },
      },
    );
    return normalizeMemberGroup(result) as MemberGroupVO;
  },

  createMemberGroup: async (data: MemberGroupVO) => {
    return await requestClient.post(
      '/usermerchant/member-group/create',
      buildMemberGroupPayload(data),
    );
  },

  saveMemberGroup: async (data: MemberGroupSaveReqVO) => {
    return await requestClient.post(
      '/usermerchant/member-group/save',
      buildMemberGroupPayload(data),
    );
  },

  updateMemberGroup: async (data: MemberGroupVO) => {
    return await requestClient.put(
      '/usermerchant/member-group/update',
      buildMemberGroupPayload(data),
    );
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
