import { requestClient } from '#/api/request';
/** 道路实施检测分页 */
export function getRoadList(params) {
  return requestClient.get('/facility/monitor/realtime-page', {
    params,
  });
}
/** 道路实施增加 */
export function addRoad(data) {
  return requestClient.post('/facility/monitor/create', data);
}
/** 道路实施更新 */
export function updateRoad(data) {
  return requestClient.put('/facility/monitor/update', data);
}
/** 道路实施删除 */
export function deleteRoad(id) {
  return requestClient.delete(`/facility/monitor/delete?id=${id}`);
}

/** excel导出 */
export function exportRoadExcel() {
  return requestClient.download('facility/monitor/export-excel');
}
