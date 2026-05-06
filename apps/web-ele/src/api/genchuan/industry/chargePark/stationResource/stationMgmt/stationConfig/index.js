import { requestClient } from '#/api/request.js';

// 场站配置接口
const baseUrl = '/stationresource/station-config';

export function getStationConfigPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getStationConfigDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createStationConfig(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateStationConfig(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableStationConfig(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableStationConfig(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

export async function getStationConfigChart(params) {
  const res = await requestClient.get(`${baseUrl}/chart`, { params });
  if (!res) return res;
  const typePieList = (res.typePieList || res.pieData || []).map((item) => ({
    ...item,
    name: firstDefined(item.name, item.type, item.label),
    value: firstDefined(item.value, item.count, 0),
  }));
  const cardData = {
    ...res.cardData,
    configedStationCount:
      res.cardData?.configedStationCount === undefined
        ? res.cardData?.configuredStationCount || 0
        : res.cardData.configedStationCount,
    enableConfigCount:
      res.cardData?.enableConfigCount === undefined
        ? 0
        : res.cardData.enableConfigCount,
  };
  return {
    ...res,
    typePieList,
    pieData: typePieList.map((item) => ({
      ...item,
      count: item.value,
    })),
    cardData,
  };
}

export function saveStationConfig(data) {
  return requestClient.put(`${baseUrl}/save`, data);
}

export function resetStationConfig(data) {
  return requestClient.put(`${baseUrl}/reset`, data);
}

export function batchSyncStationConfig(data) {
  return requestClient.post(`${baseUrl}/batch-sync`, data);
}
