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
  return requestClient.put('/ordertrade/agent-code/regenerate', null, {
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