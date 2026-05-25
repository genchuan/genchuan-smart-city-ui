import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户信息 VO
export type MerchantInfoVO = {
  address?: string;
  auditorId?: null | number;
  auditTime?: null | string;
  contact: string;
  createTime?: string;
  creator?: string;
  id?: number;
  merchantType: string;
  name: string;
  phone: string;
  registerTime: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updater?: string;
  updateTime?: string;
  walletBalance?: number;
};

export type MerchantInfoCreateReqVO = {
  address?: string;
  contact: string;
  merchantType: string;
  name: string;
  phone: string;
  registerTime: string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  walletBalance?: number;
};

export type MerchantInfoUpdateReqVO = MerchantInfoCreateReqVO & {
  id: number;
};

// 商户信息分页请求
export type MerchantInfoPageReqVO = PageParam & {
  address?: string;
  auditorId?: number;
  auditTime?: string[];
  contact?: string;
  merchantType?: string;
  name?: string;
  phone?: string;
  registerTime?: string[];
  remark?: string;
  status?: string;
  walletBalance?: number;
};

export type MerchantInfoOperateReqVO = {
  ids: number[];
};

export type MerchantInfoAuditReqVO = MerchantInfoUpdateReqVO & {
  auditRemark?: string;
  auditResult?: string;
  ids?: number[];
};

export type MerchantInfoRejectReqVO = MerchantInfoAuditReqVO;

export type MerchantInfoOperatorVO = {
  account?: string;
  dept?: string;
  deptName?: string;
  id?: number;
  mobile?: string;
  name?: string;
  nickname?: string;
  phone?: string;
  role?: string;
  roleNames?: string[];
};

export type MerchantAccountLogVO = {
  afterBalance?: number;
  amount?: number;
  id?: number;
  remark?: string;
  time?: number | string;
  type?: string;
};

export type MerchantLinkInfoVO = {
  apiUrl?: string;
  id?: number;
  linkType?: string;
  status?: string;
};

export type MerchantRechargeInfoVO = {
  amount?: number;
  id?: number;
  payChannel?: string;
  status?: string;
  time?: number | string;
};

export type MerchantCouponInfoVO = {
  couponName?: string;
  id?: number;
  sendCount?: number;
  status?: string;
  useCount?: number;
};

export type MerchantInfoAuditLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  remark?: string;
  time?: number | string;
};

export type MerchantInfoDetailVO = MerchantInfoVO & {
  accountLogs?: MerchantAccountLogVO[];
  auditLogs?: MerchantInfoAuditLogVO[];
  auditorInfo?: MerchantInfoOperatorVO | null;
  auditSummary?: string;
  couponRecords?: MerchantCouponInfoVO[];
  creatorId?: number;
  creatorInfo?: MerchantInfoOperatorVO | null;
  linkRecords?: MerchantLinkInfoVO[];
  rechargeRecords?: MerchantRechargeInfoVO[];
  updaterId?: number;
  updaterInfo?: MerchantInfoOperatorVO | null;
};

export type MerchantInfoChartReqVO = {
  timeRange?: string;
};

export type MerchantInfoChartVO = {
  merchantGrowthTrend: Array<{
    count: number;
    date: string;
  }>;
  merchantTypeDistribution: Array<{
    count: number;
    type: string;
  }>;
  newMerchantCount: number;
  totalMerchantCount: number;
};

// 商户信息 API
export const MerchantInfoApi = {
  getMerchantInfoPage: async (params: MerchantInfoPageReqVO) => {
    return await requestClient.get<PageResult<MerchantInfoVO>>(
      '/usermerchant/merchant-info/page',
      {
        params,
      },
    );
  },

  getMerchantInfo: async (id: number) => {
    return await requestClient.get<MerchantInfoDetailVO>(
      '/usermerchant/merchant-info/get',
      {
        params: { id },
      },
    );
  },

  createMerchantInfo: async (data: MerchantInfoCreateReqVO) => {
    return await requestClient.post('/usermerchant/merchant-info/create', data);
  },

  updateMerchantInfo: async (data: MerchantInfoUpdateReqVO) => {
    return await requestClient.put('/usermerchant/merchant-info/update', data);
  },

  importMerchantInfo: async (file: File) => {
    return await requestClient.upload('/usermerchant/merchant-info/import', {
      file,
    });
  },

  importMerchantInfoTemplate: async () => {
    return await requestClient.download(
      '/usermerchant/merchant-info/template',
      {
        responseReturn: 'raw',
      },
    );
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
      {
        params,
      },
    );
  },
};
