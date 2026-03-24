import { requestClient } from '#/api/request.js';

/** 规则分类分页查询（全部/启用/停用） */
export function getRuleCategoryAllPage(params) {
  return requestClient.get('/evaluate/rule-category/allpage', { params });
}

// 获取状态统计数据（用于 tabs 计数）
export async function getRuleStatusCount() {
  try {
    const allRes = await getRuleCategoryAllPage({ pageNo: 1, pageSize: 1 });
    const enableRes = await getRuleCategoryAllPage({ pageNo: 1, pageSize: 1, statusId: 1 });
    const disableRes = await getRuleCategoryAllPage({ pageNo: 1, pageSize: 1, statusId: 2 });
    return {
      totalCount: allRes.total || 0,
      status1Count: enableRes.total || 0,
      status2Count: disableRes.total || 0,
    };
  } catch (error) {
    console.error('获取状态统计失败', error);
    return { totalCount: 0, status1Count: 0, status2Count: 0 };
  }
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

/**获取规则分类统计数据（卡片、饼图、柱状图）*/
export function getRuleStatistics() {
  return requestClient.get('/evaluate/rule-category/statistics');
}

/** 导出 Excel（后端生成） */
export function exportRuleCategory(params) {
  return requestClient.get('/evaluate/rule-category/export-excel', {
    params,
    responseType: 'blob',
  });
}

// ---------- 下拉列表接口（全部数据，用于表单）----------

/** 获取指标体系下拉列表（全部） */
export async function getIndexSystemSimpleList() {
  const res = await requestClient.get('/evaluate/index-system/page', {
    params: { pageNo: 1, pageSize: 200 },
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: Number(item.id),
  }));
}

/** 获取适用对象类型下拉列表（全部） */
export async function getObjectTypeSimpleList() {
  const res = await requestClient.get('/evaluate/object-type/page', {
    params: { pageNo: 1, pageSize: 200 },
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: item.typeId,
  })); // 若后端要求数字，改为 Number(item.typeId)
}

/** 获取指标项下拉列表（全部），支持传入查询参数（如 systemId） */
export async function getIndexItemSimpleList(params = {}) {
  const mergedParams = { pageNo: 1, pageSize: 200, ...params };
  const res = await requestClient.get('/evaluate/index-item/page', {
    params: mergedParams,
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: Number(item.id),
  }));
}

/** 获取规则类型下拉列表（全部） */
export async function getRuleTypeList() {
  const res = await requestClient.get('/evaluate/rule-type/page', {
    params: { pageNo: 1, pageSize: 200 },
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: item.typeId,
  }));
}

/** 获取状态下拉列表（全部） */
export async function getStatusSimpleList() {
  const res = await requestClient.get('/evaluate/status/page', {
    params: { pageNo: 1, pageSize: 200 },
  });
  return (res.list || []).map((item) => ({
    label: item.name,
    value: Number(item.statusId),
  }));
}
