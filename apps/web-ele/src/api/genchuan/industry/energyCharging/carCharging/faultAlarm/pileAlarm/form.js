// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'alarmCode',
      label: '告警编号',
      component: 'Input',
      componentProps: { placeholder: '请输入告警编号' },
      labelWidth: '100',
    },
    {
      fieldName: 'pileCode',
      label: '充电桩编号',
      component: 'Input',
      componentProps: { placeholder: '请输入充电桩编号' },
      labelWidth: '100',
    },
    {
      fieldName: 'stationName',
      label: '所属场站',
      component: 'Input',
      componentProps: { placeholder: '请输入所属场站' },
      labelWidth: '100',
    },
    {
      fieldName: 'faultType',
      label: '故障类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择故障类型',
        options: [
          { label: '硬件', value: '硬件' },
          { label: '软件', value: '软件' },
          { label: '网络', value: '网络' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'alarmLevel',
      label: '告警等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警等级',
        options: [
          { label: '一级', value: '一级' },
          { label: '二级', value: '二级' },
          { label: '三级', value: '三级' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'alarmStatus',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警状态',
        options: [
          { label: '未派单', value: '未派单' },
          { label: '已派单', value: '已派单' },
          { label: '处置中', value: '处置中' },
          { label: '已销单', value: '已销单' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'alarmTime',
      label: '告警时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择告警时间',
        type: 'daterange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
    },
  ];
}

// 根据状态获取表格列定义
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      { field: 'alarmCode', title: '告警编号', minWidth: 150, sortable: true, slots: { default: 'alarmCode' } },
      { field: 'pileName', title: '充电桩编号', minWidth: 130, slots: { default: 'pileCode' } },
      { field: 'stationName', title: '所属场站', minWidth: 150, slots: { default: 'station' } },
      { field: 'faultType', title: '故障类型', minWidth: 120, slots: { default: 'faultType' } },
      { field: 'alarmLevel', title: '告警等级', minWidth: 100, slots: { default: 'alarmLevel' } },
      { field: 'alarmTime', title: '告警时间', minWidth: 180, slots: { default: 'alarmTime' } },
      { field: 'handleUser', title: '处理人员', minWidth: 120, slots: { default: 'manager' } },
      { field: 'alarmStatus', title: '告警状态', minWidth: 100, slots: { default: 'alarmStatus' } },
      { field: 'disposeMeasure', title: '处置措施', minWidth: 200 },
      { field: 'remark', title: '备注', minWidth: 150 },
    ],
  };

  const columns = [...baseColumns, ...(statusColumnsMap[status] || statusColumnsMap.全部)];
  columns.push({
    title: '操作',
    width: 180,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return columns;
}

// 文本常量
export const textObj = {
  editText: '编辑告警信息',
  addText: '新增告警',
  excelName: '充电桩告警列表',
};
