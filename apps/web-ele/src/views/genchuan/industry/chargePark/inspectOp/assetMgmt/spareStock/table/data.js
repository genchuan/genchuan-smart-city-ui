import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getSpareStockSimpleList } from '#/api/genchuan/industry/chargePark/inspectOp/assetMgmt/spareStock';
import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const SPARE_STOCK_STATUS_DICT = DICT_TYPE.SPARE_STOCK_STATUS;

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

export function getSpareStatusLabel(value) {
  return getDictLabel(SPARE_STOCK_STATUS_DICT, value);
}

export function isSpareStatusLabel(value, label) {
  return isDictLabel(SPARE_STOCK_STATUS_DICT, value, label);
}
export const stockStatusOptions = getDictOptions(
  SPARE_STOCK_STATUS_DICT,
  'string',
);

/** 按备件库存状态字典 label 取 value，供图表卡片筛选 */
export function getSpareStockStatusOptionValue(label) {
  const opt = stockStatusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

/** 备件下拉选项，由 loadSpareOptions 请求 simple-list 后填充 */
export const spareOptions = [];

/** 接口行转下拉项（兼容 spare_id / spare_name / spare_type） */
export function mapSpareSimpleToOption(row) {
  const spareId = row.spareId ?? row.spare_id;
  const spareName = row.spareName ?? row.spare_name ?? '';
  const spareType = row.spareType ?? row.spare_type ?? '-';
  return {
    label: spareName,
    value: spareId,
    type: spareType,
  };
}

let spareOptionsLoadPromise = null;

/**
 * 拉取备件简单列表并写入 spareOptions（供筛选、入出库表单等使用）
 * @returns {Promise<typeof spareOptions>}
 */
export function loadSpareOptions(params) {
  if (!spareOptionsLoadPromise) {
    spareOptionsLoadPromise = (async () => {
      try {
        const raw = await getSpareStockSimpleList(params);
        const list = Array.isArray(raw) ? raw : [];
        const mapped = list
          .map(mapSpareSimpleToOption)
          .filter(
            (o) =>
              o.value !== undefined &&
              o.value !== null &&
              String(o.value) !== '',
          );
        spareOptions.splice(0, spareOptions.length, ...mapped);
      } catch (error) {
        console.error('加载备件简单列表失败:', error);
        spareOptions.splice(0, spareOptions.length);
      } finally {
        spareOptionsLoadPromise = null;
      }
      return spareOptions;
    })();
  }
  return spareOptionsLoadPromise;
}

function getSpareOptionsForMock() {
  if (spareOptions.length > 0) return spareOptions;
  return [{ label: '—', type: '-', value: 0 }];
}

export const warehouseOptions = [
  { label: '丰泽中心备件仓', value: 1 },
  { label: '鲤城运维仓', value: 2 },
  { label: '晋江综合仓', value: 3 },
  { label: '石狮应急仓', value: 4 },
];

const supplierOptions = [
  '泉州智维供应商',
  '福建充电设备厂',
  '海西智能配件',
  '闽南电气备件',
];
const receiverOptions = ['张三', '李四', '王五', '赵六'];
const inRecords = [
  '2026-04-12 入库 10 件',
  '2026-04-09 入库 6 件',
  '2026-04-06 入库 15 件',
  '2026-04-02 入库 8 件',
];
const outRecords = [
  '2026-04-13 出库 2 件',
  '2026-04-10 出库 4 件',
  '2026-04-07 出库 1 件',
  '暂无出库记录',
];

const baseTime = 1_775_011_986_000;

export function formatSpareTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getSpareName(spareId) {
  return (
    spareOptions.find((item) => Number(item.value) === Number(spareId))
      ?.label || '-'
  );
}

export function getSpareType(spareId) {
  return (
    spareOptions.find((item) => Number(item.value) === Number(spareId))?.type ||
    '-'
  );
}

export function getWarehouseName(warehouseId) {
  return (
    warehouseOptions.find((item) => Number(item.value) === Number(warehouseId))
      ?.label || '-'
  );
}

export function getSpareStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    低库存: 'warning',
  };
  return getDictTagTypeFromDict(
    getDictObj(SPARE_STOCK_STATUS_DICT, String(status)),
    tagMap[getSpareStatusLabel(status)] || 'info',
  );
}

export function getSpareProgressStatus(row) {
  const currentStock = Number(row.currentStock || 0);
  if (currentStock <= 5) return 'exception';
  if (currentStock <= 10) return 'warning';
  return 'success';
}

export function getStockStatusByCount(currentStock) {
  if (currentStock <= 8) return '低库存';
  return '正常';
}

export function dataList() {
  const sparePool = getSpareOptionsForMock();
  return Array.from({ length: 16 }, (_, index) => {
    const spare = sparePool[index % sparePool.length];
    const warehouse = warehouseOptions[index % warehouseOptions.length];
    const currentStockList = [18, 7, 22, 4, 11, 6, 26, 9];
    const currentStock = currentStockList[index % currentStockList.length];
    const status = getStockStatusByCount(currentStock);
    const inTime = baseTime - index * 2 * 86_400_000;
    const outTime = index % 3 === 0 ? inTime + 86_400_000 : null;

    return {
      id: index + 1,
      spareId: spare.value,
      spareName: spare.label,
      spareType: spare.type,
      currentStock,
      status,
      warehouseId: warehouse.value,
      warehouseName: warehouse.label,
      inTime,
      outTime,
      lastUpdateTime: inTime + 2 * 3_600_000,
      inRecord: inRecords[index % inRecords.length],
      outRecord: outRecords[index % outRecords.length],
      supplier: supplierOptions[index % supplierOptions.length],
      receiver: receiverOptions[index % receiverOptions.length],
      reserve1: inRecords[index % inRecords.length],
      reserve2: outRecords[index % outRecords.length],
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime: inTime - 3_600_000,
      updateTime: inTime + 2 * 3_600_000,
    };
  });
}

export function normalizeSpareStockRow(row) {
  const spareId = row.spareId ?? row.spare_id;
  const currentStock = row.currentStock ?? row.current_stock ?? 0;
  const inTime = row.inTime ?? row.in_time;
  const outTime = row.outTime ?? row.out_time;
  const warehouseId =
    row.warehouseId ?? row.warehouse_id ?? row.stationId ?? row.station_id;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const lastUpdateTime =
    row.lastUpdateTime ?? row.last_update_time ?? updateTime;

  return {
    ...row,
    id: row.id,
    spareId,
    spareName: row.spareName || row.spare_name || getSpareName(spareId),
    spareType: row.spareType || row.spare_type || getSpareType(spareId),
    currentStock: Number(currentStock),
    status:
      row.statusName ||
      row.status ||
      getStockStatusByCount(Number(currentStock)),
    warehouseId,
    warehouseName:
      row.warehouseName ||
      row.warehouse_name ||
      row.stationName ||
      row.station_name ||
      row.reserve1 || '-',
    inTime,
    inTimeStr: formatSpareTime(inTime),
    outTime,
    outTimeStr: formatSpareTime(outTime),
    lastUpdateTime,
    lastUpdateTimeStr: formatSpareTime(lastUpdateTime),
    inRecord: row.inRecord || row.in_record || row.reserve1 || '暂无入库记录',
    outRecord:
      row.outRecord || row.out_record || row.reserve2 || '暂无出库记录',
    supplier: row.supplier || row.supplier_name || '-',
    receiver: row.receiver || row.receiver_name || '-',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatSpareTime(createTime),
    updateTime,
    updateTimeStr: formatSpareTime(updateTime),
  };
}

function isInRange(value, range) {
  if (range === undefined || range === null || range === '') return true;
  const numberValue = Number(value);
  if (!Array.isArray(range)) return numberValue === Number(range);
  if (range.length !== 2 || !value) return true;
  const [min, max] = range.map(Number);
  return numberValue >= min && numberValue <= max;
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeSpareStockRow(item));
  const inTimeRange = params.inTimeRange || params.inTime;
  const outTimeRange = params.outTimeRange || params.outTime;

  return list.filter((item) => {
    const matchSpare =
      !params.spareId || Number(item.spareId) === Number(params.spareId);
    const matchSpareName =
      !params.spareName || item.spareName.includes(String(params.spareName));
    const matchStatus = isSameDictValue(
      SPARE_STOCK_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchWarehouse =
      !params.warehouseId ||
      Number(item.warehouseId) === Number(params.warehouseId);
    const matchWarehouseName =
      !params.warehouseName ||
      item.warehouseName.includes(String(params.warehouseName));
    const matchTrendTime =
      !params.trendTime ||
      item.lastUpdateTimeStr.includes(String(params.trendTime));
    const matchStock = isInRange(item.currentStock, params.currentStock);
    const matchInTime = isInRange(item.inTime, inTimeRange);
    const matchOutTime = isInRange(item.outTime, outTimeRange);

    return (
      matchSpare &&
      matchSpareName &&
      matchStatus &&
      matchWarehouse &&
      matchWarehouseName &&
      matchTrendTime &&
      matchStock &&
      matchInTime &&
      matchOutTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeSpareStockRow(item));
  const spareStock = list.reduce((sum, item) => sum + item.currentStock, 0);
  const replenishCount = list.filter((item) => item.status === '低库存').length;
  const trendData = ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
    time,
    stockCount: spareStock - (5 - index) * 4,
  }));
  const sparePool = getSpareOptionsForMock();
  const stockData = sparePool.map((spare) => ({
    spareId: spare.value,
    spareName: spare.label,
    currentStock: list
      .filter((item) => Number(item.spareId) === Number(spare.value))
      .reduce((sum, item) => sum + item.currentStock, 0),
  }));

  return {
    trendData,
    stockData,
    cardData: {
      spareStock,
      replenishCount,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'spareId',
      label: '备件名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联备件',
        options: spareOptions,
      },
    },
    // {
    //   fieldName: 'stationName',
    //   label: '所属仓库',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入所属仓库',
    //     clearable: true,
    //   },
    // },
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
    {
      fieldName: 'inTime',
      label: '入库时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useInFormSchema() {
  return [
    {
      fieldName: 'spareId',
      label: '备件名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联备件',
        options: spareOptions,
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'inCount',
      label: '入库数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入入库数量',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'supplier',
      label: '供应商',
      component: 'Input',
      componentProps: {
        placeholder: '请输入供应商',
      },
      rules: 'required',
    },
  ];
}

export function useOutFormSchema() {
  return [
    {
      fieldName: 'spareId',
      label: '备件名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联备件',
        options: spareOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'outCount',
      label: '出库数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入出库数量',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'receiver',
      label: '领用人员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入领用人员',
      },
      rules: 'required',
    },
  ];
}

export function useReplenishFormSchema() {
  return [
    {
      fieldName: 'spareName',
      label: '备件名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'replenishCount',
      label: '补货数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入补货数量',
        min: 1,
        precision: 0,
      },
      rules: 'required',
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '仓储ID', minWidth: 90, sortable: true },
    {
      field: 'spareName',
      title: '备件名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'spareName' },
    },
    // { field: 'spareType', title: '备件类型', minWidth: 110, sortable: true },
    {
      field: 'inTimeStr',
      title: '入库时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'currentStock',
      title: '当前库存',
      minWidth: 130,
      sortable: true,
      slots: { default: 'currentStock' },
    },
    {
      field: 'status',
      title: '库存状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    // {
    //   field: 'warehouseName',
    //   title: '所属仓库',
    //   minWidth: 170,
    //   sortable: true,
    //   slots: { default: 'warehouseName' },
    // },
    {
      field: 'outRecord',
      title: '出库记录',
      minWidth: 180,
      sortable: true,
      slots: { default: 'outRecord' },
    },
    {
      field: 'inRecord',
      title: '入库记录',
      minWidth: 180,
      sortable: true,
      slots: { default: 'inRecord' },
    },
    {
      field: 'lastUpdateTimeStr',
      title: '最后更新时间',
      minWidth: 180,
      sortable: true,
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
  { key: 'id', label: '仓储ID' },
  { key: 'spareName', label: '备件名称' },
  // { key: 'spareType', label: '备件类型' },
  { key: 'currentStock', label: '当前库存' },
  {
    key: 'status',
    label: '库存状态',
    type: 'tag',
    tagType: getSpareStatusTagType,
    formatter: getSpareStatusLabel,
  },
  // { key: 'warehouseName', label: '所属仓库' },
  { key: 'inTimeStr', label: '入库时间' },
  { key: 'outTimeStr', label: '出库时间' },
  { key: 'inRecord', label: '入库记录' },
  { key: 'outRecord', label: '出库记录' },
  // { key: 'supplier', label: '供应商' },
  // { key: 'receiver', label: '领用人员' },
  { key: 'lastUpdateTimeStr', label: '最后更新时间' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  inText: '备件入库',
  outText: '备件出库',
  replenishText: '备件补货',
  excelAllName: '备件仓储数据.xlsx',
  total: '备件仓储支持备件入库、备件出库、库存更新、记录同步闭环管理',
};
