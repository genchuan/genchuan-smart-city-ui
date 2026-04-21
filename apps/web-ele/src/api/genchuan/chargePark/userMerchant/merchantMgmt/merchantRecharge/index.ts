import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户充值 VO
export type MerchantRechargeVO = {
  id?: number;
  merchantId: number;
  amount: number;
  payChannel: string;
  status: string;
  orderNo?: string;
  payTime?: string | null;
  confirmTime?: string | null;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 商户充值分页请求
export type MerchantRechargePageReqVO = PageParam & {
  merchantId?: number;
  amount?: number;
  payChannel?: string;
  status?: string;
  orderNo?: string;
  payTime?: string;
  confirmTime?: string;
  remark?: string;
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
  rechargeAmountTrend: Array<{
    date: string;
    amount: number;
  }>;
  rechargeAmount: number;
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
    return await requestClient.get<MerchantRechargeVO>(
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
