import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户对接 VO
export type MerchantLinkVO = {
  id?: number;
  merchantId: number;
  linkType: string;
  apiUrl: string;
  apiKey?: string;
  status: string;
  effectTime?: string;
  lastSyncTime?: string;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 商户对接分页请求
export type MerchantLinkPageReqVO = PageParam & {
  merchantId?: number;
  linkType?: string;
  apiUrl?: string;
  status?: string;
  effectTime?: string;
  lastSyncTime?: string;
  remark?: string;
};

export type MerchantLinkSaveReqVO = MerchantLinkVO & {
  id?: number;
};

export type MerchantLinkOperateReqVO = {
  ids: number[];
};

export type MerchantLinkChartReqVO = {
  timeRange?: string;
};

export type MerchantLinkChartVO = {
  linkTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  linkMerchantCount: number;
  linkSuccessRate: number;
};

// 商户对接 API
export const MerchantLinkApi = {
  getMerchantLinkPage: async (params: MerchantLinkPageReqVO) => {
    return await requestClient.get<PageResult<MerchantLinkVO>>(
      '/usermerchant/merchant-link/page',
      { params },
    );
  },

  getMerchantLink: async (id: number) => {
    return await requestClient.get<MerchantLinkVO>(
      '/usermerchant/merchant-link/get',
      {
        params: { id },
      },
    );
  },

  createMerchantLink: async (data: MerchantLinkVO) => {
    return await requestClient.post('/usermerchant/merchant-link/create', data);
  },

  saveMerchantLink: async (data: MerchantLinkSaveReqVO) => {
    return await requestClient.post('/usermerchant/merchant-link/save', data);
  },

  updateMerchantLink: async (data: MerchantLinkVO) => {
    return await requestClient.put('/usermerchant/merchant-link/update', data);
  },

  linkMerchant: async (data: MerchantLinkOperateReqVO) => {
    return await requestClient.put('/usermerchant/merchant-link/link', data);
  },

  unlinkMerchant: async (data: MerchantLinkOperateReqVO) => {
    return await requestClient.put('/usermerchant/merchant-link/unlink', data);
  },

  getMerchantLinkChart: async (params?: MerchantLinkChartReqVO) => {
    return await requestClient.get<MerchantLinkChartVO>(
      '/usermerchant/merchant-link/chart',
      { params },
    );
  },
};
