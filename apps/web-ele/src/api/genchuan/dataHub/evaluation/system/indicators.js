import { requestClient } from '#/api/request';

/** 分页查询（全部/启用/停用） */
export function getAllPage(params) {
  return requestClient.get('/evaluate/index-system/allpage', { params });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getStatusCount() {
  return requestClient.get('/evaluate/index-system/status-count');
}

/** 创建指标体系 */
export function createIndexSystem(data) {
  return requestClient.post('/evaluate/index-system/create', data);
}

/** 更新指标体系 */
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

// ========== 下拉选项接口（示例，实际需替换为真实字典接口） ==========
export function getObjectTypeSimpleList() {
  return Promise.resolve([
    { value: 'obj_type_001', label: '政府部门' },
    { value: 'obj_type_002', label: '事业单位' },
    { value: 'obj_type_003', label: '国有企业' },
    { value: 'obj_type_004', label: '民营企业' },
    { value: 'obj_type_005', label: '社会组织' },
  ]);
}

export function getStatusSimpleList() {
  return Promise.resolve([
    { value: 1, label: '启用' },
    { value: 2, label: '停用' },
  ]);
}
