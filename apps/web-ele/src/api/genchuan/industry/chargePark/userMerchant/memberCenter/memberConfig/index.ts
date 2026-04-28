import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 会员配置 VO
export type MemberConfigVO = {
  createTime?: string;
  id?: number;
  pointTradeDeductEnable: boolean | number;
  pointTradeDeductMaxPrice: number;
  pointTradeDeductUnitPrice: number;
  pointTradeGivePoint: number;
  status?: string;
  updateTime?: string;
};

export type MemberConfigCreateReqVO = MemberConfigVO;

export type MemberConfigUpdateReqVO = MemberConfigVO & {
  id: number;
};

export type MemberConfigPageReqVO = PageParam & {
  status?: string;
};

export type MemberConfigSaveReqVO = {
  id?: number;
  pointTradeDeductEnable: boolean | number;
  pointTradeDeductMaxPrice: number;
  pointTradeDeductUnitPrice: number;
  pointTradeGivePoint: number;
};

export type MemberConfigOperateReqVO = {
  ids: number[];
};

export type MemberConfigChartReqVO = {
  timeRange?: string;
};

export type MemberConfigChartVO = {
  configTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
  effectConfigCount: number;
  memberMatchRate: number;
};

// 会员配置 API
export const MemberConfigApi = {
  getMemberConfigPage: async (params: MemberConfigPageReqVO) => {
    return await requestClient.get<PageResult<MemberConfigVO>>(
      '/usermerchant/member-config/page',
      {
        params,
      },
    );
  },

  getMemberConfig: async (id: number) => {
    return await requestClient.get<MemberConfigVO>(
      '/usermerchant/member-config/get',
      {
        params: { id },
      },
    );
  },

  createMemberConfig: async (data: MemberConfigCreateReqVO) => {
    return await requestClient.post('/usermerchant/member-config/create', data);
  },

  saveMemberConfig: async (data: MemberConfigSaveReqVO) => {
    return await requestClient.post('/usermerchant/member-config/save', data);
  },

  updateMemberConfig: async (data: MemberConfigUpdateReqVO) => {
    return await requestClient.put('/usermerchant/member-config/update', data);
  },

  enableMemberConfig: async (data: MemberConfigOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-config/enable', data);
  },

  disableMemberConfig: async (data: MemberConfigOperateReqVO) => {
    return await requestClient.put('/usermerchant/member-config/disable', data);
  },

  getMemberConfigChart: async (params?: MemberConfigChartReqVO) => {
    return await requestClient.get<MemberConfigChartVO>(
      '/usermerchant/member-config/chart',
      {
        params,
      },
    );
  },
};
