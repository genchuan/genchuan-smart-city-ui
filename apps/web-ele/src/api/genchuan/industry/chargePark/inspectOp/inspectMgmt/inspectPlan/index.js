import { requestClient } from '#/api/request.js';

/** 分页查询巡检计划列表 */
export function getInspectPlanPage(params) {
  return requestClient.get('/inspectop/inspect-plan/page', { params });
}

/** 新增巡检计划 */
export function createInspectPlan(data) {
  return requestClient.post('/inspectop/inspect-plan/create', data);
}

/** 导入巡检计划 */
export function importInspectPlan(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post('/inspectop/inspect-plan/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 导出巡检计划数据 */
export function exportInspectPlan(params) {
  return requestClient.download('/inspectop/inspect-plan/export-excel', { params });
}

/** 获取巡检计划详情 */
export function getInspectPlanDetail(id) {
  return requestClient.get('/inspectop/inspect-plan/get', { params: { id } });
}

/** 编辑巡检计划 */
export function updateInspectPlan(data) {
  return requestClient.put('/inspectop/inspect-plan/update', data);
}

/** 生效/启用巡检计划 */
export function enableInspectPlan(data) {
  return requestClient.put('/inspectop/inspect-plan/enable', data);
}

/** 暂停巡检计划 */
export function pauseInspectPlan(data) {
  return requestClient.put('/inspectop/inspect-plan/pause', data);
}

/** 获取巡检计划统计看板 */
export function getInspectPlanChart(params) {
  return requestClient.get('/inspectop/inspect-plan/chart', { params });
}
