import { requestClient } from '#/api/request';
 

/** 支付应用分页 */
export function getPayAppPage(params) {
  return requestClient.get('/ordertrade/pay-app/page', {
    params,
  });
}

/** 支付应用更新 */
export function updatePayApp(data) {
  return requestClient.put('/ordertrade/pay-app/update', data);
}
/** 支付应用导出 */
export function exportPayAppExcel() {
  return requestClient.download('/ordertrade/pay-app/export');
}
/** 支付应用启用 */
export function enablePayApp(data) {
  return requestClient.put('/ordertrade/pay-app/enable', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: data,
    });
}
/** 支付应用禁用 */
export function disablePayApp(data) {
  return requestClient.put('/ordertrade/pay-app/disable', null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      params: data,
    });
}
/** 支付应用删除 */
export function deletePayApp(params) {
  return requestClient.delete('/ordertrade/pay-app/delete', {
    params,
  });
}
/** 支付应用创建 */
export function createPayApp(data) {
  return requestClient.post('/ordertrade/pay-app/create', data);
}
/** 支付应用图表 */
export function getPayAppChart(params) {
  return requestClient.get('/ordertrade/pay-app/chart', {
    params,
  });
}


/** 支付订单分页 */
export function getPayOrderPage(params) {
  return requestClient.get('/ordertrade/pay-order/page', {
    params,
  });
}
/** 支付订单支付 */
export function payOrder(data) {
  return requestClient.put('/ordertrade/pay-order/pay', data);
}
/** 支付订单退款 */
export function refundOrder(data) {
  return requestClient.put('/ordertrade/pay-order/refund', data);
}
/** 支付订单导出 */
export function exportPayOrderExcel() {
  return requestClient.download('/ordertrade/pay-order/export');
} 

/** 支付订单取消 */
export function cancelOrder(data) {
  return requestClient.put('/ordertrade/pay-order/cancel', data);
}
/** 支付订单图表 */
export function getPayOrderChart(params) {
  return requestClient.get('/ordertrade/pay-order/chart', {
    params,
  });
}

/** 支付订单退款分页 */
export function getPayRefundPage(params) {
  return requestClient.get('/ordertrade/pay-refund/page', {
    params,
  });
}
/** 支付订单退款导出 */
export function exportPayRefundExcel() {
  return requestClient.download('/ordertrade/pay-refund/export');
}
/** 支付订单退款执行 */
export function executePayRefund(data) {
  return requestClient.put('/ordertrade/pay-refund/execute', data);
}
/** 支付订单退款取消 */
export function cancelPayRefund(data) {
  return requestClient.put('/ordertrade/pay-refund/cancel', data);
}

/** 支付订单退款图表 */
export function getPayRefundChart(params) {
  return requestClient.get('/ordertrade/pay-refund/chart', {
    params,
  });
}


/** 支付订单退款分页 */
export function getPayTransferPage(params) {
  return requestClient.get('/ordertrade/pay-transfer/page', {
    params,
  });
}
/** 支付订单退款导出 */
export function exportPayTransferExcel() {
  return requestClient.download('/ordertrade/pay-transfer/export');
}
/** 支付订单退款执行 */
export function executePayTransfer(data) {
  return requestClient.put('/ordertrade/pay-transfer/execute', data);
}
/** 支付订单退款取消 */
export function cancelPayTransfer(data) {
  return requestClient.put('/ordertrade/pay-transfer/cancel', data);
}
/** 支付订单退款图表 */
export function getPayTransferChart(params) {
  return requestClient.get('/ordertrade/pay-transfer/chart', {
    params,
  });
}
