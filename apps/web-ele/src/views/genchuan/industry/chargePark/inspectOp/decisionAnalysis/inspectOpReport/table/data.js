import { getRangePickerDefaultProps } from '#/utils';
import { formatLocalDateTime } from '#/views/genchuan/industry/chargePark/inspectOp/utils/formatLocalDateTime';

export const reportTypeOptions = [
  { label: '日报', value: '日报' },
  { label: '周报', value: '周报' },
  { label: '月报', value: '月报' },
  { label: '季报', value: '季报' },
  { label: '半年报', value: '半年报' },
  { label: '年报', value: '年报' },
  { label: '自定义报表', value: '自定义报表' },
];

export const timeScaleOptions = [...reportTypeOptions];

export const reportStatusOptions = [
  { label: '已生成', value: '已生成' },
  { label: '生成中', value: '生成中' },
  { label: '生成失败', value: '生成失败' },
];

export const metricOptions = [
  { key: 'taskFinishRate', label: '任务完成率' },
  { key: 'reportProcessRate', label: '报表处理率' },
  { key: 'alarmHandleRate', label: '告警处置率' },
  { key: 'inspectEfficiency', label: '巡检效率' },
];

export const taskTypeOptions = [
  { label: '设备巡检', value: '设备巡检' },
  { label: '占位处置', value: '占位处置' },
  { label: '工单跟进', value: '工单跟进' },
  { label: '告警核查', value: '告警核查' },
  { label: '其他', value: '其他' },
];

const baseTime = new Date('2026-04-01 08:00:00').getTime();

export function formatReportTime(value) {
  if (!value) return '-';
  const text = String(value);
  return formatLocalDateTime(value) || text;
}

function toDate(offset) {
  const date = new Date(baseTime - offset * 86_400_000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return [year, month, day].join('-');
}

function getReportPeriod(type, index) {
  if (type === '日报') return toDate(index);
  if (type === '周报')
    return `2026-W${String(14 - (index % 8)).padStart(2, '0')}`;
  if (type === '月报')
    return `2026-${String(4 - (index % 4) || 12).padStart(2, '0')}`;
  if (type === '季报') return `2026-Q${1 + (index % 4)}`;
  if (type === '半年报') return `2026-H${1 + (index % 2)}`;
  if (type === '年报') return String(2026 - (index % 3));
  return `${toDate(index + 2)} ? ${toDate(index)}`;
}

export function getReportStatusTagType(status) {
  const tagMap = {
    已生成: 'success',
    生成中: 'warning',
    生成失败: 'danger',
  };
  return tagMap[status] || 'info';
}

export function getReportTypeTagType(type) {
  const tagMap = {
    日报: 'info',
    周报: 'primary',
    月报: 'success',
    季报: 'warning',
    半年报: 'warning',
    年报: 'danger',
    自定义报表: 'primary',
  };
  return tagMap[type] || 'info';
}

export function formatRate(value) {
  const numberValue = Number(value || 0);
  if (numberValue <= 1) return `${String(Math.round(numberValue * 100))}%`;
  return `${String(Math.round(numberValue))}%`;
}

export function dataList() {
  return Array.from({ length: 28 }, (_, index) => {
    const reportType =
      reportTypeOptions[index % reportTypeOptions.length].value;
    const createTime = baseTime - index * 6 * 3_600_000;
    let status = '已生成';
    if (index % 11 === 0) {
      status = '生成失败';
    } else if (index % 5 === 0) {
      status = '生成中';
    }
    const taskCount = 56 + index * 3;
    const reportCount = 24 + index;
    const alarmCount = 8 + (index % 6);
    const inspectMileage = Number((96 + index * 4.8).toFixed(1));

    return {
      id: index + 1,
      reportType,
      timeScale: reportType,
      reportTime: getReportPeriod(reportType, index),
      reportStatus: status,
      createTime,
      creator: index % 4 === 0 ? 'system' : `operator${(index % 3) + 1}`,
      taskCount,
      taskFinishRate: Number((0.78 + (index % 8) * 0.02).toFixed(2)),
      reportCount,
      reportProcessRate: Number((0.76 + (index % 6) * 0.025).toFixed(2)),
      alarmCount,
      alarmHandleRate: Number((0.82 + (index % 7) * 0.018).toFixed(2)),
      deviceNormalRate: Number((0.88 + (index % 5) * 0.015).toFixed(2)),
      inspectEfficiency: Number((0.84 + (index % 5) * 0.02).toFixed(2)),
      inspectMileage,
      taskType: taskTypeOptions[index % taskTypeOptions.length].value,
      filterCondition:
        reportType === '自定义报表'
          ? `报表类型=${reportType}?统计周期=${getReportPeriod(reportType, index)}`
          : '全部',
      analysisSummary: `同比+${4 + (index % 6)}%?环比+${2 + (index % 4)}%`,
    };
  });
}

export function normalizeInspectOpReportRow(row) {
  const reportType = row.reportType || row.report_type || '月报';
  const reportTime =
    row.reportTime || row.report_time || row.reportPeriod || row.report_period;
  const createTime = row.createTime || row.create_time;
  const reportData = row.reportData || row.report_data || row;

  return {
    ...row,
    id: row.id,
    reportType,
    timeScale: row.timeScale || row.time_scale || reportType,
    reportTime,
    reportTimeStr: reportTime || '-',
    createTime,
    createTimeStr: formatReportTime(createTime),
    reportStatus: row.reportStatus || row.report_status || '已生成',
    creator: row.creator || 'system',
    taskCount: Number(reportData.taskCount ?? row.taskCount ?? 0),
    taskFinishRate: Number(
      reportData.taskFinishRate ?? row.taskFinishRate ?? 0,
    ),
    reportCount: Number(reportData.reportCount ?? row.reportCount ?? 0),
    reportProcessRate: Number(
      reportData.reportProcessRate ?? row.reportProcessRate ?? 0,
    ),
    alarmCount: Number(reportData.alarmCount ?? row.alarmCount ?? 0),
    alarmHandleRate: Number(
      reportData.alarmHandleRate ?? row.alarmHandleRate ?? 0,
    ),
    deviceNormalRate: Number(
      reportData.deviceNormalRate ?? row.deviceNormalRate ?? 0,
    ),
    inspectEfficiency: Number(
      reportData.inspectEfficiency ?? row.inspectEfficiency ?? 0,
    ),
    inspectMileage: Number(
      reportData.inspectMileage ?? row.inspectMileage ?? 0,
    ),
    taskType: row.taskType || row.task_type || '设备巡检',
    filterCondition: row.filterCondition || row.filter_condition || '全部',
    analysisSummary: row.analysisSummary || row.analysis_summary || '-',
  };
}

function isTimeInRange(time, range) {
  if (!Array.isArray(range) || range.length !== 2 || !time) return true;
  return Number(time) >= Number(range[0]) && Number(time) <= Number(range[1]);
}

export function filterMockList(params = {}) {
  const createTimeRange = params.createTimeRange || params.timeRange;
  return dataList()
    .map((item) => normalizeInspectOpReportRow(item))
    .filter((item) => {
      const matchType =
        !params.reportType || item.reportType === params.reportType;
      const matchScale =
        !params.timeScale || item.timeScale === params.timeScale;
      const matchStatus =
        !params.reportStatus || item.reportStatus === params.reportStatus;
      const matchTime = isTimeInRange(item.createTime, createTimeRange);
      const matchTrend =
        !params.trendTime ||
        item.reportTimeStr.includes(String(params.trendTime));
      const matchTask = !params.taskType || item.taskType === params.taskType;
      return (
        matchType &&
        matchScale &&
        matchStatus &&
        matchTime &&
        matchTrend &&
        matchTask
      );
    });
}

export function getMockChartData() {
  return {
    trendData: ['01', '02', '03', '04', '05', '06'].map((time, index) => ({
      time,
      taskCount: 58 + index * 5,
      reportCount: 26 + index * 3,
      alarmCount: 8 + index,
    })),
    taskData: taskTypeOptions.map((item, index) => ({
      taskType: item.value,
      count: 18 + index * 7,
    })),
    cardData: {
      taskFinishRate: 0.86,
      reportProcessRate: 0.82,
      alarmHandleRate: 0.9,
      inspectEfficiency: 0.95,
    },
  };
}

export function useSearchFormSchema() {
  return [
    {
      fieldName: 'reportType',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表类型',
        clearable: true,
        options: reportTypeOptions,
      },
    },
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择时间尺度',
        clearable: true,
        options: timeScaleOptions,
      },
    },
    {
      fieldName: 'reportStatus',
      label: '报表状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表状态',
        clearable: true,
        options: reportStatusOptions,
      },
    },
    {
      fieldName: 'createTime',
      label: '生成时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'id', title: '报表ID', minWidth: 90, sortable: true },
    {
      field: 'reportType',
      title: '报表类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reportType' },
    },
    {
      field: 'timeScale',
      title: '时间尺度',
      minWidth: 120,
      sortable: true,
      slots: { default: 'timeScale' },
    },
    {
      field: 'reportTimeStr',
      title: '统计周期',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createTimeStr',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'reportStatus',
      title: '报表状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reportStatus' },
    },
    {
      field: 'taskCount',
      title: '统计数据',
      minWidth: 130,
      slots: { default: 'statData' },
    },
    {
      field: 'analysisSummary',
      title: '分析数据',
      minWidth: 160,
      slots: { default: 'analysisData' },
    },
    {
      field: 'filterCondition',
      title: '筛选条件',
      minWidth: 180,
      slots: { default: 'filterCondition' },
    },
    { field: 'creator', title: '创建者', minWidth: 110, sortable: true },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const detailMetricFields = [
  { key: 'taskCount', label: '运维任务数' },
  { key: 'taskFinishRate', label: '任务完成率', type: 'rate' },
  { key: 'reportCount', label: '巡检上报数' },
  { key: 'reportProcessRate', label: '报表处理率', type: 'rate' },
  { key: 'alarmCount', label: '告警数' },
  { key: 'alarmHandleRate', label: '告警处置率', type: 'rate' },
  { key: 'deviceNormalRate', label: '设备正常率', type: 'rate' },
  { key: 'inspectEfficiency', label: '巡检效率', type: 'rate' },
  { key: 'inspectMileage', label: '巡检里程(km)' },
];

export const textObj = {
  excelAllName: '运维运营报表数据.xlsx',
  total: '运维运营报表支持数据汇总、报表生成、视图展示闭环管理',
};
