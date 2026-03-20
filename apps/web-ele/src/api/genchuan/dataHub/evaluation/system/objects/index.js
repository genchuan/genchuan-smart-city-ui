import { requestClient } from '#/api/request.js';

/** 全量联表查询（分页）- 用于统计或导出全部 */
export function getAllPage(params) {
  return requestClient.get('/evaluate/object/allpage', { params });
}

/** 创建评价对象 */
export function createObject(data) {
  return requestClient.post('/evaluate/object/create', data);
}

/** 删除评价对象（按主键 ID） */
export function deleteObject(id) {
  return requestClient.delete(`/evaluate/object/delete?id=${id}`);
}

/** 更新编辑评价对象 */
export function updateObject(data) {
  return requestClient.put('/evaluate/object/update', data);
}

/** 批量导入评价对象 */
export function importObjects(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/evaluate/object/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 获取状态统计数据（用于 tabs 计数） */
export function getStatusCount() {
  return requestClient.get('/evaluate/object/status-count');
}

/** 获取评价对象概览数据（用于图表） */
export function getOverview() {
  return requestClient.get('/evaluate/object/overview');
}

// ========== 下拉选项接口（与后端实际地址对应） ==========

/** 获取负责人列表（user simple list） */
export function getUserSimpleList() {
  return requestClient.get('/evaluate/user/simple-list');
}

/** 获取所属区域列表 */
export function getAreaSimpleList() {
  return requestClient.get('/evaluate/area/simple-list');
}

/** 获取对象类型列表 */
export function getObjectTypeSimpleList() {
  return requestClient.get('/evaluate/object-type/simple-list');
}

/** 获取关联网格/部门列表 */
export function getRelatedObjectSimpleList() {
  return requestClient.get('/evaluate/related-object/simple-list');
}
