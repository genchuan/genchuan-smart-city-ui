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


/** 临时停车订单分页 */
export function getTempParkOrderPage(params) {
  return requestClient.get('/ordertrade/temp-park-order/page', {
    params,
  });
}
/** 临时停车订单导出 */
export function exportTempParkOrderExcel() {
  return requestClient.download('/ordertrade/temp-park-order/export');
}
/** 临时停车订单发票 */
export function invoiceTempParkOrder(data) {
  return requestClient.put('/ordertrade/temp-park-order/invoice', data);
}
/** 临时停车订单退款 */
export function refundTempParkOrder(data) {
  return requestClient.put('/ordertrade/temp-park-order/refund', data);
}

/** 临时停车订单支付 */
export function payTempParkOrder(data) {
  return requestClient.put('/ordertrade/temp-park-order/pay', data);
}

/** 临时停车订单取消 */
export function cancelTempParkOrder(data) {
  return requestClient.put('/ordertrade/temp-park-order/cancel', data);
}
/** 临时停车订单图表 */
export function getTempParkOrderChart() {
  return requestClient.get('/ordertrade/temp-park-order/chart');
}
/** 错时停车订单分页 */
export function getOfftimeParkOrderPage(params) {
  return requestClient.get('/ordertrade/offtime-park-order/page', {
    params,
  });
}
/** 错时停车订单导出 */
export function exportOfftimeParkOrderExcel() {
  return requestClient.download('/ordertrade/offtime-park-order/export');
}
/** 错时停车订单发票 */
export function invoiceOfftimeParkOrder(data) {
  return requestClient.put('/ordertrade/offtime-park-order/page', {
    params,
  });
}
/** 错时停车订单退款 */
export function refundOfftimeParkOrder(data) {
  return requestClient.put('/ordertrade/offtime-park-order/refund', data);
}
/** 错时停车订单支付 */
export function payOfftimeParkOrder(data) {
  return requestClient.put('/ordertrade/offtime-park-order/pay', data);
}
/** 错时停车订单取消 */
export function cancelOfftimeParkOrder(data) {
  return requestClient.put('/ordertrade/offtime-park-order/cancel', data);
}
/** 错时停车订单发票 */
export function invoiceOfftimNewParkOrder(data) {
  return requestClient.put('/ordertrade/offtime-park-order/invoice', data);
}
/** 错时停车订单图表 */
export function getOfftimeParkOrderChart() {
  return requestClient.get('/ordertrade/offtime-park-order/chart');
}
 
