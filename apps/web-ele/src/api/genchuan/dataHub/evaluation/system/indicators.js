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

/** 权重校验 */
export function checkWeight(data) {
  return requestClient.post('/evaluate/index-system/check-weight', data);
}

// ========== 新增：字典接口 ==========
/** 获取指标类型列表（字典） */
export function getIndexTypeList() {
  return requestClient.get('/evaluate/index-type/page');
}

/** 获取计算方式列表（字典） */
export function getCalcWayList() {
  return requestClient.get('/evaluate/calc-way/page');
}

// ========== 新增：完整保存接口（若后端支持） ==========
/** 保存完整的指标体系（包含分类与指标项） */
export function saveFullIndexSystem(data) {
  // 若后端有复合接口则使用，否则请使用分步保存（下方注释示例）
  return requestClient.post('/evaluate/index-system/save-full', data);
}



/** 获取对象类型列表（返回下拉选项格式） */
export function getObjectTypeSimpleList() {
  // 假设返回格式为 [{ value: 'obj_type_001', label: '政府部门' }, ...]
  return requestClient.get('/evaluate/object-type/simple-list');
}

/** 获取状态列表（返回下拉选项格式） */
export function getStatusSimpleList() {
  // 调用分页接口并转换为下拉选项格式
  return requestClient.get('/evaluate/status/page', { params: { pageNo: 1, pageSize: 100 } }).then(res => {
    // 转换为下拉选项格式
    return (res.list || []).map(item => ({
      value: item.statusId,
      label: item.name
    }));
  });
}
