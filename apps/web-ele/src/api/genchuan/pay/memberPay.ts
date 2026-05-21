import { appRequestClient } from '#/api/request';

export namespace MemberPayApi {
  /** 创建订单请求参数 */
  export interface CreateOrderReqVO {
    items: Array<{
      count: number;
      skuId: number;
    }>;
    deliveryType: number;
    addressId: number;
    pointStatus: boolean;
  }

  /** 创建订单响应 */
  export interface CreateOrderRespVO {
    id: number;
    payOrderId: number;
  }

  /** 提交支付订单请求参数 */
  export interface SubmitOrderReqVO {
    id: number;
    channelCode: string;
    channelExtras: Record<string, any>;
  }

  /** 提交支付订单响应 */
  export interface SubmitOrderRespVO {
    status: number;
    displayMode: string;
    displayContent: string;
  }
}

/** 创建会员升级订单 */
export function createMemberOrder() {
  const data: MemberPayApi.CreateOrderReqVO = {
    items: [
      {
        skuId: 43,
        count: 1,
      },
    ],
    deliveryType: 1,
    addressId: 34,
    pointStatus: false,
  };

  return appRequestClient.post<MemberPayApi.CreateOrderRespVO>(
    '/trade/order/create',
    data,
    {
      headers: {
        'tenant-id': 165,
        Authorization: 'Bearer test1',
      },
    },
  );
}

/** 提交支付订单（获取二维码） */
export function submitMemberOrder(payOrderId: number) {
  const data: MemberPayApi.SubmitOrderReqVO = {
    id: payOrderId,
    channelCode: 'wx_native',
    channelExtras: {},
  };

  return appRequestClient.post<MemberPayApi.SubmitOrderRespVO>(
    '/pay/order/submit',
    data,
    {
      headers: {
        'tenant-id': 165,
        Authorization: 'Bearer test1',
      },
    },
  );
}
