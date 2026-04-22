import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户充值 VO
export type MerchantRechargeVO = {
  amount: number;
  confirmTime?: null | number | string;
  createTime?: number | string;
  creator?: string;
  id?: number;
  merchantId: number;
  orderNo?: string;
  payChannel: string;
  payTime?: null | number | string;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  status: string;
  updateTime?: number | string;
};

export type MerchantRechargeMerchantVO = {
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

export type MerchantRechargeLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  time?: number | string;
};

export type MerchantRechargeDetailVO = MerchantRechargeVO & {
  logs?: MerchantRechargeLogVO[];
  merchantInfo?: MerchantRechargeMerchantVO | null;
};

// 商户充值分页请求
export type MerchantRechargePageReqVO = PageParam & {
  amount?: number | string;
  confirmTime?: string;
  merchantId?: number;
  orderNo?: string;
  payChannel?: string;
  payTime?: string;
  remark?: string;
  status?: string;
};

export type MerchantRechargePayReqVO = {
  ids: number[];
  payChannel: string;
};

export type MerchantRechargeOperateReqVO = {
  ids: number[];
};

export type MerchantRechargeChartReqVO = {
  timeRange?: string;
};

export type MerchantRechargeChartVO = {
  rechargeAmount: number;
  rechargeAmountTrend: Array<{
    amount: number;
    date: string;
  }>;
  rechargeSuccessRate: number;
};

// 商户充值 API
export const MerchantRechargeApi = {
  getMerchantRechargePage: async (params: MerchantRechargePageReqVO) => {
    return await requestClient.get<PageResult<MerchantRechargeVO>>(
      '/usermerchant/merchant-recharge/page',
      { params },
    );
  },

  getMerchantRecharge: async (id: number) => {
    return await requestClient.get<MerchantRechargeDetailVO>(
      '/usermerchant/merchant-recharge/get',
      {
        params: { id },
      },
    );
  },

  exportMerchantRecharge: async (params: MerchantRechargePageReqVO) => {
    return await requestClient.download(
      '/usermerchant/merchant-recharge/export',
      {
        params,
      },
    );
  },

  payMerchantRecharge: async (data: MerchantRechargePayReqVO) => {
    return await requestClient.put('/usermerchant/merchant-recharge/pay', data);
  },

  confirmMerchantRecharge: async (data: MerchantRechargeOperateReqVO) => {
    return await requestClient.put(
      '/usermerchant/merchant-recharge/confirm',
      data,
    );
  },

  cancelMerchantRecharge: async (data: MerchantRechargeOperateReqVO) => {
    return await requestClient.put(
      '/usermerchant/merchant-recharge/cancel',
      data,
    );
  },

  getMerchantRechargeChart: async (params?: MerchantRechargeChartReqVO) => {
    return await requestClient.get<MerchantRechargeChartVO>(
      '/usermerchant/merchant-recharge/chart',
      { params },
    );
  },
};
