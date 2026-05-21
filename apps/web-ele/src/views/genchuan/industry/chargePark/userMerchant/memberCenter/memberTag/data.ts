import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberTagChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberTag';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

import {
  formatDateTimeValue,
  formatNormalStatus,
  getNormalStatusTagType,
  normalStatusOptions,
  STATUS_ENABLED,
} from '../utils';

export function buildStatsDataFromApi(data?: Partial<MemberTagChartVO>) {
  const distribution = Array.isArray(data?.tagDistribution)
    ? data.tagDistribution
    : [];

  return {
    cards: [
      {
        title: '标签数',
        value: Number(data?.tagCount ?? 0),
        desc: '当前会员标签总数',
        color: '#2F80ED',
      },
      {
        title: '标签用户数',
        value: Number(data?.tagUserCount ?? 0),
        desc: '至少绑定一个标签的会员数',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '标签分布',
        type: 'pie',
        data: distribution.map((item) => ({
          name: item.type || '未命名标签',
          value: Number(item.count ?? 0),
        })),
      },
    ],
  };
}

function renderStatus(status?: number | string) {
  return h(
    ElTag,
    {
      type: getNormalStatusTagType(status),
    },
    () => formatNormalStatus(status),
  );
}

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '标签名称',
      componentProps: {
        placeholder: '请输入标签名称',
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '标签描述',
      componentProps: {
        placeholder: '请输入标签描述',
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: normalStatusOptions,
      },
      rules: z.number().default(STATUS_ENABLED),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '标签名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入标签名称',
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: normalStatusOptions,
        placeholder: '请选择状态',
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        placeholder: ['开始日期', '结束日期'],
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '标签编号',
      minWidth: 100,
    },
    {
      field: 'name',
      title: '标签名称',
      minWidth: 160,
    },
    {
      field: 'description',
      title: '标签描述',
      minWidth: 220,
      showOverflow: 'tooltip',
      formatter: ({ cellValue }) => cellValue || '-',
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      slots: {
        default: ({ row }) => renderStatus(row.status),
      },
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const memberTagDetailFields = [
  { key: 'id', label: '标签编号' },
  { key: 'name', label: '标签名称' },
  { key: 'description', label: '标签描述' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: getNormalStatusTagType,
    formatter: formatNormalStatus,
  },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatDateTimeValue },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTimeValue },
];
