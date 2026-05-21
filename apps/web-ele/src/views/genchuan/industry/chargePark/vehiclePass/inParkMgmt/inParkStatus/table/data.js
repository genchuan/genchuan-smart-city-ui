import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';
import { requestClient } from '#/api/request';

/** 获取场站列表 */
let stationOptionsCache = null;
export async function getStationOptions() {
  if (stationOptionsCache) {
    return stationOptionsCache;
  }
  try {
    const response = await requestClient.get('/vehiclepass/in-park-status/simple-list');
    if (response && response.data && Array.isArray(response.data)) {
      stationOptionsCache = response.data.map(item => ({
        label: item.stationName,
        value: item.stationId,
      }));
      return stationOptionsCache;
    }
    return [];
  } catch (error) {
    console.error('获取场站列表失败:', error);
    return [];
  }
}

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      carNo: '闽C12345',
      spaceName: 'A-01',
      stationName: '充电站1',
      inTime: 1745011815000,
      status: '正常在停',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745011815000,
      updater: '张三',
      updateTime: 1745011815000,
    },
    {
      id: '002',
      carNo: '闽C67890',
      spaceName: 'A-02',
      stationName: '充电站1',
      inTime: 1745015730000,
      status: '超时长在停',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745015730000,
      updater: '李四',
      updateTime: 1745015730000,
    },
    {
      id: '003',
      carNo: '闽C11111',
      spaceName: 'A-03',
      stationName: '充电站1',
      inTime: 1745020845000,
      status: '异常状态',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745020845000,
      updater: '王五',
      updateTime: 1745020845000,
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'carNo',
      label: '车牌号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      fieldName: 'spaceName',
      label: '车位名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位名称',
      },
    },
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常在停', value: '正常在停' },
          { label: '超时长在停', value: '超时长在停' },
          { label: '异常状态', value: '异常状态' },
        ],
      },
    },
    {
      fieldName: 'inTimeRange',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: '请选择入场时间范围',
        rangeSeparator: '至',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'updateTimeRange',
      label: '更新时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: '请选择更新时间范围',
        rangeSeparator: '至',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        valueFormat: 'x',
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: 'ID',
      minWidth: 80,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'carNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'carNo' },
    },
    {
      field: 'spaceName',
      title: '车位',
      minWidth: 120,
      sortable: true,
      slots: { default: 'spaceName' },
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 120,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'inTime',
      title: '入场时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'parkDuration',
      title: '在停时长',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parkDuration' },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '最后更新时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'updateTime',
      title: '异常标记时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑在停状态',
  addText: '新增在停状态',
  excelName: '在停状态列表',
  excelAllName: '在停状态导出.xlsx',
  total: '总计: 记录3条; 正常在停1条; 超时长在停1条; 异常状态1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  正常在停: 'success',
  正常: 'success',
  超时长在停: 'warning',
  超时: 'warning',
  异常状态: 'danger',
  异常: 'danger',
};

/** 超时长在停阈值（分钟） */
export const OVERTIME_THRESHOLD = 120; // 2小时

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: 'ID' },
  { key: 'carNo', label: '车牌号' },
  { key: 'spaceName', label: '车位名称' },
  { key: 'stationName', label: '场站名称' },
  { key: 'inTime', label: '入场时间', formatter: formatTime },
  { key: 'status', label: '状态' },
  { key: 'remark', label: '备注' },
  {
    key: 'isCorrected',
    label: '修正记录标记',
    formatter: (val) => (val ? '已修正' : '未修正'),
  },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
];
