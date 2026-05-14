import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getRangePickerDefaultProps } from '#/utils';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const ASSET_INFO_TYPE_DICT = DICT_TYPE.ASSET_INFO_TYPE;
export const ASSET_INFO_STATUS_DICT = DICT_TYPE.ASSET_INFO_STATUS;

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

export function getAssetTypeLabel(value) {
  return getDictLabel(ASSET_INFO_TYPE_DICT, value);
}

export function isAssetTypeLabel(value, label) {
  return isDictLabel(ASSET_INFO_TYPE_DICT, value, label);
}

export function getAssetStatusLabel(value) {
  return getDictLabel(ASSET_INFO_STATUS_DICT, value);
}

export function isAssetStatusLabel(value, label) {
  return isDictLabel(ASSET_INFO_STATUS_DICT, value, label);
}
export const assetTypeOptions = getDictOptions(ASSET_INFO_TYPE_DICT, 'string');

export const assetStatusOptions = getDictOptions(
  ASSET_INFO_STATUS_DICT,
  'string',
);

/** 按资产状态字典 label 取 value，供图表卡片筛选 */
export function getAssetInfoStatusOptionValue(label) {
  const opt = assetStatusOptions.find(
    (item) => String(item.label) === String(label),
  );
  return opt != null ? opt.value : label;
}

const MOCK_ASSET_TYPE_VALUES = ['监测设备', '充电设备', '巡检工具'];
const MOCK_ASSET_STATUS_VALUES = ['正常', '禁用', '报废'];

export const stationOptions = [
  { label: '泉州丰泽充电站', value: 1 },
  { label: '鲤城公共停车场', value: 2 },
  { label: '洛江万安充停站', value: 3 },
  { label: '晋江池店综合能源站', value: 4 },
  { label: '石狮服装城充停站', value: 5 },
  { label: '南安水头交通枢纽站', value: 6 },
];

const assetNames = [
  '丰泽站车位监测摄像头',
  '鲤城停车场智能道闸',
  '洛江站交流充电桩A01',
  '晋江站直流快充终端',
  '石狮站手持巡检终端',
  '南安站消防巡检工具箱',
  '泉港站环境监测传感器',
  '惠安停车楼视频识别相机',
  '台商区共享充电柜',
  '安溪换电柜控制器',
  '永春停车场地磁检测器',
  '德化城区巡检记录仪',
];

const deviceNames = [
  '车位监测设备-01',
  '入口道闸-02',
  '交流桩-A01',
  '直流桩-D03',
  '巡检终端-P05',
  '消防工具箱-F02',
  '环境传感器-E01',
  '视频识别相机-V03',
  '共享充电柜-S01',
  '换电柜控制器-B02',
  '地磁检测器-G06',
  '巡检记录仪-R01',
];

const changeRecords = [
  '资产录入并完成初始绑定',
  '完成站点归属调整',
  '完成设备绑定并生效',
  '完成维保信息更新',
  '完成巡检责任人调整',
  '完成采购信息复核',
];

const baseTime = 1_775_011_986_000;

export function formatAssetTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

export function getStationName(stationId) {
  return (
    stationOptions.find((item) => Number(item.value) === Number(stationId))
      ?.label || '-'
  );
}

export function getAssetTypeTagType(type) {
  const tagMap = {
    监测设备: 'success',
    充电设备: 'primary',
    巡检工具: 'warning',
  };
  return getDictTagTypeFromDict(
    getDictObj(ASSET_INFO_TYPE_DICT, String(type)),
    tagMap[getAssetTypeLabel(type)] || 'info',
  );
}

export function getAssetStatusTagType(status) {
  const tagMap = {
    正常: 'success',
    禁用: 'warning',
    报废: 'danger',
  };
  return getDictTagTypeFromDict(
    getDictObj(ASSET_INFO_STATUS_DICT, String(status)),
    tagMap[getAssetStatusLabel(status)] || 'info',
  );
}

export function dataList() {
  return assetNames.map((name, index) => {
    const type = MOCK_ASSET_TYPE_VALUES[index % MOCK_ASSET_TYPE_VALUES.length];
    const status =
      MOCK_ASSET_STATUS_VALUES[index % MOCK_ASSET_STATUS_VALUES.length];
    const stationId = stationOptions[index % stationOptions.length].value;
    const purchaseTime = baseTime - index * 12 * 86_400_000;
    const effectTime = purchaseTime + 2 * 86_400_000;
    const createTime = purchaseTime + 3_600_000;

    return {
      id: index + 1,
      name,
      type,
      purchaseTime,
      status,
      stationId,
      deviceName: deviceNames[index % deviceNames.length],
      effectTime,
      changeRecord: changeRecords[index % changeRecords.length],
      reserve1: index % 2 === 0 ? '已纳入资产台账' : '',
      reserve2: index % 3 === 0 ? '需定期复核绑定关系' : '',
      creator: index % 2 === 0 ? 'admin' : 'operator',
      updater: 'system',
      createTime,
      updateTime: createTime + 2 * 3_600_000,
    };
  });
}

export function normalizeAssetInfoRow(row) {
  const purchaseTime = row.purchaseTime ?? row.purchase_time;
  const stationId = row.stationId ?? row.station_id;
  const effectTime = row.effectTime ?? row.effect_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const deviceName =
    row.deviceName ||
    row.device_name ||
    row.boundDeviceName ||
    row.bound_device_name;
  const changeRecord =
    row.changeRecord || row.change_record || row.reserve2 || '暂无变更记录';

  return {
    ...row,
    id: row.id,
    name: row.name || row.assetName || row.asset_name || '-',
    type: row.typeName || row.type || '监测设备',
    purchaseTime,
    purchaseTimeStr: formatAssetTime(purchaseTime),
    status: row.statusName || row.status || '正常',
    stationId,
    stationName:
      row.stationName || row.station_name || getStationName(stationId),
    deviceName: deviceName || '-',
    effectTime,
    effectTimeStr: formatAssetTime(effectTime),
    changeRecord,
    reserve1: row.reserve1 || '',
    reserve2: row.reserve2 || '',
    creator: row.creator || '-',
    updater: row.updater || '-',
    createTime,
    createTimeStr: formatAssetTime(createTime),
    updateTime,
    updateTimeStr: formatAssetTime(updateTime),
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeAssetInfoRow(item));
  const purchaseTimeRange = params.purchaseTimeRange || params.purchaseTime;

  return list.filter((item) => {
    const matchName = !params.name || item.name.includes(String(params.name));
    const matchType = isSameDictValue(
      ASSET_INFO_TYPE_DICT,
      item.type,
      params.type,
    );
    const matchStatus = isSameDictValue(
      ASSET_INFO_STATUS_DICT,
      item.status,
      params.status,
    );
    const matchStation =
      !params.stationId || Number(item.stationId) === Number(params.stationId);
    const matchPurchaseTime = isInRange(item.purchaseTime, purchaseTimeRange);

    return (
      matchName && matchType && matchStatus && matchStation && matchPurchaseTime
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeAssetInfoRow(item));
  const totalAsset = list.length;
  const normalAsset = list.filter((item) => item.status === '正常').length;
  const typeData = assetTypeOptions.map((option) => ({
    typeName: option.value,
    count: list.filter((item) => item.type === option.value).length,
  }));

  return {
    typeData,
    cardData: {
      totalAsset,
      normalAsset,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '资产名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入资产名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '资产类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资产类型',
        clearable: true,
        options: assetTypeOptions,
      },
    },
    {
      fieldName: 'status',
      label: '资产状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资产状态',
        clearable: true,
        options: assetStatusOptions,
      },
    },
    // {
    //   fieldName: 'stationName',
    //   label: '所属场站',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入所属场站',
    //     clearable: true,
    //     // options: stationOptions,
    //   },
    // },
    {
      fieldName: 'purchaseTime',
      label: '采购时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '资产名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入资产名称',
        maxlength: 64,
        showWordLimit: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '资产类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择资产类型',
        options: assetTypeOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'purchaseTime',
      label: '采购时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择采购时间',
        showTime: true,
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetime',
      },
    },
    // {
    //   fieldName: 'stationId',
    //   label: '所属场站',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择所属场站',
    //     options: stationOptions,
    //   },
    //   rules: 'required',
    // },
    // {
    //   fieldName: 'status',
    //   label: '资产状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择资产状态',
    //     options: assetStatusOptions,
    //   },
    //   rules: 'required',
    // }
  ];
}

export function useEditFormSchema() {
  return useFormSchema().map((item) => {
    if (['status'].includes(item.fieldName)) {
      return {
        ...item,
        componentProps: {
          ...item.componentProps,
          disabled: true,
        },
      };
    }
    return item;
  });
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '资产ID', minWidth: 90, sortable: true },
    {
      field: 'name',
      title: '资产名称',
      minWidth: 190,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'type',
      title: '资产类型',
      minWidth: 110,
      sortable: true,
      slots: { default: 'type' },
    },
    {
      field: 'purchaseTimeStr',
      title: '采购时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'status',
      title: '资产状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'status' },
    },
    // {
    //   field: 'stationName',
    //   title: '所属场站',
    //   minWidth: 180,
    //   sortable: true,
    //   slots: { default: 'stationName' },
    // },
    // {
    //   field: 'deviceName',
    //   title: '绑定设备',
    //   minWidth: 170,
    //   sortable: true,
    //   slots: { default: 'deviceName' },
    // },
    // {
    //   field: 'effectTimeStr',
    //   title: '生效时间',
    //   minWidth: 180,
    //   sortable: true,
    // },
    {
      field: 'reserve1',
      title: '报废理由',
      minWidth: 220,
      sortable: true,
      slots: { default: 'reserve1' },
    },
    {
      field: 'createTimeStr',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailFields = [
  { key: 'id', label: '资产ID' },
  { key: 'name', label: '资产名称' },
  {
    key: 'type',
    label: '资产类型',
    type: 'tag',
    tagType: getAssetTypeTagType,
    formatter: getAssetTypeLabel,
  },
  { key: 'purchaseTimeStr', label: '采购时间' },
  {
    key: 'status',
    label: '资产状态',
    type: 'tag',
    tagType: getAssetStatusTagType,
    formatter: getAssetStatusLabel,
  },
  { key: 'stationName', label: '所属场站' },
  { key: 'deviceName', label: '绑定设备' },
  { key: 'effectTimeStr', label: '生效时间' },
  // { key: 'changeRecord', label: '变更记录' },
  { key: 'reserve1', label: '报废理由' },
  // { key: 'reserve2', label: '备用字段2' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'createTimeStr', label: '创建时间' },
  { key: 'updateTimeStr', label: '更新时间' },
];

export const textObj = {
  addText: '新增资产信息',
  editText: '编辑资产信息',
  excelAllName: '资产信息数据.xlsx',
  total: '资产信息支持资产录入、资产绑定、资产生效、资产变更全生命周期管理',
};
