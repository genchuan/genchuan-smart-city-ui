import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户对接 VO
export type MerchantLinkVO = {
  apiKey?: string;
  apiUrl: string;
  createTime?: number | string;
  creator?: string;
  effectTime?: null | number | string;
  id?: number;
  lastSyncTime?: null | number | string;
  linkType: string;
  merchantId: number;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updateTime?: number | string;
};

export type MerchantLinkCreateReqVO = {
  apiKey?: string;
  apiUrl: string;
  effectTime?: null | string;
  linkType: string;
  merchantId: number;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
};

export type MerchantLinkUpdateReqVO = MerchantLinkCreateReqVO & {
  id: number;
};

export type MerchantLinkSaveReqVO = MerchantLinkCreateReqVO & {
  id?: number;
};

export type MerchantLinkMerchantVO = {
  address?: string;
  contact?: string;
  id?: number;
  merchantType?: string;
  name?: string;
  phone?: string;
  registerTime?: number | string;
  remark?: string;
  status?: string;
};

export type MerchantLinkSyncLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  result?: string;
  time?: number | string;
};

export type MerchantLinkDetailVO = MerchantLinkVO & {
  merchantInfo?: MerchantLinkMerchantVO | null;
  syncLogs?: MerchantLinkSyncLogVO[];
};

// 商户对接分页请求
export type MerchantLinkPageReqVO = PageParam & {
  apiUrl?: string;
  effectTime?: string[];
  lastSyncTime?: string[];
  linkType?: string;
  merchantId?: number;
  remark?: string;
  status?: string;
};

export type MerchantLinkOperateReqVO = {
  ids: number[];
};

export type MerchantLinkChartReqVO = {
  timeRange?: string;
};

export type MerchantLinkChartVO = {
  linkMerchantCount: number;
  linkSuccessRate: number;
  linkTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
};

// 商户对接 API
export const MerchantLinkApi = {
  getMerchantLinkPage: async (params: MerchantLinkPageReqVO) => {
    return await requestClient.get<PageResult<MerchantLinkVO>>(
      '/usermerchant/merchant-link/page',
      {
        params,
      },
    );
  },

  getMerchantLink: async (id: number) => {
    return await requestClient.get<MerchantLinkDetailVO>(
      '/usermerchant/merchant-link/get',
      {
        params: { id },
      },
    );
  },

  createMerchantLink: async (data: MerchantLinkCreateReqVO) => {
    return await requestClient.post('/usermerchant/merchant-link/create', data);
  },

  saveMerchantLink: async (data: MerchantLinkSaveReqVO) => {
    return await requestClient.post('/usermerchant/merchant-link/save', data);
  },

  updateMerchantLink: async (data: MerchantLinkUpdateReqVO) => {
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
      {
        params,
      },
    );
  },
};
