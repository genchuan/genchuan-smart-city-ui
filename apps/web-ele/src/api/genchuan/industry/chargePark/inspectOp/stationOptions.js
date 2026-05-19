import { requestClient } from '#/api/request.js';

/** 巡检运营模块公共：场站信息分页（下拉选项等） */
export function getInspectOpStationOptions(params) {
  return requestClient.get('/stationresource/station-info/page', { params });
}

/** @deprecated 请使用 getInspectOpStationOptions */
export const getCycleReportStationOptions = getInspectOpStationOptions;
