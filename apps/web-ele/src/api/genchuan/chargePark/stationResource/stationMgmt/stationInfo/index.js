import { requestClient } from '#/api/request.js';

// 场站信息接口
const baseUrl = '/stationresource/station-info';

export function getStationInfoPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getStationInfoDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createStationInfo(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateStationInfo(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableStationInfo(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableStationInfo(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importStationInfo(file) {
  const formData = new FormData();
  formData.append('file', file);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportStationInfo(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

export async function getStationInfoChart(params) {
  const res = await requestClient.get(`${baseUrl}/chart`, { params });
  if (!res) return res;
  return {
    mapData: (res.stationMapList || res.mapData || []).map((item) => ({
      ...item,
      lng: item.lon === undefined ? item.lng : item.lon,
    })),
    barData: (res.typeCountBarList || res.barData || []).map((item) => ({
      ...item,
      stationCount: item.value === undefined ? item.stationCount : item.value,
    })),
    cardData: {
      ...res.cardData,
      totalStation:
        res.cardData?.totalStationCount === undefined
          ? res.cardData?.totalStation || 0
          : res.cardData.totalStationCount,
      enableStation:
        res.cardData?.normalOperateCount === undefined
          ? res.cardData?.enableStation || 0
          : res.cardData.normalOperateCount,
      disableStation:
        res.cardData?.disableStationCount === undefined
          ? res.cardData?.disableStation || 0
          : res.cardData.disableStationCount,
      totalSpace:
        res.cardData?.totalSpaceCount === undefined
          ? res.cardData?.totalSpace || 0
          : res.cardData.totalSpaceCount,
    },
  };
}
