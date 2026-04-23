import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

// 商户发券 VO
export type MerchantSendCouponVO = {
  couponId: number;
  couponName?: string;
  createTime?: number | string;
  creator?: string;
  execTime?: null | number | string;
  finishTime?: null | number | string;
  id?: number;
  merchantId: number;
  remark?: string;
  reserve1?: null | string;
  reserve2?: null | string;
  sendCount: number;
  status?: string;
  updateTime?: number | string;
  useCount?: number;
};

export type MerchantSendCouponSendReqVO = {
  couponId: number;
  execTime?: string;
  merchantId: number;
  remark?: string;
  sendCount: number;
};

export type MerchantSendCouponOperateReqVO = {
  ids: number[];
};

export type MerchantSendCouponMerchantVO = {
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

export type MerchantSendCouponCouponVO = {
  id?: number;
  name?: string;
  remark?: string;
  rule?: string;
  status?: string;
  type?: string;
  validPeriod?: string;
};

export type MerchantSendCouponRedemptionVO = {
  count?: number;
  id?: number;
  orderNo?: string;
  plateNo?: string;
  remark?: string;
  time?: number | string;
  type?: string;
  userName?: string;
};

export type MerchantSendCouponLogVO = {
  content?: string;
  id?: number;
  operator?: string;
  time?: number | string;
};

export type MerchantSendCouponDetailVO = MerchantSendCouponVO & {
  couponInfo?: MerchantSendCouponCouponVO | null;
  logs?: MerchantSendCouponLogVO[];
  merchantInfo?: MerchantSendCouponMerchantVO | null;
  redemptions?: MerchantSendCouponRedemptionVO[];
};

// 商户发券分页请求
export type MerchantSendCouponPageReqVO = PageParam & {
  couponId?: number;
  couponName?: string;
  execTime?: string;
  finishTime?: string;
  merchantId?: number;
  remark?: string;
  sendCount?: number | string;
  status?: string;
  useCount?: number | string;
};

export type MerchantSendCouponChartReqVO = {
  timeRange?: string;
};

export type MerchantSendCouponChartVO = {
  sendCount: number;
  sendCountTrend: Array<{
    count: number;
    date: string;
  }>;
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
    return await requestClient.get<MerchantSendCouponDetailVO>(
      '/usermerchant/merchant-send-coupon/get',
      {
        params: { id },
      },
    );
  },

  sendMerchantCoupon: async (data: MerchantSendCouponSendReqVO) => {
    return await requestClient.post(
      '/usermerchant/merchant-send-coupon/send',
      data,
    );
  },

  exportMerchantSendCoupon: async (params: MerchantSendCouponPageReqVO) => {
    return await requestClient.download(
      '/usermerchant/merchant-send-coupon/export',
      {
        params,
      },
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
