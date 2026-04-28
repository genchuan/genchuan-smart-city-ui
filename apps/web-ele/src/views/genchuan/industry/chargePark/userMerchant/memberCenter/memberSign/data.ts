import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { h } from 'vue';

import { ElTag } from 'element-plus';

import { getRangePickerDefaultProps } from '#/utils';

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
      field: 'nickname',
      title: '用户名称',
      minWidth: 160,
    },
    {
      field: 'createTime',
      title: '签到时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'point',
      title: '积分奖励',
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
      field: 'day',
      title: '连续签到天数',
      minWidth: 140,
      formatter: ({ cellValue }) => `第 ${cellValue || 0} 天`,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
