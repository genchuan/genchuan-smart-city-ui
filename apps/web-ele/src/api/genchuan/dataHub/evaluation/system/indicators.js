import { requestClient } from '#/api/request';

/** 分页查询（全部/启用/停用） */
export function getAllPage(params) {
  return requestClient.get('/evaluate/index-system/allpage', { params });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getStatusCount() {
  return requestClient.get('/evaluate/index-system/status-count');
}

/** 创建指标体系（仅基本信息） */
export function createIndexSystem(data) {
  return requestClient.post('/evaluate/index-system/create', data);
}

/** 更新指标体系（仅基本信息） */
export function updateIndexSystem(data) {
  return requestClient.put('/evaluate/index-system/update', data);
}

/** 删除指标体系 */
export function deleteIndexSystem(id) {
  return requestClient.delete(`/evaluate/index-system/delete?id=${id}`);
}

/** 查询指标体系详情（树形结构） */
export function getIndexSystemDetail(systemId) {
  return requestClient.get(`evaluate/index-system/detail/${systemId}`);
}

/** 获取指标体系概览数据（用于图表） */
export function getOverview() {
  return requestClient.get('/evaluate/index-system/overview');
}

/** 导出 Excel（后端生成） */
export function exportIndexSystem(params) {
  return requestClient.get('/evaluate/index-system/export-excel', {
    params,
    responseType: 'blob',
  });
}

// ========== 字典接口（返回下拉选项格式） ==========
/** 获取指标类型列表（字典），返回 { value, label }[] */
export async function getIndexTypeList() {
  const res = await requestClient.get('/evaluate/index-type/page', {
    params: { pageNo: 1, pageSize: 100 },
  });
  // 根据实际响应结构调整提取路径：常见格式为 res.data.list 或 res.list
  const list = res.data?.list || res.list || [];
  return list.map(item => ({
    value: item.typeId || item.id,  // 字段名请按后端实际返回调整
    label: item.name,
  }));
}

/** 获取计算方式列表（字典），返回 { value, label }[] */
export async function getCalcWayList() {
  const res = await requestClient.get('/evaluate/calc-way/page', {
    params: { pageNo: 1, pageSize: 100 },
  });
  const list = res.data?.list || res.list || [];
  return list.map(item => ({
    value: item.wayId || item.id,
    label: item.name,
  }));
}

// ========== 完整保存接口（若后端支持） ==========
/** 保存完整的指标体系（包含分类与指标项） */
export function saveFullIndexSystem(data) {
  return requestClient.post('/evaluate/index-system/save-full', data);
}

/** 获取对象类型列表（返回下拉选项格式） */
export function getObjectTypeSimpleList() {
  // 假设后端直接返回 [{ value: 'obj_type_001', label: '政府部门' }, ...]
  return requestClient.get('/evaluate/object-type/simple-list');
}

/** 获取状态列表（返回下拉选项格式） */
export function getStatusSimpleList() {
  // 调用分页接口并转换为下拉选项格式
  return requestClient.get('/evaluate/status/page', { params: { pageNo: 1, pageSize: 100 } }).then(res => {
    const list = res.list || res.data?.list || [];
    return list.map(item => ({
      value: item.statusId, // 字段名可能为 id、statusId 等，请按实际情况调整
      label: item.name,
    }));
  });
}
