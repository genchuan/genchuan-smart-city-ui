import { requestClient } from '#/api/request.js';

// 车位信息接口
const baseUrl = '/stationresource/parking-space-info';

export function getParkingSpaceInfoPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getParkingSpaceInfoDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createParkingSpaceInfo(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateParkingSpaceInfo(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableParkingSpaceInfo(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableParkingSpaceInfo(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importParkingSpaceInfo(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function exportParkingSpaceInfo(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function buildCoordinate(item) {
  if (item.coordinate) return item.coordinate;
  const lng = firstDefined(item.lng, item.lon, item.longitude);
  const lat = firstDefined(item.lat, item.latitude);
  if (lng === undefined || lat === undefined || lng === null || lat === null) {
    return '';
  }
  return `${lng},${lat}`;
}

function buildPieData(cardData) {
  return [
    { name: '空闲', count: cardData.availableSpaceCount || 0 },
    { name: '占用', count: cardData.occupiedSpaceCount || 0 },
    { name: '故障', count: cardData.faultSpaceCount || 0 },
  ].filter((item) => item.count > 0);
}

export async function getParkingSpaceInfoChart(params) {
  const res = await requestClient.get(`${baseUrl}/chart`, { params });
  if (!res) return res;

  const rawMapData =
    res.spaceMapList || res.stationMapList || res.mapData || [];
  const mapData = rawMapData.map((item) => {
    const lng = firstDefined(item.lng, item.lon, item.longitude);
    const lat = firstDefined(item.lat, item.latitude);
    const spaceCount = firstDefined(
      item.spaceCount,
      item.value,
      item.count,
      item.totalSpace,
      item.spaceNum,
      0,
    );
    return {
      ...item,
      id: firstDefined(item.id, item.stationId, item.stationNo, item.spaceNo),
      lng,
      lat,
      coordinate: buildCoordinate(item),
      locationName: firstDefined(
        item.locationName,
        item.name,
        item.stationName,
        item.spaceName,
        item.spaceNo,
      ),
      name: firstDefined(
        item.name,
        item.stationName,
        item.locationName,
        item.spaceName,
        item.spaceNo,
      ),
      statusName: firstDefined(item.statusName, item.status, '正常'),
      spaceCount,
    };
  });

  const rawCardData = res.cardData || {};
  const cardData = {
    ...rawCardData,
    totalSpaceCount: firstDefined(
      rawCardData.totalSpaceCount,
      rawCardData.totalSpace,
      0,
    ),
    availableSpaceCount: firstDefined(
      rawCardData.availableSpaceCount,
      rawCardData.availableSpace,
      rawCardData.freeSpaceCount,
      0,
    ),
    freeSpaceCount: firstDefined(
      rawCardData.freeSpaceCount,
      rawCardData.availableSpaceCount,
      rawCardData.availableSpace,
      0,
    ),
    faultSpaceCount: firstDefined(
      rawCardData.faultSpaceCount,
      rawCardData.faultSpace,
      0,
    ),
    totalSpace: firstDefined(
      rawCardData.totalSpaceCount,
      rawCardData.totalSpace,
      0,
    ),
    bindSpace: firstDefined(
      rawCardData.bindSpaceCount,
      rawCardData.bindSpace,
      0,
    ),
    unbindSpace: firstDefined(
      rawCardData.unbindSpaceCount,
      rawCardData.unbindSpace,
      rawCardData.availableSpace,
      rawCardData.availableSpaceCount,
      0,
    ),
    disableSpace: firstDefined(
      rawCardData.disableSpaceCount,
      rawCardData.disableSpace,
      0,
    ),
  };

  const pieData = (
    res.statusPieList ||
    res.typePieList ||
    res.pieData ||
    []
  ).map((item) => ({
    ...item,
    count: firstDefined(item.count, item.value, item.spaceCount, 0),
  }));

  const barData = (
    res.stationCountBarList ||
    res.spaceCountBarList ||
    res.barData ||
    mapData
  ).map((item) => ({
    ...item,
    name: firstDefined(
      item.name,
      item.stationName,
      item.locationName,
      item.spaceNo,
    ),
    spaceCount: firstDefined(
      item.spaceCount,
      item.value,
      item.count,
      item.totalSpace,
      0,
    ),
  }));

  return {
    mapData,
    pieData: pieData.length > 0 ? pieData : buildPieData(cardData),
    barData,
    cardData,
  };
}

export function bindParkingSpaceInfo(data) {
  return requestClient.put(`${baseUrl}/bind`, data);
}
