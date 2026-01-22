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
      fieldName: 'plateNumber',
      label: '车牌号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: "datetime",
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'driveInTimeRange',
      label: '进场时间',
    },
    {
      fieldName: 'exitNo',
      label: '出口编号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入出口编号',
      },
    },
    {
      fieldName: 'exitName',
      label: '出口名称',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入出口名称',
      },
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: "datetime",
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'driveOutTimeRange',
      label: '出场时间',
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
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入应付金额',
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      fieldName: 'shouldPay',
      label: '应付金额',
    },
    {
      component: 'InputNumber',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入实付金额',
        min: 0,
        precision: 2,
        style: { width: '100%' },
      },
      fieldName: 'actualPay',
      label: '实付金额',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        placeholder: '请选择出场类型',
        showSearch: true,
        // 这里可以根据实际业务补充出场类型的选项值
        options: [
          { label: '正常出场', value: 'normal' },
          { label: '免费出场', value: 'free' },
          { label: '异常出场', value: 'exception' },
        ],
      },
      fieldName: 'outType',
      label: '出场类型',
    },
    {
      fieldName: 'outRemark',
      label: '免费原因或异常原因',
      component: 'InputTextArea',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入免费原因或异常原因',
        rows: 3,
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        placeholder: '请选择支付方式',
        showSearch: true,
        // 这里可以根据实际业务补充支付方式的选项值
        options: [
          { label: '微信支付', value: 'wechat' },
          { label: '支付宝', value: 'alipay' },
          { label: '现金', value: 'cash' },
          { label: '无感支付', value: 'unfeel' },
          { label: '免费', value: 'free' },
        ],
      },
      fieldName: 'payMethod',
      label: '支付方式',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: "datetime",
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'createTimeRange',
      label: '创建时间',
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
    // {
    //   field: 'entranceNo',
    //   title: '入口编号',
    //   minWidth: 100,
    //   sortable: true,
    // },
    // {
    //   field: 'entranceName',
    //   title: '入口名称',
    //   minWidth: 100,
    //   sortable: true,
    // },
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
    // {
    //   field: 'driveInPhoto',
    //   title: '进场图片',
    //   minWidth: 200,
    //   sortable: true,
    //   slots: { default: 'driveInPhoto' },
    // },
    {
      field: 'exitNo',
      title: '出口编号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'exitName',
      title: '出口名称',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'driveOutTime',
      title: '出场时间',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'driveOutPhoto',
      title: '出场图片',
      minWidth: 150,
      sortable: true,
      slots: { default: 'driveOutPhoto' },
    },
    // {
    //   field: 'emptyPlot',
    //   title: '空闲车位数',
    //   minWidth: 100,
    //   sortable: true,
    // },
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
      field: 'shouldPay',
      title: '应付金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'actualPay',
      title: '实付金额',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'outType',
      title: '出场类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'outRemark',
      title: '免费原因或异常原因',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'payMethod',
      title: '支付方式',
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
      width: 80,
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
