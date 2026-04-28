// module-alarm/table/data.js

// 字典映射（用于显示和标签样式，仍保留以备需要）
export const abnormalTypeMap = {
  '接口故障': '接口故障',
  '运行卡顿': '运行卡顿',
  '上报异常': '上报异常',
};

export const alarmLevelMap = {
  '一般': '一般',
  '严重': '严重',
};

export const alarmStatusMap = {
  '未排查': '未排查',
  '已排查': '已排查',
  '修复中': '修复中',
  '已销账': '已销账',
};

export const alarmStatusTagType = (status) => {
  const map = {
    '未排查': 'danger',
    '已排查': 'warning',
    '修复中': 'primary',
    '已销账': 'success',
  };
  return map[status] || 'info';
};

/** 查询表单配置 */
export function useQuerySchema() {
  return [
    {
      fieldName: 'alarmCode',
      label: '告警编号',
      component: 'Input',
      componentProps: { placeholder: '请输入告警编号' },
    },
    {
      fieldName: 'moduleName',
      label: '模块名称',
      component: 'Input',
      componentProps: { placeholder: '请输入模块名称' },
    },
    {
      fieldName: 'abnormalTypeId',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: Object.keys(abnormalTypeMap).map(v => ({ label: v, value: v })),
      },
    },
    {
      fieldName: 'alarmLevelId',
      label: '告警等级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警等级',
        options: Object.keys(alarmLevelMap).map(v => ({ label: v, value: v })),
      },
    },
    {
      fieldName: 'alarmStatusId',
      label: '告警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择告警状态',
        options: Object.keys(alarmStatusMap).map(v => ({ label: v, value: v })),
      },
    },
    {
      fieldName: 'alarmTimeBegin',
      label: '告警时间开始',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    },
    {
      fieldName: 'alarmTimeEnd',
      label: '告警时间结束',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    },
    {
      fieldName: 'repairTimeBegin',
      label: '修复时间开始',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    },
    {
      fieldName: 'repairTimeEnd',
      label: '修复时间结束',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss' },
    },
    {
      fieldName: 'operator',
      label: '操作人',
      component: 'Input',
      componentProps: { placeholder: '请输入操作人' },
    },
  ];
}

/** 表格列配置（使用后端返回的字段名） */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'alarmCode', title: '告警编号', minWidth: 160, sortable: true, slots: { default: 'alarmCode' } },
    { field: 'moduleName', title: '模块名称', minWidth: 120, sortable: true, slots: { default: 'moduleName' } },
    { field: 'abnormalName', title: '异常类型', minWidth: 100, sortable: true, slots: { default: 'abnormalType' } },
    { field: 'alarmLevelName', title: '告警等级', minWidth: 100, sortable: true, slots: { default: 'alarmLevel' } },
    { field: 'alarmTime', title: '告警时间', minWidth: 160, sortable: true, slots: { default: 'alarmTime' } },
    { field: 'serverInfo', title: '服务器信息', minWidth: 180, showOverflow: true },
    { field: 'alarmStatusName', title: '告警状态', minWidth: 100, sortable: true, slots: { default: 'alarmStatus' } },
    { field: 'checkReason', title: '排查原因', minWidth: 150, showOverflow: true },
    { field: 'repairVoucher', title: '修复凭证', minWidth: 100, slots: { default: 'repairVoucher' } },
    { field: 'remark', title: '备注', minWidth: 150, showOverflow: true },
    { field: 'repairTime', title: '修复时间', minWidth: 160, sortable: true, slots: { default: 'repairTime' } },
    { field: 'updaterName', title: '操作人', minWidth: 100, sortable: true, slots: { default: 'operator' } },
    { title: '操作', width: 300, fixed: 'right', align: 'center', slots: { default: 'actions' } },
  ];
}
