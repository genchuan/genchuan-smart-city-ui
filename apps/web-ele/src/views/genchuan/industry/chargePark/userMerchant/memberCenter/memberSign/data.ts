import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberSignChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberSign';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { getRangePickerDefaultProps } from '#/utils';

import {
  formatDateTimeValue,
  formatDateValue,
  formatPercentValue,
  formatRecordStatus,
  getRecordStatusTagType,
  recordStatusOptions,
} from '../utils';

export function buildStatsDataFromApi(data?: Partial<MemberSignChartVO>) {
  const trend = Array.isArray(data?.signTrend) ? data.signTrend : [];
  const distribution = Array.isArray(data?.signUserDistribution)
    ? data.signUserDistribution
    : [];

  return {
    cards: [
      {
        title: '今日签到数',
        value: Number(data?.todaySignCount ?? 0),
        desc: '今日已签到会员数',
        color: '#2F80ED',
      },
      {
        title: '签到率',
        value: formatPercentValue(data?.signRate),
        desc: '今日签到会员占比',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '签到趋势',
        type: 'line',
        xAxis: trend.map((item) => item.date),
        series: trend.map((item) => Number(item.count ?? 0)),
      },
      {
        title: '签到用户分布',
        type: 'bar',
        xAxis: distribution.map((item) => item.type || '未分组'),
        series: distribution.map((item) => Number(item.count ?? 0)),
      },
    ],
  };
}

function renderPoint(value?: number | string) {
  const point = Number(value ?? 0);

  return h(
    ElTag,
    {
      type: point >= 0 ? 'primary' : 'danger',
    },
    () => (point > 0 ? `+${point}` : String(point)),
  );
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
      label: '签到时间',
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
      title: '签到 ID',
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
      field: 'createTime',
      title: '签到时间',
      minWidth: 180,
      formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
    },
    {
      field: 'point',
      title: '积分奖励',
      minWidth: 110,
      slots: {
        default: ({ row }) => renderPoint(row.point),
      },
    },
    {
      field: 'continuousDays',
      title: '连续签到天数',
      minWidth: 130,
      formatter: ({ cellValue }) => `第 ${Number(cellValue ?? 0)} 天`,
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
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const memberSignDetailFields = [
  { key: 'id', label: '签到编号' },
  { key: 'userId', label: '用户编号' },
  { key: 'signDate', label: '签到日期', formatter: formatDateValue },
  { key: 'continuousDays', label: '连续签到天数' },
  { key: 'point', label: '积分奖励' },
  { key: 'experience', label: '经验奖励' },
  {
    key: 'status',
    label: '记录状态',
    type: 'tag',
    tagType: getRecordStatusTagType,
    formatter: formatRecordStatus,
  },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '签到时间', formatter: formatDateTimeValue },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTimeValue },
];
