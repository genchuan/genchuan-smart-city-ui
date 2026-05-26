import { ref } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getCardConfigList } from '#/api/genchuan/industry/chargePark/marketOp/cardMgmt/cardConfig';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';
import { formatDate } from '#/utils/genchuan/formatTime';

/** 获取库存状态Tag类型 - 使用封装的字典颜色工具 */
export const getStockControlStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取告警状态Tag类型 - 使用封装的字典颜色工具 */
export const getStockControlWarnStatusTagType = (warnStatus) => {
  const dict = getDictObj(
    DICT_TYPE.STOCK_CONTROL_WARN_STATUS,
    String(warnStatus),
  );
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取库存状态标签 */
export const getStockControlStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.STOCK_CONTROL_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 获取告警状态标签 */
export const getStockControlWarnStatusLabel = (warnStatus) => {
  const dict = getDictObj(
    DICT_TYPE.STOCK_CONTROL_WARN_STATUS,
    String(warnStatus),
  );
  return dict ? dict.label : warnStatus;
};

/** 卡种搜索选项 - 静态数据作为默认值 */
export const cardConfigSearchOptions = [
  { label: '日卡 - 停车专用', value: 1 },
  { label: '周卡 - 充电优惠', value: 2 },
  { label: '月卡 - 充电通用', value: 3 },
  { label: '季卡 - 充停通用', value: 4 },
  { label: '年卡 - 充停通用', value: 5 },
  { label: '日卡 - 充停通用', value: 6 },
  { label: '周卡 - 停车专用', value: 7 },
  { label: '月卡 - 停车专用', value: 8 },
];

/** 动态卡种搜索选项（从接口获取） */
export const dynamicCardConfigSearchOptions = ref([]);

/** 获取当前可用的卡种搜索选项（优先使用动态数据） */
export function getCurrentCardConfigSearchOptions() {
  return dynamicCardConfigSearchOptions.value.length > 0
    ? dynamicCardConfigSearchOptions.value
    : cardConfigSearchOptions;
}

/** 获取卡种精简列表用于搜索 */
export async function fetchCardConfigSearchOptions() {
  try {
    const res = await getCardConfigList();
    if (res && Array.isArray(res)) {
      dynamicCardConfigSearchOptions.value = res.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      return dynamicCardConfigSearchOptions.value;
    }
  } catch (error) {
    console.error('获取卡种列表失败:', error);
  }
  return cardConfigSearchOptions;
}

/** 库存管控表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      cardId: 1,
      cardName: '日卡 - 停车专用',
      currentStock: 50,
      warnThreshold: 30,
      status: '0',
      statusName: '正常库存',
      warnStatus: '0',
      warnStatusName: '未告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 5,
      replenishCount: 3,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 2,
      cardId: 2,
      cardName: '周卡 - 充电优惠',
      currentStock: 20,
      warnThreshold: 30,
      status: '1',
      statusName: '低库存',
      warnStatus: '0',
      warnStatusName: '未告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 2,
      replenishCount: 1,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 3,
      cardId: 3,
      cardName: '月卡 - 充电通用',
      currentStock: 15,
      warnThreshold: 30,
      status: '2',
      statusName: '预警库存',
      warnStatus: '1',
      warnStatusName: '已告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 8,
      replenishCount: 5,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 4,
      cardId: 4,
      cardName: '季卡 - 充停通用',
      currentStock: 80,
      warnThreshold: 20,
      status: '0',
      statusName: '正常库存',
      warnStatus: '0',
      warnStatusName: '未告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 3,
      replenishCount: 2,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 5,
      cardId: 5,
      cardName: '年卡 - 充停通用',
      currentStock: 100,
      warnThreshold: 10,
      status: '0',
      statusName: '正常库存',
      warnStatus: '0',
      warnStatusName: '未告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 1,
      replenishCount: 1,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 6,
      cardId: 1,
      cardName: '日卡 - 充停通用',
      currentStock: 25,
      warnThreshold: 30,
      status: '1',
      statusName: '低库存',
      warnStatus: '0',
      warnStatusName: '未告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 4,
      replenishCount: 2,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 7,
      cardId: 2,
      cardName: '周卡 - 停车专用',
      currentStock: 10,
      warnThreshold: 25,
      status: '2',
      statusName: '预警库存',
      warnStatus: '1',
      warnStatusName: '已告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 6,
      replenishCount: 4,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
    {
      id: 8,
      cardId: 3,
      cardName: '月卡 - 停车专用',
      currentStock: 45,
      warnThreshold: 30,
      status: '0',
      statusName: '正常库存',
      warnStatus: '0',
      warnStatusName: '未告警',
      syncTime: 1_745_104_800_000,
      allocateCount: 2,
      replenishCount: 1,
      reserve1: null,
      reserve2: null,
      creator: 'system',
      updater: 'system',
      createTime: 1_745_018_400_000,
      updateTime: 1_745_101_200_000,
    },
  ];
};

/** 库存管控表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'cardId',
      label: '卡种',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种',
        options: [
          { label: '日卡 - 停车专用', value: 1 },
          { label: '周卡 - 充电优惠', value: 2 },
          { label: '月卡 - 充电通用', value: 3 },
          { label: '季卡 - 充停通用', value: 4 },
          { label: '年卡 - 充停通用', value: 5 },
          { label: '日卡 - 充停通用', value: 6 },
          { label: '周卡 - 停车专用', value: 7 },
          { label: '月卡 - 停车专用', value: 8 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'currentStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入当前库存',
        min: 0,
      },
      rules: 'required',
    },
    {
      fieldName: 'warnThreshold',
      label: '预警阈值',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入预警阈值',
        min: 0,
      },
      rules: 'required',
    },
  ];
}

/** 库存管控搜索表单配置 - 根据StockControlPageReqVO参数配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'cardId',
      label: '卡种',
      component: 'Select',
      componentProps: {
        placeholder: '请选择卡种',
        options: cardConfigSearchOptions,
        clearable: true,
        filterable: true,
      },
    },
    {
      fieldName: 'status',
      label: '库存状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择库存状态',
        options: getDictOptions(DICT_TYPE.STOCK_CONTROL_STATUS, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'warnStatus',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警状态',
        options: getDictOptions(DICT_TYPE.STOCK_CONTROL_WARN_STATUS, 'string'),
        clearable: true,
      },
    },
  ];
}

/** 库存管控表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'cardName',
      title: '卡种名称',
      minWidth: 180,
      sortable: true,
      slots: { default: 'cardName' },
    },
    {
      field: 'currentStock',
      title: '当前库存',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'warnThreshold',
      title: '预警阈值',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'statusName',
      title: '库存状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'statusName' },
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'updateTime' },
    },
    {
      field: 'allocateLog',
      title: '调配记录',
      minWidth: 80,
      sortable: true,
      slots: { default: 'allocateLog' },
    },
    {
      field: 'replenishLog',
      title: '补货记录',
      minWidth: 80,
      sortable: true,
      slots: { default: 'replenishLog' },
    },
    {
      field: 'warnStatusName',
      title: '告警状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'warnStatusName' },
    },
    {
      field: 'createTime',
      title: '生成时间',
      minWidth: 120,
      sortable: true,
      slots: { default: 'createTime' },
    },

    {
      field: 'syncTime',
      title: '同步时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'syncTime' },
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑库存管控',
  addText: '新增库存管控',
  excelName: '库存管控列表',
  excelAllName: '库存管控数据.xlsx',
  total: ' 总计: 库存管控数量8;正常库存:4;低库存:2;预警库存:2',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'cardName', label: '卡种名称' },
  { key: 'currentStock', label: '当前库存' },
  { key: 'warnThreshold', label: '预警阈值' },
  {
    key: 'status',
    label: '库存状态',
    type: 'tag',
    formatter: (value) => getStockControlStatusLabel(value),
    tagType: (value) => getStockControlStatusTagType(value),
  },
  {
    key: 'warnStatus',
    label: '告警状态',
    type: 'tag',
    formatter: (value) => getStockControlWarnStatusLabel(value),
    tagType: (value) => getStockControlWarnStatusTagType(value),
  },
  {
    key: 'syncTime',
    label: '同步时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '-',
  },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  {
    key: 'createTime',
    label: '创建时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
  {
    key: 'updateTime',
    label: '更新时间',
    formatter: (value) =>
      value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '',
  },
];

/** 解析记录日志 JSON 字符串，返回记录数量 */
export function parseLogCount(logString) {
  if (!logString || typeof logString !== 'string') return 0;
  try {
    const logs = JSON.parse(logString);
    return Array.isArray(logs) ? logs.length : 0;
  } catch (error) {
    console.error('解析日志JSON失败:', error);
    return 0;
  }
}

/** 解析记录日志 JSON 字符串，返回记录数组 */
export function parseLogList(logString) {
  if (!logString || typeof logString !== 'string') return [];
  try {
    const logs = JSON.parse(logString);
    return Array.isArray(logs) ? logs : [];
  } catch (error) {
    console.error('解析日志JSON失败:', error);
    return [];
  }
}
