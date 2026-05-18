import { requestClient } from '#/api/request.js';

export { loadScheduleUserOptions, userOptions } from '../userOptions.js';

/** 分页查询排班查看列表 */
export function getScheduleViewPage(params) {
  return requestClient.get('/inspectop/schedule-view/page', { params });
}

/** 导出排班查看数据 */
export function exportScheduleView(params) {
  return requestClient.download('/inspectop/schedule-view/export-excel', {
    params,
  });
}

/** 获取排班详情 */
export function getScheduleViewDetail(id) {
  return requestClient.get('/inspectop/schedule-view/get', { params: { id } });
}

/** 申请换班 */
export function applyScheduleShift(data) {
  return requestClient.post('/inspectop/schedule-view/apply-shift', data);
}

/** 获取排班统计看板 */
export function getScheduleViewChart(params) {
  return requestClient.get('/inspectop/schedule-view/chart', { params });
}
