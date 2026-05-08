import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const ASSET_STOCK_STATUS_DICT = DICT_TYPE.ASSET_STOCK_STATUS;

function getDictLabel(dictType, value) {
  if (value === undefined || value === null || value === '') return '-';
  const dict = getDictObj(dictType, String(value));
  return dict?.label || value;
}

function isDictLabel(dictType, value, label) {
  return (
    String(value) === String(label) || getDictLabel(dictType, value) === label
  );
}

function isSameDictValue(dictType, current, target) {
  if (!target) return true;
  return (
    String(current) === String(target) ||
    getDictLabel(dictType, current) === getDictLabel(dictType, target)
  );
}

export function getStockStatusLabel(value) {
  return getDictLabel(ASSET_STOCK_STATUS_DICT, value);
}

export function isStockStatusLabel(value, label) {
  return isDictLabel(ASSET_STOCK_STATUS_DICT, value, label);
}
export const stockStatusOptions = getDictOptions(
  ASSET_STOCK_STATUS_DICT,
  'string',
);

/** 按资产库存状态字典 label 取 value，供图表卡片筛选 */
export function getAssetStockStatusOptionValue(label) {
  const opt = stockStatusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

export const assetOptions = [
  { label: '车位监测摄像头', type: '监测设备', value: 1 },
  { label: '直流快充终端', type: '充电设备', value: 2 },
  { label: '手持巡检终端', type: '巡检工具', value: 3 },
  { label: '环境监测传感器', type: '监测设备', value: 4 },
  { label: '交流充电枪', type: '充电设备', value: 5 },
  { label: '消防巡检工具箱', type: '巡检工具', value: 6 },
];

export const stationOptions = [
  { label: '泉州丰泽充电站', value: 1 },
  { label: '鲤城公共停车场', value: 2 },
  { label: '洛江万安充停站', value: 3 },
  { label: '晋江池店综合能源站', value: 4 },
  { label: '石狮服装城充停站', value: 5 },
  { label: '南安水头交通枢纽站', value: 6 },
];

const replenishRecords = [
  '2026-04-10 补货 8 件',
  '2026-04-08 补货 12 件',
  '2026-04-05 补货 5 件',
  '2026-04-01 补货 10 件',
];

const allocateRecords = [
  '调配至晋江池店综合能源站 2 件',
  '调配至泉州丰泽充电站 3 件',
  '调配至鲤城公共停车场 1 件',
  '暂无调配记录',
];

const baseTime = 1_775_011_986_000;

export function formatStockTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getAssetName(assetId) {
  return (
    assetOptions.find((item) => Number(item.value) === Number(assetId))
      ?.label || '-'
  );
}

export function getAssetType(assetId) {
  return (
    assetOptions.find((item) => Number(item.value) === Number(assetId))?.type ||
    '-'
  );
}

export function getStationName(stationId) {
  return (
    stationOptions.find((item) => Number(item.value) === Number(stationId))
      ?.label || '-'
  );
}

export function getStockStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    低库存: 'warning',
    预警库存: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(ASSET_STOCK_STATUS_DICT, String(status)),
    tagMap[getStockStatusLabel(status)] || 'info',
  );
}

export function getStockProgressStatus(row) {
  const currentStock = Number(row.currentStock || 0);
  const warnThreshold = Number(row.warnThreshold || 1);
  if (currentStock <= warnThreshold) return 'exception';
  if (currentStock <= warnThreshold * 2) return 'warning';
  return 'success';
}

export function getStockStatusByCount(currentStock, warnThreshold) {
  if (currentStock <= warnThreshold) return '预警库存';
  if (currentStock <= warnThreshold * 2) return '低库存';
  return '正常';
}

export function dataList() {
  return Array.from({ length: 16 }, (_, index) => {
    const asset = assetOptions[index % assetOptions.length];
    const station = stationOptions[index % stationOptions.length];
    const warnThreshold = 5 + (index % 3) * 2;
    const currentStockList = [28, 15, 3, 8, 2, 21, 5, 11];
    const currentStock = currentStockList[index % currentStockList.length];
    const status = getStockStatusByCount(currentStock, warnThreshold);
    const updateTime = baseTime - index * 86_400_000;

    return {
      id: index + 1,
      assetId: asset.value,
      assetName: asset.label,
      assetType: asset.type,
      currentStock,
      warnThreshold,
      status,
      stationId: station.value,
      stationName: station.label,
      lastUpdateTime: updateTime,
      replenishRecord: replenishRecords[index % replenishRecords.length],
      allocateRecord: allocateRecords[index % allocateRecords.length],
      reserve1: replenishRecords[index % replenishRecords.length],
      reserve2: allocateRecords[index % allocateRecords.length],
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime: updateTime - 2 * 86_400_000,
      updateTime,
    };
  });
}

export function normalizeAssetStockRow(row) {
  const assetId = row.assetId ?? row.asset_id;
  const currentStock = row.currentStock ?? row.current_stock ?? 0;
  const warnThreshold = row.warnThreshold ?? row.warn_threshold ?? 0;
  const stationId = row.stationId ?? row.station_id;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const lastUpdateTime =
    row.lastUpdateTime ?? row.last_update_time ?? updateTime;

  return {
    ...row,
    id: row.id,
    assetId,
    assetName: row.assetName || row.asset_name || getAssetName(assetId),
    assetType: row.assetType || row.asset_type || getAssetType(assetId),
    currentStock: Number(currentStock),
    warnThreshold: Number(warnThreshold),
    status: row.statusName || row.status || '正常',
    stationId,
    stationName:
      row.stationName || row.station_name || getStationName(stationId),
    lastUpdateTime,
    lastUpdateTimeStr: formatStockTime(lastUpdateTime),
    replenishRecord:
      row.replenishRecord ||
      row.replenish_record ||
      row.reserve1 ||
      '暂无补货记录',
    allocateRecord:
      row.allocateRecord ||
      row.allocate_record ||
      row.reserve2 ||
      '暂无调配记录',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatStockTime(createTime),
    updateTime,
    updateTimeStr: formatStockTime(updateTime),
  };
}

function isInRange(value, range) {
  if (range === undefined || range === null || range === '') return true;
  const numberValue = Number(value);
  if (!Array.isArray(range)) return numberValue === Number(range);
  if (range.length !== 2) return true;
  const [min, max] = range.map(Number);
  return numberValue >= min && numberValue <= max;
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeAssetStockRow(item));
  const currentStockRange = params.currentStockRange || params.currentStock;

  return list.filter((item) => {
    const matchAsset =
      !params.assetId || Number(item.assetId) === Number(params.assetId);
    const matchAssetName =
      !params.assetName || item.assetName.includes(String(params.assetName));
    const matchStatus = isSameDictValue(
      ASSET_STOCK_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchStation =
      !params.stationId || Number(item.stationId) === Number(params.stationId);
    const matchTrendTime =
      !params.trendTime ||
      item.lastUpdateTimeStr.includes(String(params.trendTime));
    const matchStock = isInRange(item.currentStock, currentStockRange);

    return (
      matchAsset &&
      matchAssetName &&
      matchStatus &&
      matchStation &&
      matchTrendTime &&
      matchStock
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeAssetStockRow(item));
  const totalStock = list.reduce((sum, item) => sum + item.currentStock, 0);
  const warnStockCount = list.filter(
    (item) => item.status === '预警库存',
  ).length;
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    stockCount: totalStock - (5 - index) * 6,
  }));
  const stockData = assetOptions.map((asset) => ({
    assetId: asset.value,
    assetName: asset.label,
    currentStock: list
      .filter((item) => Number(item.assetId) === Number(asset.value))
      .reduce((sum, item) => sum + item.currentStock, 0),
  }));

  return {
    trendData,
    stockData,
    cardData: {
      totalStock,
      warnStockCount,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'assetId',
      label: '关联资产',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联资产',
        clearable: true,
        options: assetOptions,
      },
    },
    {
      fieldName: 'stationName',
      label: '所属仓库',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属仓库',
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '库存状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择库存状态',
        clearable: true,
        options: stockStatusOptions,
      },
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入当前库存',
        min: 0,
      },
    },
  ];
}

export function useAllocateFormSchema() {
  return [
    {
      fieldName: 'assetName',
      label: '关联资产',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'stationName',
      label: '来源仓库',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'targetStationId',
      label: '目标仓库',
      component: 'Select',
      componentProps: {
        placeholder: '请选择调配目标仓库',
        options: stationOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'allocateCount',
      label: '调配数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入调配数量',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
  ];
}

export function useReplenishFormSchema() {
  return [
    {
      fieldName: 'assetName',
      label: '关联资产',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      // componentProps: {
      //   disabled: true,
      // },
    },
    // {
    //   fieldName: 'replenishCount',
    //   label: '补货数量',
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入补货数量',
    //     min: 1,
    //     precision: 0,
    //   },
    //   rules: 'required',
    // },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '库存ID', minWidth: 90, sortable: true },
    {
      field: 'assetName',
      title: '关联资产',
      minWidth: 180,
      sortable: true,
      slots: { default: 'assetName' },
    },
    { field: 'assetType', title: '资产类型', minWidth: 110, sortable: true },
    {
      field: 'currentStock',
      title: '当前库存',
      minWidth: 120,
      sortable: true,
      slots: { default: 'currentStock' },
    },
    {
      field: 'warnThreshold',
      title: '预警阈值',
      minWidth: 110,
      sortable: true,
    },
    {
      field: 'status',
      title: '库存状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '所属仓库',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'lastUpdateTimeStr',
      title: '最后更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'replenishRecord',
      title: '补货记录',
      minWidth: 180,
      sortable: true,
      slots: { default: 'replenishRecord' },
    },
    {
      field: 'allocateRecord',
      title: '调配记录',
      minWidth: 200,
      sortable: true,
      slots: { default: 'allocateRecord' },
    },
    {
      title: '操作',
      width: 210,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '库存ID' },
  { key: 'assetName', label: '关联资产' },
  { key: 'assetType', label: '资产类型' },
  { key: 'currentStock', label: '当前库存' },
  { key: 'warnThreshold', label: '预警阈值' },
  {
    key: 'status',
    label: '库存状态',
    type: 'tag',
    tagType: getStockStatusTagType,
    formatter: getStockStatusLabel,
  },
  { key: 'stationName', label: '所属仓库' },
  { key: 'lastUpdateTimeStr', label: '最后更新时间' },
  { key: 'replenishRecord', label: '补货记录' },
  { key: 'allocateRecord', label: '调配记录' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  allocateText: '库存调配',
  replenishText: '库存补货',
  excelAllName: '库存管理数据.xlsx',
  total: '库存管理支持库存更新、库存预警、库存调配、记录同步闭环管理',
};
