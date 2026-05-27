import { appRequestClient } from '#/api/request';
import { useUserStore } from '@vben/stores';

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
    userId: number;
    userType: number;
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
        Authorization: 'Bearer test1',
      },
    },
  );
}

/** 提交支付订单（获取二维码） */
export function submitMemberOrder(payOrderId: number) {
  const userStore = useUserStore();
  const userId = Number(userStore.userInfo?.id) || 0;
  const data: MemberPayApi.SubmitOrderReqVO = {
    id: payOrderId,
    channelCode: 'wx_native',
    channelExtras: {},
    userId,
    userType: 1,
  };

  return appRequestClient.post<MemberPayApi.SubmitOrderRespVO>(
    '/pay/order/submit',
    data,
    {
      headers: {
        Authorization: 'Bearer test1',
      },
    },
  );
}
