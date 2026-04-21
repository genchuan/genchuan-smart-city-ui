import { requestClient } from '#/api/request.js';

/** 分页查询巡检轨迹列表 */
export function getInspectTrackPage(params) {
  return requestClient.get('/inspectop/inspect-track/page', { params });
}

/** 导出巡检轨迹数据 */
export function exportInspectTrack(params) {
  return requestClient.download('/inspectop/inspect-track/export-excel', {
    params,
  });
}

/** 获取巡检轨迹详情 */
export function getInspectTrackDetail(id) {
  return requestClient.get('/inspectop/inspect-track/get', { params: { id } });
}

/** 获取巡检轨迹回放数据 */
export function getInspectTrackReplay(id) {
  return requestClient.get('/inspectop/inspect-track/replay', {
    params: { id },
  });
}

/** 核查异常巡检轨迹 */
export function checkInspectTrack(data) {
  return requestClient.put('/inspectop/inspect-track/check', data);
}

/** 获取巡检轨迹统计看板 */
export function getInspectTrackChart(params) {
  return requestClient.get('/inspectop/inspect-track/chart', { params });
}
