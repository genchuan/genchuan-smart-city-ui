// module-alarm/api/index.js
import { requestClient } from '#/api/request.js';

/**
 * 分页查询告警列表
 */
export function getPageList(params) {
  return requestClient.get('/vehiclecharging/module-alarm/page', { params });
}

/**
 * 排查（未排查 → 已排查）
 */
export function checkAlarm(data) {
  return requestClient.put('/vehiclecharging/module-alarm/check', data);
}

/**
 * 修复（已排查 → 修复中）
 */
export function repairAlarm(data) {
  return requestClient.put('/vehiclecharging/module-alarm/repair', data);
}

/**
 * 销账（修复中 → 已销账）
 */
export function closeAlarm(data) {
  return requestClient.put('/vehiclecharging/module-alarm/close', data);
}

/**
 * 添加备注
 */
export function remarkAlarm(data) {
  return requestClient.put('/vehiclecharging/module-alarm/remark', data);
}

/**
 * 获取告警详情
 */
export function getAlarmDetail(id) {
  return requestClient.get(`/vehiclecharging/module-alarm/get?id=${id}`);
}

/**
 * 获取修复凭证文件地址
 */
export function getRepairVoucher(id) {
  return requestClient.get(`/vehiclecharging/module-alarm/repairVoucher?id=${id}`);
}

/**
 * 上传修复凭证（自定义上传，返回文件URL）
 */
export function uploadRepairVoucher(formData) {
  return requestClient.post('/vehiclecharging/module-alarm/upload-voucher', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * 导出告警列表（Excel）
 */
export function exportAlarm(params) {
  return requestClient.get('/vehiclecharging/module-alarm/export', {
    params,
    responseType: 'blob',
  });
}

/**
 * 图表数据（柱状图、折线图、卡片）
 */
export function getChartData(params) {
  return requestClient.get('/vehiclecharging/module-alarm/chart', { params });
}
