import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberPointChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { getRangePickerDefaultProps } from '#/utils';

import {
  formatDateTimeValue,
  formatRecordStatus,
  getRecordStatusTagType,
  recordStatusOptions,
} from '../utils';

export const changeTypeOptions = [
  { label: '获取', value: 1 },
  { label: '消耗', value: 2 },
];

export function formatChangeType(value?: number | string) {
  const type = Number(value);
  if (type === 1) {
    return '获取';
  }
  if (type === 2) {
    return '消耗';
  }
  return '-';
}

export function isAbnormalRecord(status?: number | string) {
  return Number(status) === 0;
}

export function buildStatsDataFromApi(data?: Partial<MemberPointChartVO>) {
  const trend = Array.isArray(data?.pointTrend) ? data.pointTrend : [];

  return {
    cards: [
      {
        title: '总积分',
        value: Number(data?.totalPoint ?? 0),
        desc: '所有会员当前积分总和',
        color: '#2F80ED',
      },
      {
        title: '积分变动量',
        value: Number(data?.pointChangeCount ?? 0),
        desc: '近 30 天积分净变动量',
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '积分趋势',
        type: 'line',
        xAxis: trend.map((item) => item.date),
        series: trend.map((item) => Number(item.count ?? 0)),
      },
    ],
  };
}

function renderChangeAmount(value?: number | string) {
  const amount = Number(value ?? 0);

  return h(
    ElTag,
    {
      type: amount >= 0 ? 'primary' : 'danger',
    },
    () => (amount > 0 ? `+${amount}` : String(amount)),
  );
}

function renderStatus(status?: number | string) {
  return h(
    ElTag,
    {
      type: getRecordStatusTagType(status),
    },
    () => formatRecordStatus(status),
  );
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'userId',
      label: '用户编号',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        precision: 0,
        placeholder: '请输入用户编号',
        controlsPosition: 'right',
        clearable: true,
        class: '!w-full',
      },
    },
    {
      fieldName: 'changeAmount',
      label: '变动积分',
      component: 'InputNumber',
      componentProps: {
        precision: 0,
        placeholder: '请输入变动积分',
        controlsPosition: 'right',
        clearable: true,
        class: '!w-full',
      },
    },
    {
      fieldName: 'changeType',
      label: '变动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择变动类型',
        clearable: true,
        options: changeTypeOptions,
      },
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        clearable: true,
        options: recordStatusOptions,
      },
    },
    {
      fieldName: 'createTime',
      label: '时间范围',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        clearable: true,
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '记录编号',
      minWidth: 100,
    },
    {
      field: 'userId',
      title: '用户编号',
      minWidth: 100,
    },
    {
      field: 'title',
      title: '积分标题',
      minWidth: 160,
      formatter: ({ cellValue }) => cellValue || '-',
    },
    {
      field: 'changeAmount',
      title: '变动积分',
      minWidth: 120,
      slots: {
        default: ({ row }) => renderChangeAmount(row.changeAmount),
      },
    },
    {
      field: 'totalPoint',
      title: '变动后总积分',
      minWidth: 130,
      formatter: ({ cellValue }) => Number(cellValue ?? 0),
    },
    {
      field: 'changeType',
      title: '变动类型',
      minWidth: 100,
      formatter: ({ cellValue }) => formatChangeType(cellValue),
    },
    {
      field: 'changeReason',
      title: '变动原因',
      minWidth: 180,
      showOverflow: 'tooltip',
      formatter: ({ cellValue }) => cellValue || '-',
    },
    {
      field: 'status',
      title: '记录状态',
      minWidth: 110,
      slots: {
        default: ({ row }) => renderStatus(row.status),
      },
    },
    {
      field: 'createTime',
      title: '变动时间',
      minWidth: 180,
      formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const memberPointDetailFields = [
  { key: 'id', label: '记录编号' },
  { key: 'userId', label: '用户编号' },
  { key: 'title', label: '积分标题' },
  { key: 'changeAmount', label: '变动积分' },
  { key: 'totalPoint', label: '变动后总积分' },
  { key: 'changeType', label: '变动类型', formatter: formatChangeType },
  { key: 'changeReason', label: '变动原因' },
  {
    key: 'status',
    label: '记录状态',
    type: 'tag',
    tagType: getRecordStatusTagType,
    formatter: formatRecordStatus,
  },
  { key: 'bizId', label: '业务编码' },
  { key: 'bizType', label: '业务类型' },
  { key: 'description', label: '积分描述' },
  { key: 'checkResult', label: '核查结果' },
  { key: 'checkBy', label: '核查人' },
  { key: 'checkTime', label: '核查时间', formatter: formatDateTimeValue },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '变动时间', formatter: formatDateTimeValue },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTimeValue },
];
