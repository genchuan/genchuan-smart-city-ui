import { requestClient } from '#/api/request';

/** 获取对象详情（根据 objectId） */
export function getObjectDetail(objectId) {
  return requestClient.get(`/evaluate/object/${objectId}`);
}

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

/** 根据 ID 获取评价对象（备用） */
export function getObjectById(id) {
  return requestClient.get(`/evaluate/object/get?id=${id}`);
}

/** 更新编辑评价对象 */
export function updateObject(data) {
  return requestClient.put('/evaluate/object/update', data);
}

/** 验证名称唯一性 */
export function validateNameUnique(params) {
  return requestClient.get('/evaluate/object/validate/name-unique', { params });
}

/** 批量导入评价对象 */
export function importObjects(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/evaluate/object/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 下载导入模板 */
export function getImportTemplate() {
  return requestClient.get('/evaluate/object/import-template', {
    responseType: 'blob'
  });
}

/** 导出 Excel（返回文件流） */
export function exportObjectExcel(params) {
  return requestClient.get('/evaluate/object/export-excel', {
    params,
    responseType: 'blob'
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
