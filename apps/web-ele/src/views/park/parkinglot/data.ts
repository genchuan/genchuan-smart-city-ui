import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import {
  CommonStatusEnum,
  DICT_TYPE,
  SystemDataScopeEnum,
} from '@vben/constants';
import { getDictOptions } from '@vben/hooks';

import { z } from '#/adapter/form'; 

/** 新增/修改的表单 */
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
      label: '角色名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'code',
      label: '角色标识',
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色标识',
      },
      rules: 'required',
    },
    {
      fieldName: 'sort',
      label: '显示顺序',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: '请输入显示顺序',
        controlsPosition: 'right',
        class: '!w-full',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '角色状态',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
      },
      rules: z.number().default(CommonStatusEnum.ENABLE),
    },
    {
      fieldName: 'remark',
      label: '角色备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入角色备注',
      },
    },
  ];
}

/** 分配数据权限的表单 */
export function useAssignDataPermissionFormSchema(): VbenFormSchema[] {
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
      fieldName: 'name',
      label: '角色名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '角色标识',
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'dataScope',
      label: '权限范围',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SYSTEM_DATA_SCOPE, 'number'),
      },
    },
    {
      fieldName: 'dataScopeDeptIds',
      label: '部门范围',
      component: 'Input',
      formItemClass: 'items-start',
      dependencies: {
        triggerFields: ['dataScope'],
        show: (values) => {
          return values.dataScope === SystemDataScopeEnum.DEPT_CUSTOM;
        },
      },
    },
  ];
}

/** 分配菜单的表单 */
export function useAssignMenuFormSchema(): VbenFormSchema[] {
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
      label: '角色名称',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'code',
      label: '角色标识',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'menuIds',
      label: '菜单权限',
      component: 'Input',
      formItemClass: 'items-start',
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      label: '停车场ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入停车场',
        clearable: true,
      },
    },
    {
      fieldName: 'name',
      label: '停车场名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入停车场名称',
        clearable: true,
      },
    },
    {
      fieldName: 'address',
      label: '详细地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入详细地址',
        clearable: true,
      },
    },
    {
      fieldName: 'parkTotal',
      label: '泊位总数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位总数',
        clearable: true,
      },
    },
    {
      fieldName: 'pricing',
      label: '收费标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收费标准',
        clearable: true,
      },
    },
    {
      fieldName: 'business',
      label: '营业时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入营业时间',
        clearable: true,
      },
    }, 
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
        clearable: true,
      },
    },
    {
      fieldName: 'division',
      label: '所属行政区划',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属行政区划',
        clearable: true,
      },
    },
    {
      fieldName: 'status',
      label: '运营状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入运营状态',
        clearable: true,
      },
    }, 
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '停车场ID',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'name',
      title: '停车场名称',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'address',
      title: '详细地址',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'parkTotal',
      title: '泊位总数',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'pricing',
      title: '收费标准',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'business',
      title: '营业时间',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'phone',
      title: '联系电话',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'division',
      title: '所属行政区划',
      minWidth: 200,
      sortable: true
    },
    {
      field: 'status',
      title: '运营状态',
      minWidth: 200,
      sortable: true
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
