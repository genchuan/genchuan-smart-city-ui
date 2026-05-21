import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberLevelChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberLevel';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

import {
  formatDateTimeValue,
  formatLifecycleStatus,
  formatPercentValue,
  getLifecycleStatusTagType,
  lifecycleStatusOptions,
  QUERY_TIME_FORMAT,
  STATUS_ENABLED,
} from '../utils';

export function buildStatsDataFromApi(data?: Partial<MemberLevelChartVO>) {
  const distribution = Array.isArray(data?.levelUserDistribution)
    ? data.levelUserDistribution
    : [];

  return {
    cards: [
      {
        title: '等级数',
        value: Number(data?.levelCount ?? 0),
        desc: '当前会员等级总数',
        color: '#2F80ED',
      },
      {
        title: '等级升级率',
        value: formatPercentValue(data?.levelUpgradeRate),
        desc: '非最低等级会员占比',
        color: '#FF9F40',
      },
    ],
    charts: [
      {
        title: '等级用户分布',
        type: 'bar',
        xAxis: distribution.map((item) => item.level || '未设置等级'),
        series: distribution.map((item) => Number(item.count ?? 0)),
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
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '等级名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入等级名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'levelValue',
      label: '等级数值',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        placeholder: '请输入等级数值',
        controlsPosition: 'right',
        class: '!w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'upgradeCondition',
      label: '升级条件',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入升级条件(JSON 或文本)',
      },
      rules: 'required',
    },
    {
      fieldName: 'benefits',
      label: '权益内容',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入权益内容(JSON 或文本)',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
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
        valueFormat: QUERY_TIME_FORMAT,
        type: 'datetime',
        placeholder: '请选择生效时间',
        class: '!w-full',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
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
      label: '等级名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入等级名称',
        clearable: true,
      },
    },
    {
      fieldName: 'levelValue',
      label: '等级数值',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        controlsPosition: 'right',
        placeholder: '请输入等级数值',
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
        options: lifecycleStatusOptions,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
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
      title: '等级编号',
      minWidth: 90,
    },
    {
      field: 'name',
      title: '等级名称',
      minWidth: 140,
    },
    {
      field: 'levelValue',
      title: '等级数值',
      minWidth: 100,
    },
    {
      field: 'upgradeCondition',
      title: '升级条件',
      minWidth: 220,
      showOverflow: 'tooltip',
      formatter: ({ cellValue }) => cellValue || '-',
    },
    {
      field: 'benefits',
      title: '权益内容',
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
      field: 'createTime',
      title: '创建时间',
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

export const memberLevelDetailFields = [
  { key: 'id', label: '等级编号' },
  { key: 'name', label: '等级名称' },
  { key: 'levelValue', label: '等级数值' },
  { key: 'upgradeCondition', label: '升级条件' },
  { key: 'benefits', label: '权益内容' },
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
