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
/** 分割 */

/** 道路实施检测分页 */
export function getRoadConfig(params) {
  return requestClient.get('/facility/road-config/page', {
    params,
  });
}
/** 道路实施检测增加 */
export function addRoadConfig(data) {
  return requestClient.post('/facility/road-config/create', data);
}
/** 道路实施检测更新 */
export function updateRoadConfig(data) {
  return requestClient.put('/facility/road-config/update', data);
}
/** 道路实施检测删除 */
export function deleteRoadConfig(id) {
  return requestClient.delete(`/facility/road-config/delete?id=${id}`);
}

/** 批量修改道路设施状态 */
export function updateRoadStatusList(data) {
  return requestClient.post(
    '/facility/monitor/batch-update-monitor-status',
    data,
  );
}
/** 获得道路设施 */
export function getRoadFacility(params) {
  return requestClient.get('/facility/road-facility/get', {
    params,
  });
}
/** 获得道路列表 */
export function getRoadFacilityList(data) {
  return requestClient.get('/facility/road-facility/page', data);
}
/** 获得道路监测预警分页 */
export function getwarnList(params) {
  return requestClient.get('/facility/road-warn/page-road-warn', {
    params,
  });
}
/** 预警创建 */
export function addWarn(data) {
  return requestClient.post('/facility/road-warn/create', data);
}
/** 道路监测预警删除 */
export function deleteWarn(id) {
  return requestClient.delete(`/facility/road-warn/delete?id=${id}`);
}

/** 
 * 批量确认无效预警
 * @param {object} params 管理后台 - 批量修改无效状态 VO
 * @param {array} params.idList [批量修改的预警id列表]
 * @returns
 */
export function batchConfirmInvalidSysWarn(params) {
  return requestClient.put(`/facility/sys-warn/batch-confirm-invalid`, params);
}
/** 
 * 确认有效预警
 * @param {object} params 管理后台 - 确认有效 VO
 * @param {number} params.id [主键ID] 主键，预警记录唯一标识
 * @param {string} params.confirmOpinion [确认意见] 人工确认后的描述
 * @returns
 */
export function confirmValid(params) {
  return requestClient.put(`/facility/sys-warn/confirm-valid`, params);
}
/** 
 * 标注无效预警
 * @param {object} params 管理后台 - 确认有效 VO
 * @param {number} params.id [主键ID] 主键，预警记录唯一标识
 * @param {string} params.invalidReason [无效原因] 如设备故障/数据波动/人为误触等
 * @returns
 */
export function confirmInvalid(params) {
  return requestClient.put(`/facility/sys-warn/confirm-invalid`, params);
}
/** excel导出 */
export function exportwarnExcel() {
  return requestClient.download('/facility/road-warn/export-excel');
}
/** 获得设备分页 */
export function getSysDevicePage(params) {
  return requestClient.get('/facility/sys-device/page', {
    params,
  });
}

/** 获得道路工单分页 */
export function getRoadWorkOrder(params) {
  return requestClient.get('/facility/road-work-order/page', {
    params,
  });
}

/** 批量提醒 */
export function batchConfirmRemind(params) {
  return requestClient.post(`/facility/work-order/batch-remind`, params);
}
/** 处置中预警创建 */
export function createWorkOrder(params) {
  return requestClient.post(`/facility/work-order/create`, params);
}
/** 更新派单对象 */
export function batchUpdateAssignStaff(params) {
  return requestClient.post(`/facility/work-order/reassign-work-order`, params);
}
/** 更新进度 */
export function updateWorkOrderProgress(params) {
  return requestClient.post(`/facility/work-order/update-process-status`, params);
}
/** 超时督办 */
 
export function superviseWorkOrder(params) {
  return requestClient.post(`/facility/work-order/supervise-overtime`, params);
}

/** 上传资料 */
export function uploadWorkOrderFile(data) {
 return requestClient.post('/facility/work-order/upload-work-order-file', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
} 

/** 获得人员统计 */
export function getSysUserPage(data) {
 return requestClient.get('/facility/sys-user/page', data);
} 