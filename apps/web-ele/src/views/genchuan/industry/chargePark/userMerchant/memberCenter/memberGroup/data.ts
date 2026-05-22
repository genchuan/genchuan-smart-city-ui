import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberGroupChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberGroup';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

import {
  FORM_TIME_FORMAT,
  formatDateTimeValue,
  formatLifecycleStatus,
  getLifecycleStatusTagType,
  lifecycleStatusOptions,
  STATUS_ENABLED,
} from '../utils';

export function buildStatsDataFromApi(data?: Partial<MemberGroupChartVO>) {
  const distribution = Array.isArray(data?.groupUserDistribution)
    ? data.groupUserDistribution
    : [];

  return {
    cards: [
      {
        title: '分组数',
        value: Number(data?.groupCount ?? 0),
        desc: '当前会员分组总数',
        color: '#2F80ED',
      },
      {
        title: '分组用户数',
        value: Number(data?.groupUserCount ?? 0),
        desc: '至少属于一个分组的会员数',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '分组用户分布',
        type: 'pie',
        data: distribution.map((item) => ({
          name: item.group || '未设置分组',
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
      type: getLifecycleStatusTagType(status),
    },
    () => formatLifecycleStatus(status),
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
      label: '分组名称',
      componentProps: {
        placeholder: '请输入分组名称',
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '分组描述',
      componentProps: {
        placeholder: '请输入分组描述',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'rule',
      label: '分组规则',
      componentProps: {
        placeholder: '请输入分组规则(JSON 或文本)',
      },
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: lifecycleStatusOptions,
      },
      rules: z.number().default(STATUS_ENABLED),
    },
    {
      fieldName: 'effectiveTime',
      label: '生效时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: FORM_TIME_FORMAT,
        type: 'datetime',
        placeholder: '请选择生效时间',
        class: '!w-full',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '分组名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分组名称',
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: lifecycleStatusOptions,
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
      title: '分组 ID',
      minWidth: 100,
    },
    {
      field: 'name',
      title: '分组名称',
      minWidth: 160,
      slots: {
        default: 'groupName',
      },
    },
    {
      field: 'groupUserCount',
      title: '分组用户数',
      minWidth: 120,
      slots: {
        default: 'groupUserCount',
      },
    },
    {
      field: 'description',
      title: '分组描述',
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
      field: 'effectiveTime',
      title: '生效时间',
      minWidth: 180,
      formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
    },
    {
      title: '操作',
      width: 190,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const memberGroupDetailFields = [
  { key: 'id', label: '分组编号' },
  { key: 'name', label: '分组名称' },
  { key: 'description', label: '分组描述' },
  { key: 'rule', label: '分组规则' },
  { key: 'groupUserCount', label: '分组用户数' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: getLifecycleStatusTagType,
    formatter: formatLifecycleStatus,
  },
  { key: 'effectiveTime', label: '生效时间', formatter: formatDateTimeValue },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatDateTimeValue },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTimeValue },
];
