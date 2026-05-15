// #/api/genchuan/industry/energyCharging/carCharging/settlement/sharingratio/index.js

import { requestClient } from '#/api/request';

/** 列表（分页查询） */
export function getSharingRatioPage(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/page', { params });
}

/** 新增 */
export function createSharingRatio(data) {
  return requestClient.post('/vehiclecharging/sharing-ratio/create', data);
}

/** 编辑 */
export function updateSharingRatio(data) {
  return requestClient.put('/vehiclecharging/sharing-ratio/update', data);
}

/** 删除 */
export function deleteSharingRatio(data) {
  return requestClient.delete('/vehiclecharging/sharing-ratio/delete', { data });
}

/** 批量删除 */
export function batchDeleteSharingRatio(data) {
  return requestClient.delete('/vehiclecharging/sharing-ratio/batch-delete', { data });
}

export function enableSharingRatio(data) {
  return requestClient.put('/vehiclecharging/sharing-ratio/enable', null, {
    params: data,
  });
}

/** 失效 - 使用 params 方式传递 id */
export function disableSharingRatio(data) {
  return requestClient.put('/vehiclecharging/sharing-ratio/disable', null, {
    params: data,
  });
}

/** 导出 excel - 需要设置 responseType 为 blob */
export function exportSharingRatio(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/export', {
    params,
    responseType: 'blob',
  });
}

/** 详情 */
export function getSharingRatio(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/get', { params });
}

/** 复制 */
export function copySharingRatio(data) {
  return requestClient.post('/vehiclecharging/sharing-ratio/copy', data);
}

/** 图表 - 分账比例分布（饼图 + 柱状图 + 卡片） */
export function getSharingRatioChart(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/chart', { params });
}

/** 图表 - 各合作方分账比例占比（饼图钻取） */
export function getSharingRatioCooperatorRatio(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/chart/cooperatorRatio', { params });
}

/** 图表 - 各分账方案比例对比（柱状图钻取） */
export function getSharingRatioSchemeCompare(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/chart/schemeCompare', { params });
}

/** 图表 - 分账方案状态统计（卡片钻取） */
export function getSharingRatioStatusCount(params) {
  return requestClient.get('/vehiclecharging/sharing-ratio/chart/statusCount', { params });
}
