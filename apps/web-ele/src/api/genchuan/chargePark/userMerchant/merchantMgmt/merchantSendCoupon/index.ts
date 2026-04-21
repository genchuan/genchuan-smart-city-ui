import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户发券 VO
export type MerchantSendCouponVO = {
  id?: number;
  merchantId: number;
  couponId: number;
  couponName?: string;
  sendCount: number;
  execTime?: string;
  finishTime?: string | null;
  useCount?: number;
  status?: string;
  remark?: string;
  reserve1?: string | null;
  reserve2?: string | null;
  creator?: string;
  createTime?: string;
  updateTime?: string;
};

// 商户发券分页请求
export type MerchantSendCouponPageReqVO = PageParam & {
  merchantId?: number;
  couponId?: number;
  couponName?: string;
  sendCount?: number;
  execTime?: string;
  finishTime?: string;
  useCount?: number;
  status?: string;
  remark?: string;
};

export type MerchantSendCouponOperateReqVO = {
  ids: number[];
};

export type MerchantSendCouponChartReqVO = {
  timeRange?: string;
};

export type MerchantSendCouponChartVO = {
  sendCountTrend: Array<{
    date: string;
    count: number;
  }>;
  sendCount: number;
  useRate: number;
};

// 商户发券 API
export const MerchantSendCouponApi = {
  getMerchantSendCouponPage: async (params: MerchantSendCouponPageReqVO) => {
    return await requestClient.get<PageResult<MerchantSendCouponVO>>(
      '/usermerchant/merchant-send-coupon/page',
      { params },
    );
  },

  getMerchantSendCoupon: async (id: number) => {
    return await requestClient.get<MerchantSendCouponVO>(
      '/usermerchant/merchant-send-coupon/get',
      {
        params: { id },
      },
    );
  },

  sendMerchantCoupon: async (data: MerchantSendCouponVO) => {
    return await requestClient.post(
      '/usermerchant/merchant-send-coupon/send',
      data,
    );
  },

  exportMerchantSendCoupon: async (params: MerchantSendCouponPageReqVO) => {
    return await requestClient.download(
      '/usermerchant/merchant-send-coupon/export',
      { params },
    );
  },

  executeMerchantSendCoupon: async (data: MerchantSendCouponOperateReqVO) => {
    return await requestClient.put(
      '/usermerchant/merchant-send-coupon/execute',
      data,
    );
  },

  cancelMerchantSendCoupon: async (data: MerchantSendCouponOperateReqVO) => {
    return await requestClient.put(
      '/usermerchant/merchant-send-coupon/cancel',
      data,
    );
  },

  getMerchantSendCouponChart: async (params?: MerchantSendCouponChartReqVO) => {
    return await requestClient.get<MerchantSendCouponChartVO>(
      '/usermerchant/merchant-send-coupon/chart',
      { params },
    );
  },
};
