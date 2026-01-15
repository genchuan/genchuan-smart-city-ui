/** 停车场入场记录的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'recordId',
      label: '停车编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入停车编号',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'plateNumber',
      label: '车牌号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '临时车', value: '0' },
          { label: '月租车', value: '1' },
        ],
        placeholder: '请选择车牌类型',
        showSearch: true,
      },
      fieldName: 'plateType',
      label: '车牌类型',
    },
    {
      fieldName: 'entranceNo',
      label: '入口编号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入入口编号',
      },
    },
    {
      fieldName: 'entranceName',
      label: '入口名称',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入入口名称',
      },
    },
    {
      fieldName: 'operatorId',
      label: '收费员账号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入收费员账号',
      },
    },
    {
      fieldName: 'operatorName',
      label: '收费员名称',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入收费员名称',
      },
    },
    {
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间'],
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'driveInTimeRange',
      label: '进场时间',
    },
    {
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间'],
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'createTimeRange',
      label: '创建时间',
    },
    {
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入空闲车位数',
        min: 0,
        style: { width: '100%' },
      },
      fieldName: 'emptyPlot',
      label: '空闲车位数',
    },
  ];
}

/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 }, 
    {
      field: 'recordId',
      title: '停车编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'recordId' },
    },
    {
      field: 'entranceNo',
      title: '入口编号',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'entranceName',
      title: '入口名称',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'plateType',
      title: '车牌类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'plateNumber',
      title: '车牌号',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'driveInTime',
      title: '进场时间',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'driveInPhoto',
      title: '进场图片',
      minWidth: 200,
      sortable: true,
      slots: { default: 'driveInPhoto' },
    },
    {
      field: 'emptyPlot',
      title: '空闲车位数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'operatorId',
      title: '收费员账号',
      minWidth: 100,
      sortable: true,
    },
     {
      field: 'operatorName',
      title: '收费员名称',
      minWidth: 100,
      sortable: true,
    },
     {
      field: 'createTime',
      title: '创建时间',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '',
  addText: '',
  excelName: '',
  excelAllName: '全市停车场数据.xlsx',
  total: '停车场数量10;车位总数:1211;车场车位7',
};
