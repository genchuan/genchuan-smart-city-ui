import { requestClient } from '#/api/request.js';

// 片区信息接口
const baseUrl = '/stationresource/area-info';

export function getAreaInfoPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getAreaInfoList(params) {
  return requestClient.get(`${baseUrl}/list`, { params });
}

export function getAreaInfoDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createAreaInfo(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateAreaInfo(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableAreaInfo(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableAreaInfo(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importAreaInfo(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportAreaInfo(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export async function getAreaInfoChart(params) {
  const res = await requestClient.get(`${baseUrl}/chart`, { params });
  if (!res) return res;
  return {
    mapData: (res.areaMapList || res.mapData || []).map((item) => ({
      ...item,
      lng: item.lon === undefined ? item.lng : item.lon,
    })),
    barData: (res.stationCountBarList || res.barData || []).map((item) => ({
      ...item,
      stationCount: item.value === undefined ? item.stationCount : item.value,
    })),
    cardData: {
      ...res.cardData,
      totalArea:
        res.cardData?.totalAreaCount === undefined
          ? res.cardData?.totalArea || 0
          : res.cardData.totalAreaCount,
      totalStation:
        res.cardData?.totalStationCount === undefined
          ? res.cardData?.totalStation || 0
          : res.cardData.totalStationCount,
    },
  };
}
