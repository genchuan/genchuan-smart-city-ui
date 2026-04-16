import { requestClient } from '#/api/request';

/** 订单分页 */
export function getOrderPage(params) {
  return requestClient.get('/ordertrade/all-order/page', {
    params,
  });
}
  
/** excel导出 */
export function exportOrderExcel() {
  return requestClient.download('/ordertrade/all-order/export');
}

/** 订单支付 */
export function payOrder(data) {
  return requestClient.put('/ordertrade/all-order/pay', data);
}

/** 订单取消 */
export function cancelOrder(data) {
  return requestClient.put('/ordertrade/all-order/cancel', data);
} 

/** 订单退款 */
export function refundOrder(data) {
  return requestClient.put('/ordertrade/all-order/refund', data);
}  

/** 订单发票 */
export function invoiceOrder(data) {
  return requestClient.put('/ordertrade/all-order/invoice', data);
}
/** 订单图表 */
export function getOrderChart() {
  return requestClient.get('/ordertrade/all-order/chart');
}
