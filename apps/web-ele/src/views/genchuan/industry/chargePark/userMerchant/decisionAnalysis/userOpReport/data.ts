import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type {
  UserOpReportChartVO,
  UserOpReportDetailVO,
} from '#/api/genchuan/industry/chargePark/userMerchant/decisionAnalysis/userOpReport';

import dayjs from 'dayjs';

import { getRangePickerDefaultProps } from '#/utils';

export type ReportType =
  | '半年报'
  | '周报'
  | '季报'
  | '年报'
  | '日报'
  | '月报'
  | '自定义报表';

export type TimeScale = '半年' | '周' | '季' | '年' | '日' | '月' | '自定义';

export interface CoreIndex {
  avgCreditScore: number;
  totalMemberCount: number;
  totalUserCount: number;
  userGrowthRate: number;
}

export interface UserOpTrendItem {
  date: string;
  memberCount: number;
  userCount: number;
}

export interface UserTypeDistributionItem {
  count: number;
  type: string;
}

export interface UserOpReportRow {
  compareSummary: string;
  coreIndex: CoreIndex;
  createTime: string;
  creator: string;
  filterCondition: string;
  id: number;
  remark: string;
  reportType: ReportType;
  statTime: string;
  status: string;
  summary: string;
  timeScale: TimeScale;
  userOpTrend: UserOpTrendItem[];
  userTypeDistribution: UserTypeDistributionItem[];
}

export const reportTypeOptions: ReportType[] = [
  '日报',
  '周报',
  '月报',
  '季报',
  '半年报',
  '年报',
  '自定义报表',
];

export const timeScaleOptions: TimeScale[] = [
  '日',
  '周',
  '月',
  '季',
  '半年',
  '年',
  '自定义',
];

/** 格式化接口时间 */
export function formatApiTime(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const timeValue = String(value);
  if (/^\d+$/.test(timeValue)) {
    const timestamp =
      timeValue.length === 10 ? Number(timeValue) * 1000 : Number(timeValue);

    return dayjs(timestamp).isValid()
      ? dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
      : '-';
  }

  return dayjs(timeValue).isValid()
    ? dayjs(timeValue).format('YYYY-MM-DD HH:mm:ss')
    : '-';
}

/** 构建核心指标 */
function buildCoreIndex(
  data?: null | Partial<UserOpReportChartVO['coreIndex']>,
) {
  return {
    avgCreditScore: Number(data?.avgCreditScore ?? 0),
    totalMemberCount: Number(data?.totalMemberCount ?? 0),
    totalUserCount: Number(data?.totalUserCount ?? 0),
    userGrowthRate: Number(data?.userGrowthRate ?? 0),
  };
}

/** 构建趋势数据 */
function buildUserOpTrend(
  list?: null | UserOpReportChartVO['userOpTrend'],
): UserOpTrendItem[] {
  const sourceList = Array.isArray(list) ? list : [];

  return sourceList.map((item) => ({
    date: item.date || '-',
    memberCount: Number(item.memberCount ?? 0),
    userCount: Number(item.userCount ?? 0),
  }));
}

/** 构建用户类型分布 */
function buildUserTypeDistribution(
  list?: null | UserOpReportChartVO['userTypeDistribution'],
): UserTypeDistributionItem[] {
  const sourceList = Array.isArray(list) ? list : [];

  return sourceList.map((item) => ({
    count: Number(item.count ?? 0),
    type: item.type || '-',
  }));
}

/** 构建报表行数据 */
export function buildUserOpReportRowFromApi(
  data?: null | Partial<UserOpReportDetailVO>,
  fallback?: null | Partial<UserOpReportRow>,
  chartData?: null | Partial<UserOpReportChartVO>,
): UserOpReportRow {
  return {
    compareSummary:
      data?.compareSummary || fallback?.compareSummary || '暂无同比环比分析',
    coreIndex: chartData?.coreIndex
      ? buildCoreIndex(chartData.coreIndex)
      : fallback?.coreIndex || buildCoreIndex(),
    createTime: formatApiTime(data?.createTime ?? fallback?.createTime),
    creator: data?.creator || fallback?.creator || '-',
    filterCondition: data?.filterCondition || fallback?.filterCondition || '',
    id: Number(data?.id ?? fallback?.id ?? 0),
    remark: data?.remark || fallback?.remark || '',
    reportType: (data?.reportType ||
      fallback?.reportType ||
      '日报') as ReportType,
    statTime: data?.statTime || fallback?.statTime || '-',
    status: data?.status || fallback?.status || '-',
    summary: data?.summary || fallback?.summary || '暂无分析摘要',
    timeScale: (data?.timeScale || fallback?.timeScale || '日') as TimeScale,
    userOpTrend: chartData?.userOpTrend
      ? buildUserOpTrend(chartData.userOpTrend)
      : fallback?.userOpTrend || [],
    userTypeDistribution: chartData?.userTypeDistribution
      ? buildUserTypeDistribution(chartData.userTypeDistribution)
      : fallback?.userTypeDistribution || [],
  };
}

/** 构建详情统计图表 */
export function buildDetailStatsData(row?: null | UserOpReportRow) {
  if (!row) {
    return {
      cards: [],
      charts: [],
    };
  }

  return {
    cards: [
      {
        title: '用户总数',
        value: row.coreIndex.totalUserCount,
        desc: '用户核心指标',
        color: '#2F80ED',
      },
      {
        title: '会员总数',
        value: row.coreIndex.totalMemberCount,
        desc: '会员转化规模',
        color: '#27AE60',
      },
      {
        title: '平均信用分',
        value: row.coreIndex.avgCreditScore,
        desc: '用户信用表现',
        color: '#F2994A',
      },
      {
        title: '用户增长率',
        value: `${(row.coreIndex.userGrowthRate * 100).toFixed(1)}%`,
        desc: '同比 / 环比指标',
        color: '#9B51E0',
      },
    ],
    charts: [
      {
        title: '用户运营趋势',
        type: 'line',
        xAxis: row.userOpTrend.map((item) => item.date),
        series: row.userOpTrend.map((item) => item.userCount),
      },
      {
        title: '用户类型分布',
        type: 'bar',
        xAxis: row.userTypeDistribution.map((item) => item.type),
        series: row.userTypeDistribution.map((item) => item.count),
      },
    ],
  };
}

/** 构建顶部统计图表 */
export function buildStatsDataFromApi(data?: Partial<UserOpReportChartVO>) {
  return buildDetailStatsData(
    buildUserOpReportRowFromApi(
      undefined,
      {
        compareSummary: '',
        coreIndex: buildCoreIndex(),
        createTime: '',
        creator: '',
        filterCondition: '',
        id: 0,
        remark: '',
        reportType: '日报',
        statTime: '',
        status: '',
        summary: '',
        timeScale: '日',
        userOpTrend: [],
        userTypeDistribution: [],
      },
      data,
    ),
  );
}

/** 构建查询参数 */
export function buildUserOpReportQueryParams(formValues: Record<string, any>) {
  const statTime =
    Array.isArray(formValues.statTime) && formValues.statTime.length === 2
      ? `${dayjs(formValues.statTime[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(formValues.statTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
      : undefined;
  const createTime =
    Array.isArray(formValues.createTime) && formValues.createTime.length === 2
      ? `${dayjs(formValues.createTime[0]).format('YYYY-MM-DD HH:mm:ss')},${dayjs(formValues.createTime[1]).format('YYYY-MM-DD HH:mm:ss')}`
      : undefined;

  return {
    createTime,
    reportType: formValues.reportType || undefined,
    statTime,
    timeScale: formValues.timeScale || undefined,
  };
}

export function useSearchSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'reportType',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        options: reportTypeOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择报表类型',
      },
    },
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        options: timeScaleOptions.map((item) => ({
          label: item,
          value: item,
        })),
        placeholder: '请选择时间尺度',
      },
    },
    {
      fieldName: 'statTime',
      label: '统计时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions<UserOpReportRow>['columns'] {
  return [
    {
      field: 'reportType',
      title: '报表类型',
      minWidth: 120,
      slots: { default: 'reportType' },
    },
    {
      field: 'timeScale',
      title: '时间尺度',
      minWidth: 100,
    },
    {
      field: 'statTime',
      title: '统计时间',
      minWidth: 220,
    },
    {
      field: 'createTime',
      title: '生成时间',
      minWidth: 170,
    },
    {
      field: 'filterCondition',
      title: '筛选条件',
      minWidth: 240,
      slots: { default: 'filterCondition' },
    },
    {
      field: 'status',
      title: '报表状态',
      minWidth: 100,
      slots: { default: 'status' },
    },
    {
      field: 'creator',
      title: '创建者',
      minWidth: 100,
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
