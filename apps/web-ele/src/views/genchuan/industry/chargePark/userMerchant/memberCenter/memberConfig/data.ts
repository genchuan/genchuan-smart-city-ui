import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberConfigChartVO } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberConfig';

import { z } from '#/adapter/form';
import { getRangePickerDefaultProps } from '#/utils';

import {
  FORM_TIME_FORMAT,
  formatDateTimeValue,
  formatLifecycleStatus,
  formatPercentValue,
  getLifecycleStatusTagType,
  lifecycleStatusOptions,
  STATUS_ENABLED,
} from '../utils';

export function buildStatsDataFromApi(data?: Partial<MemberConfigChartVO>) {
  const distribution = Array.isArray(data?.configTypeDistribution)
    ? data.configTypeDistribution
    : [];

  return {
    cards: [
      {
        title: '生效配置数',
        value: Number(data?.effectConfigCount ?? 0),
        desc: '当前已生效会员配置数量',
        color: '#2F80ED',
      },
      {
        title: '会员匹配率',
        value: formatPercentValue(data?.memberMatchRate),
        desc: '会员命中配置的比例',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '配置类型占比',
        type: 'pie',
        data: distribution.map((item) => ({
          name: item.type || '未设置类型',
          value: Number(item.count ?? 0),
        })),
      },
    ],
  };
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
      fieldName: 'configType',
      label: '配置类型',
      componentProps: {
        placeholder: '请输入配置类型',
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'content',
      label: '权益内容',
      componentProps: {
        placeholder: '请输入权益内容(JSON 或文本)',
      },
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
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
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'configType',
      label: '配置类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置类型',
        clearable: true,
      },
    },
    {
      fieldName: 'content',
      label: '权益内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入权益内容',
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
        clearable: true,
      },
    },
  ];
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '配置 ID',
      minWidth: 100,
    },
    {
      field: 'configType',
      title: '配置类型',
      minWidth: 140,
      slots: {
        default: 'configType',
      },
    },
    {
      field: 'content',
      title: '权益内容',
      minWidth: 260,
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

export const memberConfigDetailFields = [
  { key: 'id', label: '配置编号' },
  { key: 'configType', label: '配置类型' },
  { key: 'content', label: '权益内容' },
  { key: 'remark', label: '备注' },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: getLifecycleStatusTagType,
    formatter: formatLifecycleStatus,
  },
  { key: 'effectiveTime', label: '生效时间', formatter: formatDateTimeValue },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatDateTimeValue },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTimeValue },
];
