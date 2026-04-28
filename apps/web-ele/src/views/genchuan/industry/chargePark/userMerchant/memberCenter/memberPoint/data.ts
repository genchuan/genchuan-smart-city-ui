import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { DICT_TYPE } from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { ElTag } from 'element-plus';

import { getRangePickerDefaultProps } from '#/utils';

/** 渲染积分记录状态 */
function renderStatusTag(status?: string) {
  const tagType = ['abnormal', '异常', '异常记录'].includes(
    String(status ?? ''),
  )
    ? 'danger'
    : 'success';
  const label = status || '正常记录';

  return h(
    ElTag,
    {
      type: tagType,
    },
    () => label,
  );
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'nickname',
      label: '用户名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名称',
        clearable: true,
      },
    },
    {
      fieldName: 'point',
      label: '变动积分',
      component: 'Input',
      componentProps: {
        placeholder: '请输入变动积分',
        clearable: true,
      },
    },
    {
      fieldName: 'bizType',
      label: '变动类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择变动类型',
        clearable: true,
        options: getDictOptions(DICT_TYPE.MEMBER_POINT_BIZ_TYPE, 'number'),
      },
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        clearable: true,
        options: [
          {
            label: '正常记录',
            value: '正常记录',
          },
          {
            label: '异常记录',
            value: '异常记录',
          },
        ],
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

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '变动时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'nickname',
      title: '用户名称',
      minWidth: 160,
    },
    {
      field: 'point',
      title: '变动积分',
      minWidth: 120,
      slots: {
        default: ({ row }) => {
          return h(
            ElTag,
            {
              type: Number(row.point) > 0 ? 'primary' : 'danger',
            },
            () => (Number(row.point) > 0 ? `+${row.point}` : row.point),
          );
        },
      },
    },
    {
      field: 'totalPoint',
      title: '总积分',
      minWidth: 100,
    },
    {
      field: 'bizType',
      title: '变动类型',
      minWidth: 120,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.MEMBER_POINT_BIZ_TYPE },
      },
    },
    {
      field: 'description',
      title: '变动原因',
      minWidth: 220,
      showOverflow: 'tooltip',
    },
    {
      field: 'status',
      title: '记录状态',
      minWidth: 120,
      slots: {
        default: ({ row }) => renderStatusTag(row.status),
      },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
