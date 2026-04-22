import { requestClient } from '#/api/request.js';

/** 删除巡检人员 */
export function deleteInspectUser(id) {
  return requestClient.delete(`/inspectop/inspect-user/delete?id=${id}`);
}

/** 分页查询巡检人员列表 */
export function getInspectUserPage(params) {
  return requestClient.get('/inspectop/inspect-user/page', { params });
}

/** 新增巡检人员 */
export function createInspectUser(data) {
  return requestClient.post('/inspectop/inspect-user/create', data);
}

/** 导入巡检人员 */
export function importInspectUser(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/inspectop/inspect-user/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出巡检人员数据 */
export function exportInspectUser(params) {
  return requestClient.download('/inspectop/inspect-user/export-excel', {
    params,
  });
}

/** 获取巡检人员详情 */
export function getInspectUserDetail(id) {
  return requestClient.get('/inspectop/inspect-user/get', { params: { id } });
}

/** 编辑巡检人员 */
export function updateInspectUser(data) {
  return requestClient.put('/inspectop/inspect-user/update', data);
}

/** 启用巡检人员 */
export function enableInspectUser(data) {
  return requestClient.put('/inspectop/inspect-user/enable', data);
}

/** 禁用巡检人员 */
export function disableInspectUser(data) {
  return requestClient.put('/inspectop/inspect-user/disable', data);
}

/** 获取巡检人员统计看板 */
export function getInspectUserChart(params) {
  return requestClient.get('/inspectop/inspect-user/chart', { params });
}
