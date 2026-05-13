// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则名称', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'ruleType',
      label: '识别类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '人形', value: '人形' },
          { label: '车辆', value: '车辆' },
          { label: '异常行为', value: '异常行为' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'ruleStatus',
      label: '规则状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
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
    { field: 'ruleName', title: '规则名称', minWidth: 140, slots: { default: 'ruleName' } },
    { field: 'ruleType', title: '识别类型', minWidth: 100, slots: { default: 'ruleType' } },
    { field: 'cameraId', title: '关联摄像头', minWidth: 120, slots: { default: 'cameraId' } },
    { field: 'ruleStatus', title: '规则状态', minWidth: 100, slots: { default: 'ruleStatus' } },
    { field: 'accuracy', title: '识别准确率(%)', minWidth: 120 },
    { field: 'recognizeCount', title: '识别总数', minWidth: 100, slots: { default: 'recognizeCount' } },
    { field: 'alarmCount', title: '告警总数', minWidth: 100, slots: { default: 'alarmCount' } },
    { field: 'checkRate', title: '核实率(%)', minWidth: 100 },
    { field: 'handleRate', title: '处置率(%)', minWidth: 100 },
    { field: 'handleUser', title: '操作人', minWidth: 100, slots: { default: 'handleUser' } },
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

// 配置表单 schema（编辑规则）
export function useConfigFormSchema() {
  return [
    {
      fieldName: 'ruleName',
      label: '规则名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'ruleType',
      label: '识别类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择识别类型',
        options: [
          { label: '人形', value: '人形' },
          { label: '车辆', value: '车辆' },
          { label: '异常行为', value: '异常行为' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'cameraId',
      label: '关联摄像头',
      component: 'Select',
      componentProps: {
        placeholder: '请选择摄像头',
        options: [], // 动态加载，可通过接口获取
        filterable: true,
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'ruleConfig',
      label: '规则配置',
      component: 'Input',
      componentProps: { placeholder: '请输入规则配置参数(JSON格式)', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 核实表单 schema
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'checkResult',
      label: '核实结果',
      component: 'Input',
      componentProps: { placeholder: '请输入核实结果', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
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
  enableText: '启用',
  disableText: '禁用',
  configText: '配置',
  testText: '测试',
  checkText: '核实',
  alarmText: '告警',
  ignoreText: '忽略',
  viewText: '查看',
  handleText: '处置',
  archiveText: '归档',
  excelName: 'AI识别列表',
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
