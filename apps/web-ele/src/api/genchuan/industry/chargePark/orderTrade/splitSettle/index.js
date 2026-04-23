import { requestClient } from '#/api/request';
 

/** 结算单据分页 */
export function getSettleBillPage(params) {
  return requestClient.get('/ordertrade/settle-bill/page', {
    params,
  });
}
/** 结算单据导出 */
export function exportSettleBillExcel() {
  return requestClient.download('/ordertrade/settle-bill/export');
}
/** 结算单据图表 */
export function getSettleBillChart(params) {
  return requestClient.get('/ordertrade/settle-bill/chart', {
    params,
  });
} 
/** 结算单据更新 */
export function updateSettleBill(data) {
  return requestClient.put('/ordertrade/settle-bill/update', data);
}
/** 结算单据删除 */
export function deleteSettleBill(params) {
  return requestClient.delete('/ordertrade/settle-bill/delete', {params});
}
/** 结算单据创建 */
export function createSettleBill(data) {
  return requestClient.post('/ordertrade/settle-bill/create', data);
}
/** 结算单据重新生成 */
export function regenerateSettleBill(data) {
  return requestClient.put('/ordertrade/settle-bill/regenerate', data);
}
/** 结算单据结算 */
export function settleSettleBill(data) {
  return requestClient.put('/ordertrade/settle-bill/settle', data);
}
/** 结算单据审核驳回 */
export function rejectSettleBill(data) {
  return requestClient.post('/ordertrade/settle-bill/audit-reject', data);
}
/** 结算单据审核通过 */
export function passSettleBill(data) {
  return requestClient.post('/ordertrade/settle-bill/audit-pass', data);
}


/** 分账结算分页 */
export function getSplitRatePage(params) {
  return requestClient.get('/ordertrade/split-rate/page', {
    params,
  });
}
/** 分账结算导出 */
export function exportSplitRateExcel() {
  return requestClient.download('/ordertrade/split-rate/export');
}
/** 分账结算更新 */
export function updateSplitRate(data) {
  return requestClient.put('/ordertrade/split-rate/update', data);
}

/** 分账结算删除 */
export function deleteSplitRate(params) {
  return requestClient.delete('/ordertrade/split-rate/delete', {params});
}
/** 分账结算创建 */
export function createSplitRate(data) {
  return requestClient.post('/ordertrade/split-rate/create', data);
}
/** 分账结算启用 */
export function enableSplitRate(data) { 
   return requestClient.put('/ordertrade/split-rate/enable', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: data,
      });
}
/** 分账结算禁用 */
export function disableSplitRate(data) { 
    return requestClient.put('/ordertrade/split-rate/disable', null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: data,
      });
}
/** 分账结算图表 */
export function getSplitRateChart(params) {
  return requestClient.get('/ordertrade/split-rate/chart', {
    params,
  });
}

/** 分账结算状态分页 */
export function getSplitRateStatusPage(params) {
  return requestClient.get('/ordertrade/settle-status/page', {
    params,
  });
}
/** 分账结算状态导出 */
export function exportSplitRateStatusExcel() {
  return requestClient.download('/ordertrade/settle-status/export');
}
/** 分账结算状态更新 */
export function updateSplitRateStatus(data) {
  return requestClient.put('/ordertrade/settle-status/update', data);
}
/** 分账结算状态创建 */
export function createSplitRateStatus(data) {
  return requestClient.post('/ordertrade/settle-status/create', data);
} 
/** 分账结算状态删除 */
export function deleteSplitRateStatus(params) {
  return requestClient.delete('/ordertrade/settle-status/delete', {params});
}
/** 分账结算状态审核 */
export function checkSplitRateStatus(data) {
  return requestClient.put('/ordertrade/settle-status/check', data);
}
/** 分账结算状态图表 */
export function getSplitRateStatusChart(params) {
  return requestClient.get('/ordertrade/settle-status/chart', {
    params,
  });
}
