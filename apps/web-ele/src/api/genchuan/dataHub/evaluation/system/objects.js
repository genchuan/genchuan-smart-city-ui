import { requestClient } from '#/api/request';

/** 获取对象详情（根据 objectId） */
export function getObjectDetail(objectId) {
  return requestClient.get(`/evaluate/object/${objectId}`);
}

/** 全量联表查询（分页）- 用于统计或导出全部 */
export function getAllPage(params) {
  return requestClient.get('/evaluate/object/allpage', {
    params });
}

/** 创建评价对象 */
export function createObject(data) {
  return requestClient.post('/evaluate/object/create', data);
}

/** 删除评价对象（按 ID） */
export function deleteObject(id) {
  return requestClient.delete(`/evaluate/object/delete?id=${id}`);
}

/** 根据 ID 获取评价对象（备用） */
export function getObjectById(id) {
  return requestClient.get(`/evaluate/object/get?id=${id}`);
}

/** 更新评价对象 */
export function updateObject(data) {
  return requestClient.put('/evaluate/object/update', data);
}

/** 验证名称唯一性 */
export function validateNameUnique(params) {
  return requestClient.get('/evaluate/object/validate/name-unique', {
    params });
}


/** 批量导入评价对象 */
export function importObjects(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/evaluate/object/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/** 导出 Excel（返回文件流） */
export function exportObjectExcel(params) {
  return requestClient.get('/evaluate/object/export-excel', {
    params,
    responseType: 'blob'
  });
}
