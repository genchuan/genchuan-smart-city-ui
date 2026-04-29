import { formatDate } from '#/utils/genchuan/formatTime';
// import { getRangePickerDefaultProps } from '#/utils';

export const reportCycleOptions = [
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '半年报', value: '半年报' },
  { label: '年报', value: '年报' },
  { label: '自定义报表', value: '自定义报表' },
];

export const reportTypeOptions = [
  { label: '自动', value: '自动' },
  { label: '自定义', value: '自定义' },
];

export const generateStatusOptions = [
  { label: '未生成', value: '未生成' },
  { label: '生成中', value: '生成中' },
  { label: '已生成', value: '已生成' },
];

export const stationOptions = [
  {
    label: '泉州丰泽充电场站',
    value: 1001,
    longitude: 118.675_324,
    latitude: 24.896_541,
    regionName: '丰泽区',
  },
  {
    label: '泉州鲤城公共停车场',
    value: 1002,
    longitude: 118.589_421,
    latitude: 24.908_356,
    regionName: '鲤城区',
  },
  {
    label: '洛江万安充停站',
    value: 1003,
    longitude: 118.673_115,
    latitude: 24.943_231,
    regionName: '洛江区',
  },
  {
    label: '晋江池店综合能源站',
    value: 1004,
    longitude: 118.564_821,
    latitude: 24.806_942,
    regionName: '晋江市',
  },
  {
    label: '石狮服装城充停站',
    value: 1005,
    longitude: 118.652_914,
    latitude: 24.731_268,
    regionName: '石狮市',
  },
  {
    label: '南安水头交通枢纽站',
    value: 1006,
    longitude: 118.389_752,
    latitude: 24.738_946,
    regionName: '南安市',
  },
];

export const metricLabelMap = {
  abnormalDeviceNum: '异常设备数',
  assetNormalNum: '资产正常数',
  inspectTaskNum: '巡检任务数',
  inspectUserOnlineNum: '巡检人员在岗数',
  normalDeviceNum: '正常设备数',
  oilHandleCompleteRate: '处置完成率',
  oilWaitHandleNum: '油车占位待处置数',
  stockWarnNum: '库存预警数',
  taskCompleteRate: '任务完成率',
};

export const metricFieldMap = {
  abnormalDeviceNum: 'abnormalDeviceNum',
  assetNormalNum: 'assetNormalNum',
  inspectTaskNum: 'inspectTaskNum',
  inspectUserOnlineNum: 'inspectUserOnlineNum',
  normalDeviceNum: 'normalDeviceNum',
  oilHandleCompleteRate: 'oilHandleCompleteRate',
  oilWaitHandleNum: 'oilWaitHandleNum',
  stockWarnNum: 'stockWarnNum',
  taskCompleteRate: 'taskCompleteRate',
};

export const detailMetricFields = [
  { key: 'normalDeviceNum', label: '正常设备数' },
  { key: 'abnormalDeviceNum', label: '异常设备数' },
  { key: 'inspectTaskNum', label: '巡检任务数' },
  { key: 'taskCompleteRate', label: '任务完成率', type: 'rate' },
  { key: 'oilWaitHandleNum', label: '油车占位待处置数' },
  { key: 'oilHandleCompleteRate', label: '处置完成率', type: 'rate' },
  { key: 'inspectUserOnlineNum', label: '巡检人员在岗数' },
  { key: 'assetNormalNum', label: '资产正常数' },
  { key: 'stockWarnNum', label: '库存预警数' },
];

export const textObj = {
  excelAllName: '周期报表.xlsx',
};

const baseTime = new Date('2026-04-22 09:00:00').getTime();

function pad(value) {
  return String(value).padStart(2, '0');
}

function toTimeText(date) {
  const value = new Date(date);
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(
    value.getDate(),
  )} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(
    value.getSeconds(),
  )}`;
}

function resolvePeriod(index, cycle) {
  const end = new Date(baseTime - index * 2 * 86_400_000);
  const start = new Date(end);

  switch (cycle) {
    case '半年报': {
      start.setMonth(end.getMonth() - 5, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);

      break;
    }
    case '周报': {
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);

      break;
    }
    case '季报': {
      start.setMonth(end.getMonth() - 2, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);

      break;
    }
    case '年报': {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);

      break;
    }
    case '日报': {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);

      break;
    }
    case '月报': {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);

      break;
    }
    default: {
      start.setDate(end.getDate() - 20 - (index % 5));
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 0);
    }
  }

  return {
    statTimeEnd: toTimeText(end),
    statTimeStart: toTimeText(start),
  };
}

export function formatReportTime(value) {
  if (!value) return '-';
  const text = String(value);
  if (/^\d{10}$/.test(text)) {
    return formatDate(Number(text) * 1000) || text;
  }
  if (/^\d{13}$/.test(text)) {
    return formatDate(Number(text)) || text;
  }
  return formatDate(value) || text;
}

export function formatRate(value) {
  const numberValue = Number(value || 0);
  if (numberValue <= 1) {
    return `${Math.round(numberValue * 100)}%`;
  }
  return `${Math.round(numberValue * 10) / 10}%`;
}

export function formatStatPeriod(start, end) {
  if (!start || !end) return '-';
  return `${start} 至 ${end}`;
}

export function getStationName(stationId) {
  return (
    stationOptions.find((item) => Number(item.value) === Number(stationId))
      ?.label || '-'
  );
}

export function getStationIdByName(stationName) {
  return stationOptions.find((item) => item.label === stationName)?.value || '';
}

export function getGenerateStatusTagType(status) {
  const tagMap = {
    未生成: 'info',
    生成中: 'warning',
    已生成: 'success',
  };
  return tagMap[status] || 'info';
}

export function getReportCycleTagType(cycle) {
  const tagMap = {
    日报: 'info',
    周报: 'primary',
    月报: 'success',
    季报: 'warning',
    半年报: 'warning',
    年报: 'danger',
    自定义报表: 'primary',
  };
  return tagMap[cycle] || 'info';
}

export function dataList() {
  return Array.from({ length: 30 }, (_, index) => {
    const cycle = reportCycleOptions[index % reportCycleOptions.length].value;
    const station = stationOptions[index % stationOptions.length];
    const { statTimeStart, statTimeEnd } = resolvePeriod(index, cycle);
    let generateStatus = '已生成';
    if (index % 9 === 0) {
      generateStatus = '生成中';
    } else if (index % 7 === 0) {
      generateStatus = '未生成';
    }

    const abnormalDeviceNum = 4 + (index % 6);
    const inspectTaskNum = 180 + index * 6;
    const oilWaitHandleNum = 6 + (index % 5);
    const stockWarnNum = 3 + (index % 4);

    return {
      id: index + 1,
      reportCycle: cycle,
      reportType: cycle === '自定义报表' ? '自定义' : '自动',
      statTimeStart,
      statTimeEnd,
      statTime: formatStatPeriod(statTimeStart, statTimeEnd),
      normalDeviceNum: 132 + index * 3,
      abnormalDeviceNum,
      inspectTaskNum,
      taskCompleteRate: Number((0.89 + (index % 5) * 0.015).toFixed(2)),
      oilWaitHandleNum,
      oilHandleCompleteRate: Number((0.84 + (index % 6) * 0.02).toFixed(2)),
      inspectUserOnlineNum: 18 + (index % 7),
      assetNormalNum: 260 + index * 4,
      stockWarnNum,
      stationId: station.value,
      stationName: station.label,
      generateStatus,
      generateTime: baseTime - index * 8 * 3_600_000,
      operator: index % 3 === 0 ? 'system' : `operator${(index % 4) + 1}`,
      exportCount: index % 6,
      yearOnYearData: `同比${index % 2 === 0 ? '增长' : '下降'} ${4 + (index % 6)}.${index % 10}%`,
      chainRatioData: `环比${index % 3 === 0 ? '增长' : '下降'} ${2 + (index % 5)}.${(index + 3) % 10}%`,
      createTime: baseTime - index * 8 * 3_600_000,
      updateTime: baseTime - index * 7 * 3_600_000,
    };
  });
}

export function normalizeCycleReportRow(row) {
  const statTimeStart = row.statTimeStart ?? row.stat_time_start;
  const statTimeEnd = row.statTimeEnd ?? row.stat_time_end;
  const generateTime = row.generateTime ?? row.generate_time;
  const createTime = row.createTime ?? row.create_time;
  const updateTime = row.updateTime ?? row.update_time;
  const stationId = row.stationId ?? row.station_id;

  return {
    ...row,
    id: row.id,
    reportCycle: row.reportCycle || row.report_cycle || '月报',
    reportType: row.reportType || row.report_type || '自动',
    statTimeStart,
    statTimeEnd,
    statTime:
      row.statTime ||
      row.stat_time ||
      formatStatPeriod(statTimeStart, statTimeEnd),
    normalDeviceNum: Number(row.normalDeviceNum ?? row.normal_device_num ?? 0),
    abnormalDeviceNum: Number(
      row.abnormalDeviceNum ?? row.abnormal_device_num ?? 0,
    ),
    inspectTaskNum: Number(row.inspectTaskNum ?? row.inspect_task_num ?? 0),
    taskCompleteRate: Number(
      row.taskCompleteRate ?? row.task_complete_rate ?? 0,
    ),
    oilWaitHandleNum: Number(
      row.oilWaitHandleNum ?? row.oil_wait_handle_num ?? 0,
    ),
    oilHandleCompleteRate: Number(
      row.oilHandleCompleteRate ?? row.oil_handle_complete_rate ?? 0,
    ),
    inspectUserOnlineNum: Number(
      row.inspectUserOnlineNum ?? row.inspect_user_online_num ?? 0,
    ),
    assetNormalNum: Number(row.assetNormalNum ?? row.asset_normal_num ?? 0),
    stockWarnNum: Number(row.stockWarnNum ?? row.stock_warn_num ?? 0),
    stationId,
    stationName:
      row.stationName || row.station_name || getStationName(stationId),
    generateStatus: row.generateStatus || row.generate_status || '未生成',
    generateTime,
    generateTimeStr: formatReportTime(generateTime),
    operator: row.operator || row.createUser || row.create_user || '-',
    exportCount: Number(row.exportCount ?? row.export_count ?? 0),
    yearOnYearData: row.yearOnYearData || row.year_on_year_data || '-',
    chainRatioData: row.chainRatioData || row.chain_ratio_data || '-',
    createTime,
    createTimeStr: formatReportTime(createTime),
    updateTime,
    updateTimeStr: formatReportTime(updateTime),
  };
}

function isInRange(value, range) {
  if (!Array.isArray(range) || range.length !== 2 || !value) return true;
  return Number(value) >= Number(range[0]) && Number(value) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const list = dataList().map((item) => normalizeCycleReportRow(item));
  const statTimeRange = params.statTimeRange || params.timeRange;

  return list.filter((item) => {
    const matchCycle =
      !params.reportCycle || item.reportCycle === params.reportCycle;
    const matchStation =
      !params.stationId || Number(item.stationId) === Number(params.stationId);
    const matchStatus =
      !params.generateStatus || item.generateStatus === params.generateStatus;
    const matchRange = isInRange(item.generateTime, statTimeRange);
    const matchTrend =
      !params.trendTime || item.statTime.includes(String(params.trendTime));

    return (
      matchCycle && matchStation && matchStatus && matchRange && matchTrend
    );
  });
}

export function getMockChartData() {
  const list = dataList().map((item) => normalizeCycleReportRow(item));
  const baseRow =
    list.find(
      (item) => item.reportCycle === '月报' && item.generateStatus === '已生成',
    ) || list[0];

  return {
    cardData: {
      abnormalDeviceNum: baseRow?.abnormalDeviceNum ?? 0,
      assetNormalNum: baseRow?.assetNormalNum ?? 0,
      inspectTaskNum: baseRow?.inspectTaskNum ?? 0,
      inspectUserOnlineNum: baseRow?.inspectUserOnlineNum ?? 0,
      normalDeviceNum: baseRow?.normalDeviceNum ?? 0,
      oilHandleCompleteRate: baseRow?.oilHandleCompleteRate ?? 0,
      oilWaitHandleNum: baseRow?.oilWaitHandleNum ?? 0,
      stockWarnNum: baseRow?.stockWarnNum ?? 0,
      taskCompleteRate: baseRow?.taskCompleteRate ?? 0,
    },
    mapData: stationOptions.map((station, index) => ({
      id: station.value,
      stationName: station.label,
      regionName: station.regionName,
      longitude: station.longitude,
      latitude: station.latitude,
      deviceStatus: index % 3 === 0 ? '异常设备' : '正常设备',
      userOnlineStatus: '人员在岗',
      abnormalDeviceNum: 4 + index,
      inspectUserOnlineNum: 16 + index,
    })),
    barData: stationOptions.map((station, index) => ({
      stationName: station.label,
      abnormalDeviceNum: 5 + index,
      taskTypeNum: 48 + index * 5,
      oilOccupyNum: 4 + (index % 4),
    })),
    lineData: Array.from({ length: 7 }, (_, index) => ({
      date: `04-${pad(index + 16)}`,
      deviceUpdateNum: 132 + index * 8,
      taskHandleTime: Number((1.1 + index * 0.08).toFixed(2)),
      reportNum: 12 + index * 2,
    })),
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'reportCycle',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        clearable: true,
        options: reportCycleOptions,
      },
    },
    {
      fieldName: 'stationId',
      label: '所属场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属场站',
        clearable: true,
        options: stationOptions,
      },
    },
    {
      fieldName: 'generateStatus',
      label: '生成状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择生成状态',
        clearable: true,
        options: generateStatusOptions,
      },
    },
    {
      fieldName: 'statTimeRange',
      label: '统计时段',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择统计时段',
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

export function useGenerateFormSchema() {
  return [
    {
      fieldName: 'statTimeRange',
      label: '统计时段',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        type: 'datetimerange',
        clearable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'stationId',
      label: '所属场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属场站',
        options: stationOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'reportType',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表类型',
        options: reportTypeOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'reportCycle',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        options: reportCycleOptions,
      },
      rules: 'required',
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '报表ID', minWidth: 90, sortable: true },
    {
      field: 'reportCycle',
      title: '报表周期',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reportCycle' },
    },
    {
      field: 'statTime',
      title: '统计时段',
      minWidth: 220,
      sortable: true,
      slots: { default: 'statTime' },
    },
    {
      field: 'normalDeviceNum',
      title: '正常设备数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'normalDeviceNum' },
    },
    {
      field: 'abnormalDeviceNum',
      title: '异常设备数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'abnormalDeviceNum' },
    },
    {
      field: 'inspectTaskNum',
      title: '巡检任务数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'inspectTaskNum' },
    },
    {
      field: 'taskCompleteRate',
      title: '任务完成率',
      minWidth: 120,
      sortable: true,
      slots: { default: 'taskCompleteRate' },
    },
    {
      field: 'oilWaitHandleNum',
      title: '油车占位待处置数',
      minWidth: 150,
      sortable: true,
      slots: { default: 'oilWaitHandleNum' },
    },
    {
      field: 'oilHandleCompleteRate',
      title: '处置完成率',
      minWidth: 120,
      sortable: true,
      slots: { default: 'oilHandleCompleteRate' },
    },
    {
      field: 'inspectUserOnlineNum',
      title: '巡检人员在岗数',
      minWidth: 140,
      sortable: true,
      slots: { default: 'inspectUserOnlineNum' },
    },
    {
      field: 'assetNormalNum',
      title: '资产正常数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'assetNormalNum' },
    },
    {
      field: 'stockWarnNum',
      title: '库存预警数',
      minWidth: 120,
      sortable: true,
      slots: { default: 'stockWarnNum' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'generateStatus',
      title: '生成状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'generateStatus' },
    },
    {
      field: 'generateTimeStr',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'operator' },
    },
    {
      field: 'exportCount',
      title: '导出次数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'yearOnYearData',
      title: '同比数据',
      minWidth: 160,
      sortable: true,
      slots: { default: 'yearOnYearData' },
    },
    {
      field: 'chainRatioData',
      title: '环比数据',
      minWidth: 160,
      sortable: true,
      slots: { default: 'chainRatioData' },
    },
    {
      field: 'actions',
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
