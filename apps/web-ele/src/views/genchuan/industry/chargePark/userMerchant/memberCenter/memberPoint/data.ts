import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberPointChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberPoint';

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

export function formatChangeAmount(value?: number | string) {
  const amount = Number(value ?? 0);
  return amount > 0 ? `+${amount}` : String(amount);
}

export function getChangeAmountTagType(value?: number | string) {
  return Number(value ?? 0) >= 0 ? 'primary' : 'danger';
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

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'userId',
      label: '用户',
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
      label: '变动金额',
      component: 'InputNumber',
      componentProps: {
        precision: 0,
        placeholder: '请输入变动金额',
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
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
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
      title: '积分 ID',
      minWidth: 100,
    },
    {
      field: 'userName',
      title: '用户',
      minWidth: 150,
      slots: {
        default: 'user',
      },
    },
    {
      field: 'changeAmount',
      title: '变动金额',
      minWidth: 120,
      slots: {
        default: 'changeAmount',
      },
    },
    {
      field: 'changeType',
      title: '变动类型',
      minWidth: 100,
      slots: {
        default: 'changeType',
      },
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
      title: '状态',
      minWidth: 100,
      slots: {
        default: 'status',
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
  { key: 'id', label: '积分 ID' },
  { key: 'userName', label: '用户' },
  { key: 'title', label: '积分标题' },
  { key: 'changeAmount', label: '变动金额' },
  { key: 'totalPoint', label: '变动后总积分' },
  { key: 'changeType', label: '变动类型', formatter: formatChangeType },
  { key: 'changeReason', label: '变动原因' },
  {
    key: 'status',
    label: '状态',
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
