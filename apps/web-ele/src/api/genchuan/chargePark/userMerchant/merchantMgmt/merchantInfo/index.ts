import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户信息 VO
export type MerchantInfoVO = {
  id?: number;
  name: string;
  contact: string;
  phone: string;
  merchantType: string;
  address?: string;
  registerTime: string;
  status: string;
  walletBalance?: number;
  auditorId?: number | null;
  auditTime?: string | null;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 商户信息分页请求
export type MerchantInfoPageReqVO = PageParam & {
  name?: string;
  contact?: string;
  phone?: string;
  merchantType?: string;
  address?: string;
  registerTime?: string;
  status?: string;
  walletBalance?: number;
  auditorId?: number;
  auditTime?: string;
  remark?: string;
};

export type MerchantInfoAuditReqVO = {
  ids: number[];
  auditRemark?: string;
};

export type MerchantInfoRejectReqVO = {
  ids: number[];
  auditRemark: string;
};

export type MerchantInfoOperateReqVO = {
  ids: number[];
};

export type MerchantInfoChartReqVO = {
  timeRange?: string;
};

export type MerchantInfoChartVO = {
  merchantGrowthTrend: Array<{
    date: string;
    count: number;
  }>;
  merchantTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
  totalMerchantCount: number;
  newMerchantCount: number;
};

// 商户信息 API
export const MerchantInfoApi = {
  getMerchantInfoPage: async (params: MerchantInfoPageReqVO) => {
    return await requestClient.get<PageResult<MerchantInfoVO>>(
      '/usermerchant/merchant-info/page',
      { params },
    );
  },

  getMerchantInfo: async (id: number) => {
    return await requestClient.get<MerchantInfoVO>(
      '/usermerchant/merchant-info/get',
      {
        params: { id },
      },
    );
  },

  createMerchantInfo: async (data: MerchantInfoVO) => {
    return await requestClient.post('/usermerchant/merchant-info/create', data);
  },

  updateMerchantInfo: async (data: MerchantInfoVO) => {
    return await requestClient.put('/usermerchant/merchant-info/update', data);
  },

  importMerchantInfo: async (file: File) => {
    return await requestClient.upload('/usermerchant/merchant-info/import', {
      file,
    });
  },

  exportMerchantInfo: async (params: MerchantInfoPageReqVO) => {
    return await requestClient.download('/usermerchant/merchant-info/export', {
      params,
    });
  },

  approveMerchantInfo: async (data: MerchantInfoAuditReqVO) => {
    return await requestClient.put('/usermerchant/merchant-info/approve', data);
  },

  rejectMerchantInfo: async (data: MerchantInfoRejectReqVO) => {
    return await requestClient.put('/usermerchant/merchant-info/reject', data);
  },

  enableMerchantInfo: async (data: MerchantInfoOperateReqVO) => {
    return await requestClient.put('/usermerchant/merchant-info/enable', data);
  },

  disableMerchantInfo: async (data: MerchantInfoOperateReqVO) => {
    return await requestClient.put('/usermerchant/merchant-info/disable', data);
  },

  getMerchantInfoChart: async (params?: MerchantInfoChartReqVO) => {
    return await requestClient.get<MerchantInfoChartVO>(
      '/usermerchant/merchant-info/chart',
      { params },
    );
  },
};
