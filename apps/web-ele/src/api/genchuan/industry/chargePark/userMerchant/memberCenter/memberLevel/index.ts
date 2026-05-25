import type { PageParam, PageResult } from '@vben/request';

import { normalizeQueryDateTimeRanges } from '#/api/genchuan/industry/chargePark/userMerchant/utils/query';
import { requestClient } from '#/api/request';

export type MemberLevelVO = {
  benefits?: string;
  createTime?: number | string;
  effectiveTime?: number | string;
  id?: number;
  levelUserCount?: number;
  levelValue?: number;
  memberCount?: number;
  memberUserCount?: number;
  name: string;
  remark?: string;
  status?: number | string;
  updateTime?: number | string;
  upgradeCondition?: string;
  userCount?: number;
};

export type MemberLevelPageReqVO = PageParam & {
  benefits?: string;
  createTime?: string | string[];
  effectiveTime?: string[];
  levelValue?: number;
  name?: string;
  remark?: string;
  status?: number | string;
  updateTime?: string[];
  upgradeCondition?: string;
};

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

export const MemberLevelApi = {
  getMemberLevelPage: async (params: MemberLevelPageReqVO) => {
    return await requestClient.get<PageResult<MemberLevelVO>>(
      '/usermerchant/member-level/page',
      {
        params: normalizeQueryDateTimeRanges(params, [
          'createTime',
          'effectiveTime',
          'updateTime',
        ]),
      },
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

  saveMemberLevel: async (data: MemberLevelVO) => {
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
