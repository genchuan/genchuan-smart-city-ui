// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'cameraName',
      label: '摄像头名称',
      component: 'Input',
      componentProps: { placeholder: '请输入摄像头名称', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'area',
      label: '安装区域',
      component: 'Input',
      componentProps: { placeholder: '请输入安装区域', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'runStatus',
      label: '运行状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '正常', value: '正常' },
          { label: '异常', value: '异常' },
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
          { label: '无告警', value: '无告警' },
          { label: '告警中', value: '告警中' },
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
    { field: 'cameraName', title: '摄像头名称', minWidth: 140, slots: { default: 'cameraName' } },
    { field: 'area', title: '安装区域', minWidth: 120, slots: { default: 'area' } },
    { field: 'runStatus', title: '运行状态', minWidth: 100, slots: { default: 'runStatus' } },
    { field: 'alarmStatus', title: '告警状态', minWidth: 100, slots: { default: 'alarmStatus' } },
    { field: 'imgUrl', title: '监控画面', minWidth: 120, slots: { default: 'imgUrl' } },
    { field: 'updateTime', title: '最后更新时间', minWidth: 180, slots: { default: 'updateTime' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, slots: { default: 'handleUser' } },
    { field: 'handleResult', title: '处置结果', minWidth: 150, slots: { default: 'handleResult' } },
    { field: 'snapImg', title: '截图记录', minWidth: 100, slots: { default: 'snapImg' } },
    { field: 'creator', title: '创建人', minWidth: 120, slots: { default: 'creator' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 280,
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

// 分屏配置 schema
export function useSplitScreenSchema() {
  return [
    {
      fieldName: 'splitMode',
      label: '分屏模式',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '1分屏', value: 1 },
          { label: '4分屏', value: 4 },
          { label: '9分屏', value: 9 },
          { label: '16分屏', value: 16 },
        ],
      },
      defaultValue: 4,
      labelWidth: '100',
    },
  ];
}

// 告警表单 schema
export function useAlarmFormSchema() {
  return [
    {
      fieldName: 'alarmContent',
      label: '告警内容',
      component: 'Input',
      componentProps: { placeholder: '请输入告警内容', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 录像表单 schema
export function useRecordFormSchema() {
  return [
    {
      fieldName: 'recordDuration',
      label: '录像时长（秒）',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入录像时长', min: 10, max: 3600, step: 10 },
      defaultValue: 300,
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  fullscreenText: '全屏',
  splitText: '分屏',
  snapText: '截图',
  pauseText: '暂停',
  restartText: '重启',
  excelName: '实时监控列表',
};
