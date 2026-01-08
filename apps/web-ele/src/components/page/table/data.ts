import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

/** 表格初始数据*/
export const dataList = () => {
  return  [
    {
      id: '1',
      name: '芗城区XX社区公共停车场',
      type: '公共',
      address: '芗城区XX街道XX路88号',
      status: '启用',
      parkTotal: '90',
      pricing: '首小时8元，后续每小时4元，封顶32元',
      business: '06:00-24:00',
      division: '芗城区-东铺头街道',
      grid: '东铺头街道网格001',
      managementMatters: '泊位占用处置',
      phone: '13800138000',
      reason: '',
    },
    {
      id: '2',
      name: '龙文区碧湖公园停车场',
      type: '公共',
      address: '龙文区碧湖路126号',
      status: '禁用',
      parkTotal: '120',
      pricing: '首小时6元，后续每小时3元，封顶28元',
      business: '07:00-22:00',
      division: '龙文区-碧湖街道',
      grid: '碧湖街道网格002',
      managementMatters: '设施故障维修',
      phone: '123456789',
      reason: '道闸系统升级维护',
    },
    {
      id: '3',
      name: '龙海区石码镇便民停车场',
      type: '公共',
      address: '龙海区石码镇解放北路59号',
      status: '禁用',
      parkTotal: '68',
      pricing: '首小时4元，后续每小时2元，封顶20元',
      business: '08:00-21:00',
      division: '龙海区-石码街道',
      grid: '石码街道网格001',
      managementMatters: '设施升级改造',
      phone: '13959678987',
      reason: '充电桩设备更换',
    },
    {
      id: '4',
      name: '龙海区闽齐社区停车场',
      type: '公共',
      address: '闽齐社区西门',
      status: '启用',
      parkTotal: '35',
      pricing: '首小时5元，后续每小时2元，封顶24元',
      business: '24H',
      division: '龙海区-海澄镇',
      grid: '海澄镇网格001',
      managementMatters: '泊位占用处置,设施故障维修',
      phone: '15399916161',
      reason: '',
    },
    {
      id: '5',
      name: '芗城区江滨路生态停车场',
      type: '公共',
      address: '芗城区江滨南路189号',
      status: '启用',
      parkTotal: '150',
      pricing: '首小时10元，后续每小时5元，封顶40元',
      business: '06:00-24:00',
      division: '芗城区-巷口街道',
      grid: '巷口街道网格003',
      managementMatters: '车流高峰疏导,泊位占用处置',
      phone: '8888888',
      reason: '',
    },
    {
      id: '6',
      name: '龙文区万达商圈停车场',
      type: '公共',
      address: '龙文区建元东路2号',
      status: '启用',
      parkTotal: '200',
      pricing: '首小时7元，后续每小时3元，封顶30元',
      business: '24H',
      division: '龙文区-蓝田街道',
      grid: '蓝田街道网格002',
      managementMatters: '运营状态变更,数据统计分析',
      phone: '15860234567',
      reason: '',
    },
    {
      id: '7',
      name: '长泰区武安镇公共停车场',
      type: '公共',
      address: '长泰区武安镇人民西路77号',
      status: '启用',
      parkTotal: '85',
      pricing: '首小时5元，后续每小时2元，封顶22元',
      business: '07:00-23:00',
      division: '长泰区-武安镇',
      grid: '武安镇网格001',
      managementMatters: '定期设施巡检',
      phone: '13706987654',
      reason: '',
    },
    {
      id: '8',
      name: '漳浦县绥安镇便民停车场',
      type: '公共',
      address: '漳浦县绥安镇金浦大道101号',
      status: '禁用',
      parkTotal: '72',
      pricing: '首小时4元，后续每小时1元，封顶18元',
      business: '08:00-20:00',
      division: '漳浦县-绥安镇',
      grid: '绥安镇网格001',
      managementMatters: '应急事件处置',
      phone: '13695901234',
      reason: '场地积水清理',
    },
    {
      id: '9',
      name: '芗城区巷口街道停车场',
      type: '公共',
      address: '芗城区新华东路32号',
      status: '启用',
      parkTotal: '45',
      pricing: '首小时6元，后续每小时3元，封顶26元',
      business: '06:00-23:00',
      division: '芗城区-巷口街道',
      grid: '巷口街道网格002',
      managementMatters: '收费标准调整,泊位占用处置',
      phone: '18960012345',
      reason: '',
    },
    {
      id: '10',
      name: '龙文区蓝田街道停车场',
      type: '公共',
      address: '龙文区蓝田街道梧桥中路58号',
      status: '启用',
      parkTotal: '110',
      pricing: '首小时8元，后续每小时4元，封顶35元',
      business: '24H',
      division: '龙文区-蓝田街道',
      grid: '蓝田街道网格001',
      managementMatters: '环境卫生管理,设施故障维修',
      phone: '15980567890',
      reason: '',
    },
  ]
}

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      label: '停车场ID',
      component: 'Input',
       componentProps: {
        placeholder: '请输入角色名称停车场ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: '停车场名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入停车场名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'address',
      label: '详细地址',
      component: 'Input',
      componentProps: {
        placeholder: '请输入详细地址',
      },
      rules: 'required',
    }, 
     {
      fieldName: 'parkTotal',
      label: '泊位总数',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位总数',
      },
      rules: 'required',
    }, 
     {
      fieldName: 'pricing',
      label: '收费标准',
      component: 'Input',
      componentProps: {
        placeholder: '请输入收费标准',
      },
      rules: 'required',
    }, 
     {
      fieldName: 'business',
      label: '营业时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入营业时间',
      },
      rules: 'required',
    }, 
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
      rules: 'required',
    }, 
    {
      fieldName: 'division',
      label: '所属行政区划',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属行政区划',
      },
      rules: 'required',
    }, 
    {
      fieldName: 'status',
      label: '运营状态',
      component: 'Input',
      componentProps: {
        placeholder: '请输入运营状态',
      },
      rules: 'required',
    }
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
