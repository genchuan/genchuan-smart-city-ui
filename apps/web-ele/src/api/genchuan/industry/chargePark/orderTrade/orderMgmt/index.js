import { requestClient } from '#/api/request';

/** 订单分页 */
export function getOrderPage(params) {
  return requestClient.get('/ordertrade/all-order/page', {
    params,
  });
}
 