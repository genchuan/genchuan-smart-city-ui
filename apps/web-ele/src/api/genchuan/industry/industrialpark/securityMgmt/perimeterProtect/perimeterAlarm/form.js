// 文件2: src/views/genchuan/industry/industrialpark/securityMgmt/perimeterProtect/perimeterAlarm/form.js
// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'alarmArea',
      label: '告警区域',
      component: 'Input',
      componentProps: { placeholder: '请输入告警区域', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'alarmType',
      label: '告警类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '入侵', value: '入侵' },
          { label: '破坏', value: '破坏' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'alarmStatus',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '告警中', value: '告警中' },
          { label: '已处置', value: '已处置' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'alarmArea', title: '告警区域', minWidth: 140, slots: { default: 'alarmArea' } },
    { field: 'alarmTime', title: '告警时间', minWidth: 180, slots: { default: 'alarmTime' } },
    { field: 'alarmType', title: '告警类型', minWidth: 100, slots: { default: 'alarmType' } },
    { field: 'deviceId', title: '关联设备', minWidth: 120, slots: { default: 'deviceId' } },
    { field: 'alarmStatus', title: '告警状态', minWidth: 100, slots: { default: 'alarmStatus' } },
    { field: 'handleUser', title: '处置人', minWidth: 100, slots: { default: 'handleUser' } },
    { field: 'handleResult', title: '处置结果', minWidth: 150, slots: { default: 'handleResult' } },
    { field: 'linkStatus', title: '联动监控状态', minWidth: 120 },
    { field: 'creator', title: '创建人', minWidth: 120, slots: { default: 'creator' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 320,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 处置表单 schema
export function useHandleFormSchema() {
  return [
    {
      fieldName: 'handleResult',
      label: '处置结果',
      component: 'Input',
      componentProps: { placeholder: '请输入处置结果', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 灵敏度调整表单 schema
export function useSensitivityFormSchema() {
  return [
    {
      fieldName: 'sensitivity',
      label: '灵敏度值(1-10)',
      component: 'InputNumber',
      componentProps: {
        min: 1,
        max: 10,
        step: 1,
        placeholder: '请输入灵敏度值',
        style: 'width: 100%',
      },
      defaultValue: 5,
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 忽略表单 schema
export function useIgnoreFormSchema() {
  return [
    {
      fieldName: 'ignoreReason',
      label: '忽略原因',
      component: 'Input',
      componentProps: { placeholder: '请输入忽略原因', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  defendText: '布防',
  cancelDefendText: '撤防',
  sensitivityText: '灵敏度调整',
  handleText: '处置',
  ignoreText: '忽略',
  linkMonitorText: '联动监控',
  confirmText: '确认',
  viewText: '查看',
  excelName: '周界报警列表',
};

// 时间戳格式化函数
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
