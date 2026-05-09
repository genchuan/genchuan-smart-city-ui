// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'checkStatus',
      label: '考勤状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择考勤状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '迟到', value: '迟到' },
          { label: '未到', value: '未到' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'abnormalType',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: [
          { label: '无', value: '无' },
          { label: '晚归', value: '晚归' },
          { label: '未归', value: '未归' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '异常', value: '异常' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentId', title: '学号', minWidth: 100, slots: { default: 'studentId' } },
    { field: 'checkTime', title: '考勤时间', minWidth: 180, slots: { default: 'checkTime' } },
    { field: 'checkStatus', title: '考勤状态', minWidth: 100, slots: { default: 'checkStatus' } },
    { field: 'abnormalType', title: '异常类型', minWidth: 100, slots: { default: 'abnormalType' } },
    { field: 'repairTime', title: '补卡时间', minWidth: 180, slots: { default: 'repairTime' } },
    { field: 'repairUser', title: '补卡人', minWidth: 100 },
    { field: 'pushTime', title: '推送时间', minWidth: 180, slots: { default: 'pushTime' } },
    { field: 'inRate', title: '在寝率(%)', minWidth: 100 },
    { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 打卡表单 schema（批量选择学生）
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'checkTime',
      label: '考勤时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择考勤时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  checkText: '打卡',
  recheckText: '补卡',
  pushText: '推送',
  excelName: '宿舍考勤列表',
};
