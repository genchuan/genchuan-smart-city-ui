import { requestClient } from '#/api/request.js';

/** 删除电子围栏 */
export function deleteFenceMgmt(id) {
  return requestClient.delete(`/inspectop/fence-mgmt/delete?id=${id}`);
}

/** 分页查询电子围栏列表 */
export function getFenceMgmtPage(params) {
  return requestClient.get('/inspectop/fence-mgmt/page', { params });
}

/** 新增电子围栏 */
export function createFenceMgmt(data) {
  return requestClient.post('/inspectop/fence-mgmt/create', data);
}

/** 编辑电子围栏 */
export function updateFenceMgmt(data) {
  return requestClient.put('/inspectop/fence-mgmt/update', data);
}

/** 获取电子围栏详情 */
export function getFenceMgmtDetail(id) {
  return requestClient.get('/inspectop/fence-mgmt/get', { params: { id } });
}

/** 生效电子围栏 */
export function enableFenceMgmt(data) {
  return requestClient.put('/inspectop/fence-mgmt/enable', data);
}

/** 禁用电子围栏 */
export function disableFenceMgmt(data) {
  return requestClient.put('/inspectop/fence-mgmt/disable', data);
}

/** 获取电子围栏统计看板 */
export function getFenceMgmtChart(params) {
  return requestClient.get('/inspectop/fence-mgmt/chart', { params });
}
