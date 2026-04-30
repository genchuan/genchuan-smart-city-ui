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
 
/** 汽车充电订单分页 */
export function getCarChargeOrderPage(params) {
  return requestClient.get('/ordertrade/car-charge-order/page', {
    params,
  });
}
/** 汽车充电订单导出 */
export function exportCarChargeOrderExcel() {
  return requestClient.download('/ordertrade/car-charge-order/export');
}
/** 汽车充电订单停止 */
export function stopCarChargeOrder(data) {
  return requestClient.put('/ordertrade/car-charge-order/stop', data);
}
/** 汽车充电订单支付 */
export function payCarChargeOrder(data) {
  return requestClient.put('/ordertrade/car-charge-order/pay', data);
}   

/** 汽车充电订单取消 */
export function cancelCarChargeOrder(data) {
  return requestClient.put('/ordertrade/car-charge-order/cancel', data);
}
/** 汽车充电订单退款 */
export function refundCarChargeOrder(data) {
  return requestClient.put('/ordertrade/car-charge-order/refund', data);
}
/** 汽车充电订单发票 */
export function invoiceCarChargeOrder(data) {
  return requestClient.put('/ordertrade/car-charge-order/invoice', data);
}

/** 汽车充电订单图表 */
export function getCarChargeOrderChart() {
  return requestClient.get('/ordertrade/car-charge-order/chart');
}
/** 两轮充电订单分页 */
export function getBikeChargeOrderPage(params) {
  return requestClient.get('/ordertrade/bike-charge-order/page', {
    params,
  });
}
/** 两轮充电订单导出 */
export function exportBikeChargeOrderExcel() {
  return requestClient.download('/ordertrade/bike-charge-order/export');
}
/** 两轮充电订单停止 */
export function stopBikeChargeOrder(data) {
  return requestClient.put('/ordertrade/bike-charge-order/stop', data);
}
/** 两轮充电订单支付 */
export function payBikeChargeOrder(data) {
  return requestClient.put('/ordertrade/bike-charge-order/pay', data);
}
/** 两轮充电订单取消 */
export function cancelBikeChargeOrder(data) {
  return requestClient.put('/ordertrade/bike-charge-order/cancel', data);
}
/** 两轮充电订单退款 */
export function refundBikeChargeOrder(data) {
  return requestClient.put('/ordertrade/bike-charge-order/refund', data);
}
/** 两轮充电订单发票 */
export function invoiceBikeChargeOrder(data) {
  return requestClient.put('/ordertrade/bike-charge-order/invoice', data);
}
/** 两轮充电订单图表 */
export function getBikeChargeOrderChart() {
  return requestClient.get('/ordertrade/bike-charge-order/chart');
}
/** 分享充电订单分页 */
export function getShareChargeOrderPage(params) {
  return requestClient.get('/ordertrade/share-charge-order/page', {
    params,
  });
}
/** 分享充电订单导出 */
export function exportShareChargeOrderExcel() {
  return requestClient.download('/ordertrade/share-charge-order/export');
}
/** 分享充电订单归还 */
export function returnShareChargeOrder(data) {
  return requestClient.put('/ordertrade/share-charge-order/return', data);
}
/** 分享充电订单退款 */
export function refundShareChargeOrder(data) {
  return requestClient.put('/ordertrade/share-charge-order/refund', data);
}
/** 分享充电订单支付 */
export function payShareChargeOrder(data) {
  return requestClient.put('/ordertrade/share-charge-order/pay', data);
}
/** 分享充电订单发票 */
export function invoiceShareChargeOrder(data) {
  return requestClient.put('/ordertrade/share-charge-order/invoice', data);
}
/** 分享充电订单取消 */
export function cancelShareChargeOrder(data) {
  return requestClient.put('/ordertrade/share-charge-order/cancel', data);
}
/** 分享充电订单图表 */
export function getShareChargeOrderChart() {
  return requestClient.get('/ordertrade/share-charge-order/chart');
}
/** 异常订单分页 */
export function getAbnormalOrderPage(params) {
  return requestClient.get('/ordertrade/abnormal-order/page', {
    params,
  });
}
/** 异常订单导出 */
export function exportAbnormalOrderExcel() {
  return requestClient.download('/ordertrade/abnormal-order/export');
}
/** 异常订单更新进度 */
export function updateAbnormalOrderProgress(data) {
  return requestClient.put('/ordertrade/abnormal-order/update-progress', data);
}
/** 异常订单忽略 */
export function ignoreAbnormalOrder(data) {
  return requestClient.put('/ordertrade/abnormal-order/ignore', data);
}
/** 异常订单检查 */
export function checkAbnormalOrder(data) {
  return requestClient.put('/ordertrade/abnormal-order/check', data);
}
/** 异常订单图表 */
export function getAbnormalOrderChart() {
  return requestClient.get('/ordertrade/abnormal-order/chart');
}
/** 异常订单批量处理 */
export function batchHandleAbnormalOrder(data) {
  return requestClient.post('/ordertrade/abnormal-order/batch-handle', data);
}
 

/** 获取车牌详情 */
export function getPlateIdentifyPage(params) {
  return requestClient.get('/vehiclepass/plate-identify/page', {
    params,
  });
}
