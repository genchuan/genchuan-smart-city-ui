import type { PageParam, PageResult } from '@vben/request';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

export type MemberConfigVO = {
  configType?: string;
  content?: string;
  createTime?: number | string;
  effectiveTime?: number | string;
  id?: number;
  remark?: string;
  status?: number | string;
  updateTime?: number | string;
};

export type MemberConfigPageReqVO = PageParam & {
  configType?: string;
  content?: string;
  createTime?: string | string[];
  effectiveTime?: string[];
  remark?: string;
  status?: number | string;
  updateTime?: string[];
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

export const MemberConfigApi = {
  getMemberConfigPage: async (params: MemberConfigPageReqVO) => {
    return await requestClient.get<PageResult<MemberConfigVO>>(
      '/usermerchant/member-config/page',
      {
        params: normalizeQueryDateTimeRanges(params, [
          'createTime',
          'effectiveTime',
          'updateTime',
        ]),
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

  createMemberConfig: async (data: MemberConfigVO) => {
    return await requestClient.post('/usermerchant/member-config/create', data);
  },

  saveMemberConfig: async (data: MemberConfigVO) => {
    return await requestClient.post('/usermerchant/member-config/save', data);
  },

  updateMemberConfig: async (data: MemberConfigVO) => {
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
