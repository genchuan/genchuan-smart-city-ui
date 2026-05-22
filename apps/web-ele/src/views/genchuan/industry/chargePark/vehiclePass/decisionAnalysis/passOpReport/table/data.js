import { requestClient } from '#/api/request';
import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 获取场站列表 */
let stationOptionsCache = null;
export async function getStationOptions() {
  if (stationOptionsCache) {
    return stationOptionsCache;
  }
  try {
    const response = await requestClient.get('/vehiclepass/in-park-status/simple-list');
    if (response && Array.isArray(response)) {
      stationOptionsCache = response.map(item => ({
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

/** 获取报表周期Tag类型 */
export const getReportCycleTagType = (cycle) => {
  const cycleTypeMap = {
    日报: 'info',
    周报: 'success',
    月报: 'primary',
    季报: 'warning',
    半年报: 'danger',
    年报: 'danger',
    自定义报表: 'info',
  };
  return cycleTypeMap[cycle] || 'info';
};

/** 获取生成状态Tag类型 */
export const getGenerateStatusTagType = (status) => {
  const statusMap = {
    已生成: 'success',
    生成中: 'warning',
    生成失败: 'danger',
  };
  return statusMap[status] || 'info';
};

/** 模块表格初始数据 - 车辆通行周期报表 */
export const dataList = () => {
  return [
    // 日报数据

    {
      id: 9,
      reportCycle: '日报',
      statStartTime: '2026-05-06 00:00:00',
      statEndTime: '2026-05-06 23:59:59',
      stationId: 2,
      stationName: '龙文区碧湖公园停车场',
      enterCount: 256,
      leaveCount: 248,
      parkingCount: 8,
      identifySuccessRate: 97.2,
      checkSuccessRate: 95.6,
      abnormalHandleRate: 89.8,
      etcPassSuccessRate: 86.4,
      reportStatus: '已生成',
      createTime: '2026-05-07 00:05:15',
      createCost: 10,
      updateTime: '2026-05-07 00:05:15',
      creator: '系统自动',
      isCorrected: false,
      remark: '自动生成日报',
    },
    {
      id: 2,
      reportCycle: '日报',
      statStartTime: '2026-05-07 00:00:00',
      statEndTime: '2026-05-07 23:59:59',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 342,
      leaveCount: 338,
      parkingCount: 4,
      identifySuccessRate: 97.8,
      checkSuccessRate: 95.2,
      abnormalHandleRate: 90.5,
      etcPassSuccessRate: 87.3,
      reportStatus: '已生成',
      createTime: '2026-05-08 00:05:18',
      createCost: 15,
      updateTime: '2026-05-08 00:05:18',
      creator: '系统自动',
      isCorrected: false,
      remark: '自动生成日报',
    },
    // 周报数据
    {
      id: 3,
      reportCycle: '周报',
      statStartTime: '2026-05-05 00:00:00',
      statEndTime: '2026-05-11 23:59:59',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 2285,
      leaveCount: 2268,
      parkingCount: 17,
      identifySuccessRate: 98.2,
      checkSuccessRate: 96.5,
      abnormalHandleRate: 91.8,
      etcPassSuccessRate: 88.9,
      reportStatus: '已生成',
      createTime: '2026-05-12 01:15:32',
      createCost: 45,
      updateTime: '2026-05-12 01:15:32',
      creator: '系统自动',
      isCorrected: false,
      remark: '自动生成周报',
    },
    // 月报数据
    {
      id: 4,
      reportCycle: '月报',
      statStartTime: '2026-05-01 00:00:00',
      statEndTime: '2026-05-31 23:59:59',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 9856,
      leaveCount: 9823,
      parkingCount: 33,
      identifySuccessRate: 98.3,
      checkSuccessRate: 96.7,
      abnormalHandleRate: 92.1,
      etcPassSuccessRate: 89.2,
      reportStatus: '生成中',
      createTime: '2026-05-08 10:30:00',
      createCost: 0,
      updateTime: '2026-05-08 10:30:00',
      creator: '系统自动',
      isCorrected: false,
      remark: '月报生成中',
    },
    // 季报数据
    {
      id: 5,
      reportCycle: '季报',
      statStartTime: '2026-01-01 00:00:00',
      statEndTime: '2026-03-31 23:59:59',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 29567,
      leaveCount: 29485,
      parkingCount: 82,
      identifySuccessRate: 98.0,
      checkSuccessRate: 96.3,
      abnormalHandleRate: 91.2,
      etcPassSuccessRate: 88.5,
      reportStatus: '已生成',
      createTime: '2026-04-01 03:45:28',
      createCost: 285,
      updateTime: '2026-04-01 03:45:28',
      creator: '系统自动',
      isCorrected: false,
      remark: '自动生成季报',
    },
    // 半年报数据
    {
      id: 6,
      reportCycle: '半年报',
      statStartTime: '2025-07-01 00:00:00',
      statEndTime: '2025-12-31 23:59:59',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 58234,
      leaveCount: 58102,
      parkingCount: 132,
      identifySuccessRate: 97.8,
      checkSuccessRate: 96.1,
      abnormalHandleRate: 90.8,
      etcPassSuccessRate: 87.9,
      reportStatus: '已生成',
      createTime: '2026-01-01 05:25:15',
      createCost: 456,
      updateTime: '2026-01-01 05:25:15',
      creator: '系统自动',
      isCorrected: false,
      remark: '自动生成半年报',
    },
    // 年报数据
    {
      id: 7,
      reportCycle: '年报',
      statStartTime: '2025-01-01 00:00:00',
      statEndTime: '2025-12-31 23:59:59',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 115678,
      leaveCount: 115432,
      parkingCount: 246,
      identifySuccessRate: 97.9,
      checkSuccessRate: 96.2,
      abnormalHandleRate: 91.0,
      etcPassSuccessRate: 88.3,
      reportStatus: '已生成',
      createTime: '2026-01-01 08:15:42',
      createCost: 825,
      updateTime: '2026-01-01 08:15:42',
      creator: '系统自动',
      isCorrected: false,
      remark: '自动生成年报',
    },
    // 自定义报表数据
    {
      id: 8,
      reportCycle: '自定义报表',
      statStartTime: '2026-05-01 08:00:00',
      statEndTime: '2026-05-07 18:00:00',
      stationId: 1,
      stationName: '泉州丰泽充停场站',
      enterCount: 1856,
      leaveCount: 1842,
      parkingCount: 14,
      identifySuccessRate: 98.4,
      checkSuccessRate: 96.9,
      abnormalHandleRate: 92.5,
      etcPassSuccessRate: 89.3,
      reportStatus: '已生成',
      createTime: '2026-05-07 15:32:18',
      createCost: 28,
      updateTime: '2026-05-07 15:32:18',
      creator: '张三',
      isCorrected: false,
      remark: '工作日高峰时段分析',
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'reportCycle',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        options: [
          { label: '日报', value: '日报' },
          { label: '周报', value: '周报' },
          { label: '月报', value: '月报' },
          { label: '季报', value: '季报' },
          { label: '半年报', value: '半年报' },
          { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' },
        ],
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
      fieldName: 'reportStatus',
      label: '生成状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择生成状态',
        options: [
          { label: '已生成', value: '已生成' },
          { label: '生成中', value: '生成中' },
          { label: '生成失败', value: '生成失败' },
        ],
      },
    },
    {
      fieldName: 'beginTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择开始时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择结束时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportCycle',
      title: '报表周期',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reportCycle' },
    },
    {
      field: 'statStartTime',
      title: '统计时段',
      minWidth: 320,
      sortable: true,
      formatter: ({ cellValue, row }) => {
        return `${row.statStartTime} ~ ${row.statEndTime}`;
      },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'enterCount',
      title: '入场量',
      minWidth: 100,
      sortable: true,
      slots: { default: 'enterCount' },
    },
    {
      field: 'leaveCount',
      title: '离场量',
      minWidth: 100,
      sortable: true,
      slots: { default: 'leaveCount' },
    },
    {
      field: 'parkingCount',
      title: '在停车辆数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parkingCount' },
    },
    {
      field: 'identifySuccessRate',
      title: '识别成功率(%)',
      minWidth: 130,
      sortable: true,
      slots: { default: 'identifySuccessRate' },
    },
    {
      field: 'checkSuccessRate',
      title: '核验成功率(%)',
      minWidth: 130,
      sortable: true,
      slots: { default: 'checkSuccessRate' },
    },
    {
      field: 'abnormalHandleRate',
      title: '异常处置率(%)',
      minWidth: 130,
      sortable: true,
      slots: { default: 'abnormalHandleRate' },
    },
    {
      field: 'etcPassSuccessRate',
      title: 'ETC通行成功率(%)',
      minWidth: 150,
      sortable: true,
      slots: { default: 'etcPassSuccessRate' },
    },
    {
      field: 'reportStatus',
      title: '报表生成状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reportStatus' },
    },
    {
      field: 'createTime',
      title: '报表生成时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'createCost',
      title: '报表生成耗时(秒)',
      minWidth: 140,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '数据更新时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'creator',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      field: 'isCorrected',
      title: '修正记录标记',
      minWidth: 120,
      sortable: true,
      slots: { default: 'correctionMark' },
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑报表',
  addText: '生成自定义报表',
  excelName: '车辆通行周期报表',
  excelAllName: '车辆通行周期报表导出.xlsx',
  total: '总计: 报表8条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'reportCycle', label: '报表周期' },
  { key: 'statStartTime', label: '统计开始时间', formatter: formatTime },
  { key: 'statEndTime', label: '统计结束时间', formatter: formatTime },
  { key: 'stationName', label: '所属场站' },
  { key: 'enterCount', label: '入场量' },
  { key: 'leaveCount', label: '离场量' },
  { key: 'parkingCount', label: '在停车辆数' },
  { key: 'identifySuccessRate', label: '识别成功率(%)' },
  { key: 'checkSuccessRate', label: '核验成功率(%)' },
  { key: 'abnormalHandleRate', label: '异常处置率(%)' },
  { key: 'etcPassSuccessRate', label: 'ETC通行成功率(%)' },
  { key: 'reportStatus', label: '报表生成状态' },
  { key: 'createTime', label: '报表生成时间', formatter: formatTime },
  { key: 'createCost', label: '报表生成耗时(秒)' },
  { key: 'updateTime', label: '数据更新时间', formatter: formatTime },
  { key: 'creator', label: '操作人' },
  {
    key: 'isCorrected',
    label: '修正记录标记',
    formatter: (val) => (val ? '已修正' : '未修正'),
  },
  { key: 'remark', label: '备注' },
];

/** 生成报表表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'reportCycle',
      label: '报表周期',
      component: 'Select',
      required: true,
      componentProps: {
        placeholder: '请选择报表周期',
        options: [
          { label: '日报', value: '日报' },
          { label: '周报', value: '周报' },
          { label: '月报', value: '月报' },
          { label: '季报', value: '季报' },
          { label: '半年报', value: '半年报' },
          { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' },
        ],
      },
    },
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      required: true,
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
    },
    {
      fieldName: 'statStartTime',
      label: '统计开始时间',
      component: 'DatePicker',
      required: true,
      componentProps: {
        type: 'datetime',
        placeholder: '请选择统计开始时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'statEndTime',
      label: '统计结束时间',
      component: 'DatePicker',
      required: true,
      componentProps: {
        type: 'datetime',
        placeholder: '请选择统计结束时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注信息',
        rows: 3,
      },
    },
  ];
}
