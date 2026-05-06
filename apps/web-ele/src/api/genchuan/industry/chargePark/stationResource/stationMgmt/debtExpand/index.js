import { requestClient } from '#/api/request.js';

// 联合追缴拓场接口
const baseUrl = '/stationresource/debt-expand';

export function getDebtExpandPage(params) {
  return requestClient.get(`${baseUrl}/page`, { params });
}

export function getDebtExpandDetail(id) {
  return requestClient.get(`${baseUrl}/get`, { params: { id } });
}

export function createDebtExpand(data) {
  return requestClient.post(`${baseUrl}/create`, data);
}

export function updateDebtExpand(data) {
  return requestClient.put(`${baseUrl}/update`, data);
}

export function enableDebtExpand(data) {
  return requestClient.put(`${baseUrl}/enable`, data);
}

export function disableDebtExpand(data) {
  return requestClient.put(`${baseUrl}/disable`, data);
}

export function importDebtExpand(file, updateSupport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('updateSupport', updateSupport);
  return requestClient.post(`${baseUrl}/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function getDebtExpandImportTemplate() {
  return requestClient.download(`${baseUrl}/get-import-template`);
}

export function exportDebtExpand(params) {
  return requestClient.download(`${baseUrl}/export`, { params });
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function normalizePercent(value) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value || 0;
  return numberValue <= 1 && numberValue > 0
    ? Number((numberValue * 100).toFixed(2))
    : numberValue;
}

export async function getDebtExpandChart(params) {
  const res = await requestClient.get(`${baseUrl}/chart`, { params });
  if (!res) return res;
  const cardData = {
    ...res.cardData,
    recoveryRate: normalizePercent(
      firstDefined(res.cardData?.recoveryRate, res.recoveryRate, 0),
    ),
  };
  const recoveryBarList = (
    res.recoveryBarList ||
    res.barData ||
    res.stationRecoveryList ||
    []
  ).map((item) => ({
    ...item,
    name: firstDefined(item.name, item.stationName, item.stationId),
    value: normalizePercent(firstDefined(item.value, item.rate, item.count, 0)),
  }));
  return {
    ...res,
    cardData,
    recoveryBarList,
    progressLineList: res.progressLineList || res.lineData || [],
  };
}
