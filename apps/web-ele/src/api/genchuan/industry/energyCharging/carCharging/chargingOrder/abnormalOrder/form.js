// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'orderCode',
      label: '订单编号',
      component: 'Input',
      componentProps: { placeholder: '请输入订单编号' },
      labelWidth: '100',
    },
    {
      fieldName: 'abnormalType',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: [
          { label: '支付异常', value: '支付异常' },
          { label: '充电中断', value: '充电中断' },
          { label: '设备故障', value: '设备故障' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'abnormalStatus',
      label: '异常状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常状态',
        options: [
          { label: '未核实', value: '未核实' },
          { label: '已核实', value: '已核实' },
          { label: '处理中', value: '处理中' },
          { label: '已完结', value: '已完结' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'abnormalTime',
      label: '异常时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择异常时间范围',
        type: 'daterange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
    },
  ];
}

// 根据状态获取表格列定义（此处统一返回完整列，不需要按状态区分，但保留参数以便扩展）
export function getColumnsByStatus(status = '全部') {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'orderCode', title: '订单编号', minWidth: 150, sortable: true, slots: { default: 'orderCode' } },
    { field: 'abnormalType', title: '异常类型', minWidth: 120, slots: { default: 'abnormalType' } },
    { field: 'abnormalReason', title: '异常原因', minWidth: 180 },
    { field: 'checkUser', title: '排查人员', minWidth: 120, slots: { default: 'checkUser' } },
    { field: 'handleMeasure', title: '处理措施', minWidth: 150 },
    { field: 'handleTime', title: '处理时间', minWidth: 180, slots: { default: 'handleTime' } },
    { field: 'abnormalStatus', title: '异常状态', minWidth: 100, slots: { default: 'abnormalStatus' } },
    { field: 'remark', title: '备注', minWidth: 150 },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 240,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 文本常量
export const textObj = {
  editText: '编辑异常订单',
  addText: '新增异常订单',
  excelName: '异常订单列表',
};
