import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberUserApi } from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/memberUser';

import { h } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import dayjs from 'dayjs';
import { ElTag } from 'element-plus';

import { z } from '#/adapter/form';
import {
  getMemberGroupOptions,
  getMemberLevelOptions,
  getMemberTagOptions,
} from '#/api/genchuan/industry/chargePark/userMerchant/memberCenter/options';
import { getAreaTree } from '#/api/system/area';
import { getRangePickerDefaultProps } from '#/utils';

import { FORM_TIME_FORMAT } from '../utils';

const QUERY_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const MEMBER_STATUS_DISABLED = 0;
export const MEMBER_STATUS_ENABLED = 1;

export const memberStatusOptions = [
  { label: '正常', value: MEMBER_STATUS_ENABLED },
  { label: '禁用', value: MEMBER_STATUS_DISABLED },
];

function buildRangeParam(value: any) {
  if (!Array.isArray(value) || value.length !== 2) {
    return undefined;
  }

  return [
    dayjs(value[0]).format(QUERY_TIME_FORMAT),
    dayjs(value[1]).format(QUERY_TIME_FORMAT),
  ];
}

function hasQueryValue(value: any) {
  return !(
    value === '' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  );
}

function formatDateTimeValue(value?: null | number | string) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const parsed = dayjs(value);
  return parsed.isValid()
    ? parsed.format('YYYY-MM-DD HH:mm:ss')
    : String(value);
}

function formatSex(value?: number | string) {
  const sexMap: Record<string, string> = {
    0: '未知',
    1: '男',
    2: '女',
  };

  return sexMap[String(value ?? '')] || '-';
}

export function isMemberEnabled(status?: number | string) {
  return Number(status) === MEMBER_STATUS_ENABLED;
}

export function formatMemberStatus(status?: number | string) {
  return isMemberEnabled(status) ? '正常' : '禁用';
}

export function getMemberStatusTagType(status?: number | string) {
  return isMemberEnabled(status) ? 'success' : 'danger';
}

export function buildMemberUserQueryParams(
  formValues: Record<string, any>,
): MemberUserApi.UserPageReqVO {
  const params = {
    ...formValues,
    createTime: buildRangeParam(formValues.createTime),
    expireTime: buildRangeParam(formValues.expireTime),
    loginDate: buildRangeParam(formValues.loginDate),
    tagIds: Array.isArray(formValues.tagIds)
      ? formValues.tagIds.join(',')
      : formValues.tagIds,
  };

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => hasQueryValue(value)),
  ) as MemberUserApi.UserPageReqVO;
}

export function buildDateRangeByChartName(dateText: string) {
  const date = dayjs(dateText);

  if (!date.isValid()) {
    return null;
  }

  const isDayValue = /^\d{4}-\d{2}-\d{2}$/.test(dateText);

  return [
    date.startOf(isDayValue ? 'day' : 'month').format(QUERY_TIME_FORMAT),
    date.endOf(isDayValue ? 'day' : 'month').format(QUERY_TIME_FORMAT),
  ];
}

export function buildRecentMemberRange() {
  return [
    dayjs().subtract(30, 'day').startOf('day').format(QUERY_TIME_FORMAT),
    dayjs().endOf('day').format(QUERY_TIME_FORMAT),
  ];
}

export function buildStatsDataFromApi(
  data?: Partial<MemberUserApi.UserChartVO>,
) {
  const trend = Array.isArray(data?.memberGrowthTrend)
    ? data.memberGrowthTrend
    : [];

  return {
    cards: [
      {
        title: '会员总数',
        value: Number(data?.totalMemberCount ?? 0),
        desc: '当前会员用户累计数量',
        color: '#2F80ED',
      },
      {
        title: '新增会员',
        value: Number(data?.newMemberCount ?? 0),
        desc: '近 30 天新增会员数',
        color: '#27AE60',
      },
    ],
    charts: [
      {
        title: '会员增长趋势',
        type: 'line',
        xAxis: trend.map((item) => item.date),
        series: trend.map((item) => Number(item.count ?? 0)),
      },
    ],
  };
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
      fieldName: 'mobile',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
      rules: 'required',
    },
    {
      fieldName: 'password',
      label: '登录密码',
      component: 'Input',
      componentProps: {
        showPassword: true,
        placeholder: '请输入登录密码',
      },
      dependencies: {
        triggerFields: ['id'],
        rules: (values) => (values.id ? undefined : 'required'),
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'RadioGroup',
      componentProps: {
        options: memberStatusOptions,
      },
      rules: z.number().default(MEMBER_STATUS_ENABLED),
    },
    {
      fieldName: 'nickname',
      label: '会员昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入会员昵称',
      },
      rules: 'required',
    },
    {
      fieldName: 'avatar',
      label: '头像',
      component: 'ImageUpload',
      rules: z.string().default('').optional(),
    },
    {
      fieldName: 'name',
      label: '真实姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入真实姓名',
      },
    },
    {
      fieldName: 'sex',
      label: '性别',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SYSTEM_USER_SEX, 'number'),
      },
    },
    {
      fieldName: 'birthday',
      label: '生日',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: FORM_TIME_FORMAT,
        placeholder: '请选择生日',
        class: '!w-full',
      },
    },
    {
      fieldName: 'areaId',
      label: '所在地区',
      component: 'ApiTreeSelect',
      componentProps: {
        api: getAreaTree,
        labelField: 'name',
        valueField: 'id',
        childrenField: 'children',
        placeholder: '请选择所在地区',
      },
    },
    {
      fieldName: 'tagIds',
      label: '会员标签',
      component: 'ApiSelect',
      componentProps: {
        api: getMemberTagOptions,
        labelField: 'name',
        valueField: 'id',
        multiple: true,
        placeholder: '请选择会员标签',
      },
    },
    {
      fieldName: 'levelId',
      label: '会员等级',
      component: 'ApiSelect',
      componentProps: {
        api: getMemberLevelOptions,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择会员等级',
        clearable: true,
      },
    },
    {
      fieldName: 'groupId',
      label: '会员分组',
      component: 'ApiSelect',
      componentProps: {
        api: getMemberGroupOptions,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择会员分组',
        clearable: true,
      },
    },
    {
      fieldName: 'point',
      label: '积分',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        placeholder: '请输入积分',
        controlsPosition: 'right',
        class: '!w-full',
      },
      rules: z.number().default(0),
    },
    {
      fieldName: 'experience',
      label: '经验值',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        placeholder: '请输入经验值',
        controlsPosition: 'right',
        class: '!w-full',
      },
      rules: z.number().default(0),
    },
    {
      fieldName: 'registerIp',
      label: '注册 IP',
      component: 'Input',
      componentProps: {
        placeholder: '请输入注册 IP',
      },
      rules: 'required',
    },
    {
      fieldName: 'registerTerminal',
      label: '注册终端',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 0,
        placeholder: '请输入注册终端',
        controlsPosition: 'right',
        class: '!w-full',
      },
    },
    {
      fieldName: 'loginIp',
      label: '登录 IP',
      component: 'Input',
      componentProps: {
        placeholder: '请输入登录 IP',
      },
      rules: 'required',
    },
    {
      fieldName: 'loginDate',
      label: '最后登录时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: FORM_TIME_FORMAT,
        placeholder: '请选择最后登录时间',
        type: 'datetime',
        class: '!w-full',
      },
    },
    {
      fieldName: 'expireTime',
      label: '到期时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: FORM_TIME_FORMAT,
        placeholder: '请选择到期时间',
        type: 'datetime',
        class: '!w-full',
      },
    },
    {
      fieldName: 'autoRenew',
      label: '自动续费',
      component: 'Switch',
      componentProps: {
        activeValue: 1,
        inactiveValue: 0,
      },
      rules: z.number().default(0),
    },
    {
      fieldName: 'mark',
      label: '会员备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入会员备注',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'nickname',
      label: '会员昵称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入会员昵称',
        clearable: true,
      },
    },
    {
      fieldName: 'mobile',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: memberStatusOptions,
        placeholder: '请选择状态',
        clearable: true,
      },
    },
    {
      fieldName: 'tagIds',
      label: '会员标签',
      component: 'ApiSelect',
      componentProps: {
        api: getMemberTagOptions,
        labelField: 'name',
        valueField: 'id',
        multiple: true,
        placeholder: '请选择会员标签',
        clearable: true,
      },
    },
    {
      fieldName: 'levelId',
      label: '会员等级',
      component: 'ApiSelect',
      componentProps: {
        api: getMemberLevelOptions,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择会员等级',
        clearable: true,
      },
    },
    {
      fieldName: 'groupId',
      label: '会员分组',
      component: 'ApiSelect',
      componentProps: {
        api: getMemberGroupOptions,
        labelField: 'name',
        valueField: 'id',
        placeholder: '请选择会员分组',
        clearable: true,
      },
    },
    {
      fieldName: 'loginDate',
      label: '登录时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '注册时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        clearable: true,
      },
    },
  ];
}

function renderStatus(status?: number | string) {
  return h(
    ElTag,
    {
      type: getMemberStatusTagType(status),
    },
    () => formatMemberStatus(status),
  );
}

export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '会员 ID',
      minWidth: 100,
    },
    {
      field: 'nickname',
      title: '用户',
      minWidth: 160,
      slots: {
        default: 'user',
      },
    },
    {
      field: 'levelName',
      title: '会员等级',
      minWidth: 120,
      formatter: ({ row }) => row.levelName || row.levelId || '-',
    },
    {
      field: 'createTime',
      title: '开通时间',
      minWidth: 160,
      formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 90,
      slots: {
        default: ({ row }) => renderStatus(row.status),
      },
    },
    {
      field: 'autoRenew',
      title: '自动续费',
      minWidth: 90,
      formatter: ({ cellValue }) => (Number(cellValue) === 1 ? '是' : '否'),
    },
    {
      field: 'expireTime',
      title: '到期时间',
      minWidth: 160,
      formatter: ({ cellValue }) => formatDateTimeValue(cellValue),
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const memberUserDetailFields = [
  { key: 'avatar', label: '头像', type: 'image' },
  { key: 'id', label: '会员编号' },
  { key: 'mobile', label: '手机号' },
  { key: 'nickname', label: '会员昵称' },
  { key: 'name', label: '真实姓名' },
  { key: 'sex', label: '性别', formatter: formatSex },
  {
    key: 'status',
    label: '状态',
    type: 'tag',
    tagType: getMemberStatusTagType,
    formatter: formatMemberStatus,
  },
  { key: 'areaName', label: '所在地区' },
  {
    key: 'levelName',
    label: '会员等级',
    formatter: (value: any) => value || '-',
  },
  {
    key: 'groupName',
    label: '会员分组',
    formatter: (value: any) => value || '-',
  },
  {
    key: 'tagNames',
    label: '会员标签',
    formatter: (value: any) =>
      Array.isArray(value) ? value[0] || '-' : value || '-',
  },
  {
    key: 'point',
    label: '积分',
    formatter: (value: any) => Number(value ?? 0),
  },
  {
    key: 'experience',
    label: '经验值',
    formatter: (value: any) => Number(value ?? 0),
  },
  {
    key: 'autoRenew',
    label: '自动续费',
    formatter: (value: any) => (Number(value) === 1 ? '是' : '否'),
  },
  { key: 'expireTime', label: '到期时间', formatter: formatDateTimeValue },
  { key: 'birthday', label: '生日', formatter: formatDateTimeValue },
  { key: 'registerIp', label: '注册 IP' },
  { key: 'registerTerminal', label: '注册终端' },
  { key: 'loginIp', label: '最后登录 IP' },
  { key: 'loginDate', label: '最后登录时间', formatter: formatDateTimeValue },
  { key: 'mark', label: '会员备注' },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatDateTimeValue },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTimeValue },
];
