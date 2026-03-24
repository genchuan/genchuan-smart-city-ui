import { requestClient } from '#/api/request.js';

/** 规则分类分页查询（全部/启用/停用） */
export function getRuleCategoryAllPage(params) {
  return requestClient.get('/evaluate/rule-category/allpage', { params });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getRuleStatusCount() {
  return requestClient.get('/evaluate/rule-category/status-count');
}

/** 创建规则分类（仅基本信息） */
export function createRuleCategory(data) {
  return requestClient.post('/evaluate/rule-category/create', data);
}

/** 更新规则分类（仅基本信息） */
export function updateRuleCategory(data) {
  return requestClient.put('/evaluate/rule-category/update', data);
}

/** 删除规则分类 */
export function deleteRuleCategory(id) {
  return requestClient.delete(`/evaluate/rule-category/delete?id=${id}`);
}

/** 获取规则分类详情（包含规则项列表） */
export function getRuleCategoryDetail(id) {
  return requestClient.get(`/evaluate/rule-category/get?id=${id}`);
}

/** 获取规则概览数据（用于图表） */
export function getRuleOverview() {
  return requestClient.get('/evaluate/rule-category/overview');
}

/** 导出 Excel（后端生成） */
export function exportRuleCategory(params) {
  return requestClient.get('/evaluate/rule-category/export-excel', {
    params,
    responseType: 'blob',
  });
}

/** 完整保存规则分类（含评分规则和明细） */
export function saveFullRuleCategory(data) {
  return requestClient.post('/evaluate/rule-category/save-full', data);
}

// ---------- 下拉列表接口（全部数据，用于表单）----------

/** 获取指标体系下拉列表（全部） */
export async function getIndexSystemSimpleList() {
  const res = await requestClient.get('/evaluate/index-system/page', {
    params: { pageNo: 1, pageSize: 200 }
  });
  return (res.list || []).map(item => ({ label: item.name, value: Number(item.id) }));
}

/** 获取适用对象类型下拉列表（全部） */
export async function getObjectTypeSimpleList() {
  const res = await requestClient.get('/evaluate/object-type/page', {
    params: { pageNo: 1, pageSize: 200 }
  });
  return (res.list || []).map(item => ({ label: item.name, value: item.typeId })); // 若后端要求数字，改为 Number(item.typeId)
}

/** 获取指标项下拉列表（全部），支持传入查询参数（如 systemId） */
export async function getIndexItemSimpleList(params = {}) {
  const mergedParams = { pageNo: 1, pageSize: 200, ...params };
  const res = await requestClient.get('/evaluate/index-item/page', { params: mergedParams });
  return (res.list || []).map(item => ({ label: item.name, value: Number(item.id) }));
}

/** 获取规则类型下拉列表（全部） */
export async function getRuleTypeList() {
  const res = await requestClient.get('/evaluate/rule-type/page', {
    params: { pageNo: 1, pageSize: 200 }
  });
  return (res.list || []).map(item => ({ label: item.name, value: Number(item.typeId) }));
}

/** 获取状态下拉列表（全部） */
export async function getStatusSimpleList() {
  const res = await requestClient.get('/evaluate/status/page', {
    params: { pageNo: 1, pageSize: 200 }
  });
  return (res.list || []).map(item => ({ label: item.name, value: Number(item.statusId) }));
}
