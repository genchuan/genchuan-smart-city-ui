import { requestClient } from '#/api/request';
/** 代理商支付规则分页 */
export function getAgentPayRulePage(params) {
  return requestClient.get('/ordertrade/agent-rule/page', {
    params,
  });
}
/** 代理商支付规则导出 */
export function exportAgentPayRule(params) {
  return requestClient.download('/ordertrade/agent-rule/export', {
    params,
  });
}
/** 代理商支付规则导入模板 */
export function importAgentPayRuleTemplate(data) {
  return requestClient.download('/ordertrade/agent-rule/import-template', data);
}
/** 代理商支付规则更新 */
export function updateAgentPayRule(data) {
  return requestClient.put('/ordertrade/agent-rule/update', data);
}
/** 代理商支付规则启用 */
export function enableAgentPayRule(data) {
  return requestClient.put('/ordertrade/agent-rule/enable', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: data,
  });
}
/** 代理商支付规则禁用 */
export function disableAgentPayRule(data) {
  return requestClient.put('/ordertrade/agent-rule/disable', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: data,
  });
}
/** 代理商支付规则删除 */
export function deleteAgentPayRule(params) {
  return requestClient.delete('/ordertrade/agent-rule/delete', {
    params,
  });
}
/** 代理商支付规则创建 */
export function createAgentPayRule(data) {
  return requestClient.post('/ordertrade/agent-rule/create', data);
}
/** 代理商支付规则图表 */
export function getAgentPayRuleChart() {
  return requestClient.get('/ordertrade/agent-rule/chart');
} 
/** 代理商支付规则导入 */ 
export function importAgentPayRule(file, updateSupport) {
  return requestClient.upload('/ordertrade/agent-rule/import', {
    file,
    updateSupport,
  });
}


/** 代理商支付代付码分页 */
export function getAgentPayCodePage(params) {
  return requestClient.get('/ordertrade/agent-code/page', {
    params,
  });
}
/** 代理商支付代付码刷新 */
export function refreshAgentPayCode(data) {
  return requestClient.put('/ordertrade/agent-code/refresh', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: data,
  });
}
/** 代理商支付代付码重新生成 */
export function regenerateAgentPayCode(data) {
  return requestClient.post('/ordertrade/agent-code/regenerate', null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    params: data,
  });
}
/** 代理商支付代付码更新 */
export function updateAgentPayCode(data) {
  return requestClient.put('/ordertrade/agent-code/update', data);
}
/** 代理商支付代付码生成 */
export function generateAgentPayCode(data) {
  return requestClient.post('/ordertrade/agent-code/generate', data);
}
/** 代理商支付代付码导出 */
export function exportAgentPayCode(params) {
  return requestClient.download('/ordertrade/agent-code/export', {
    params,
  });
}
/** 代理商支付代付码删除 */
export function deleteAgentPayCode(params) {
  return requestClient.delete('/ordertrade/agent-code/delete', {
    params,
  });
}
/** 代理商支付代付码创建 */
export function createAgentPayCode(data) {
  return requestClient.post('/ordertrade/agent-code/create', data);
}
/** 代理商支付代付码图表 */
export function getAgentPayCodeChart() {
  return requestClient.get('/ordertrade/agent-code/chart');
} 

/** 代付订单分页 */
export function getAgentPayOrderPage(params) {
  return requestClient.get('/ordertrade/agent-order/page', {
    params,
  });
}
/** 代付订单导出 */
export function exportAgentPayOrder(params) {
  return requestClient.download('/ordertrade/agent-order/export', {
    params,
  });
}

/** 代付订单支付 */
export function payAgentPayOrder(data) {
  return requestClient.put('/ordertrade/agent-order/pay', data);
}
/** 代付订单更新 */
export function updateAgentPayOrder(data) {
  return requestClient.put('/ordertrade/agent-order/update', data);
}

/** 代付订单发票 */
export function invoiceAgentPayOrder(data) {
  return requestClient.put('/ordertrade/agent-order/invoice', data);
}
/** 代付订单删除 */
export function deleteAgentPayOrder(params) {
  return requestClient.delete('/ordertrade/agent-order/delete', {
    params,
  });
}
/** 代付订单创建 */
export function createAgentPayOrder(data) {
  return requestClient.post('/ordertrade/agent-order/create', data);
}
/** 代付订单取消 */
export function cancelAgentPayOrder(data) {
  return requestClient.put('/ordertrade/agent-order/cancel', data);
}
/** 代付订单图表 */
export function getAgentPayOrderChart() {
  return requestClient.get('/ordertrade/agent-order/chart');
}
 

/** 代付记录分页 */
export function getAgentPayRecordPage(params) {
  return requestClient.get('/ordertrade/agent-record/page', {
    params,
  });
}
/** 代付记录更新 */
export function updateAgentPayRecord(data) {
  return requestClient.put('/ordertrade/agent-record/update', data);
}
/** 代付记录创建 */
export function createAgentPayRecord(data) {
  return requestClient.post('/ordertrade/agent-record/create', data);
}
/** 代付记录删除 */
export function deleteAgentPayRecord(params) {
  return requestClient.delete('/ordertrade/agent-record/delete', {
    params,
  });
}
/** 代付记录核算 */
export function checkAgentPayRecord(data) {
  return requestClient.put('/ordertrade/agent-record/check', data);
}
/** 代付记录导出 */
export function exportAgentPayRecord(params) {
  return requestClient.download('/ordertrade/agent-record/export', {
    params,
  });
}
/** 代付记录图表 */
export function getAgentPayRecordChart() {
  return requestClient.get('/ordertrade/agent-record/chart');
}
 
