// 文件2: src/views/genchuan/industrialPark/securityMgmt/cameraMgmt/form.js
// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'deviceName',
      label: '设备名称',
      component: 'Input',
      componentProps: { placeholder: '请输入设备名称', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'deviceModel',
      label: '设备型号',
      component: 'Input',
      componentProps: { placeholder: '请输入设备型号', clearable: true },
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
          { label: '在线', value: '在线' },
          { label: '离线', value: '离线' },
          { label: '故障', value: '故障' },
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
    { field: 'deviceName', title: '设备名称', minWidth: 140, slots: { default: 'deviceName' } },
    { field: 'deviceModel', title: '设备型号', minWidth: 120, slots: { default: 'deviceModel' } },
    { field: 'area', title: '安装区域', minWidth: 120, slots: { default: 'area' } },
    { field: 'runStatus', title: '运行状态', minWidth: 100, slots: { default: 'runStatus' } },
    { field: 'factory', title: '厂家信息', minWidth: 100 },
    { field: 'factoryPhone', title: '联系方式', minWidth: 120 },
    { field: 'repairCount', title: '报修次数', minWidth: 100, slots: { default: 'repairCount' } },
    { field: 'lastRepairTime', title: '最后检修时间', minWidth: 180, slots: { default: 'lastRepairTime' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, slots: { default: 'handleUser' } },
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

// 新增/编辑表单 schema
export function useEditFormSchema() {
  return [
    {
      fieldName: 'deviceName',
      label: '设备名称',
      component: 'Input',
      componentProps: { placeholder: '请输入设备名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'deviceModel',
      label: '设备型号',
      component: 'Input',
      componentProps: { placeholder: '请输入设备型号' },
      labelWidth: '100',
    },
    {
      fieldName: 'area',
      label: '安装区域',
      component: 'Input',
      componentProps: { placeholder: '请输入安装区域' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'factory',
      label: '厂家信息',
      component: 'Input',
      componentProps: { placeholder: '请输入厂家信息' },
      labelWidth: '100',
    },
    {
      fieldName: 'factoryPhone',
      label: '联系方式',
      component: 'Input',
      componentProps: { placeholder: '请输入联系方式' },
      labelWidth: '100',
    },
  ];
}

// 报修表单 schema
export function useRepairFormSchema() {
  return [
    {
      fieldName: 'repairContent',
      label: '报修内容',
      component: 'Input',
      componentProps: { placeholder: '请输入故障描述', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 排查表单 schema
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'checkResult',
      label: '排查结果',
      component: 'Input',
      componentProps: { placeholder: '请输入排查结果', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 派单表单 schema
export function useOrderFormSchema() {
  return [
    {
      fieldName: 'userId',
      label: '维修人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择维修人员',
        options: [
          { label: '张三工程师', value: 1001 },
          { label: '李四工程师', value: 1002 },
          { label: '王五工程师', value: 1003 },
        ],
        filterable: true,
      },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 验收表单 schema
export function useAcceptFormSchema() {
  return [
    {
      fieldName: 'acceptResult',
      label: '验收结果',
      component: 'Input',
      componentProps: { placeholder: '请输入验收结果', type: 'textarea', rows: 3 },
      rules: 'required',
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  addText: '新增设备',
  editText: '编辑设备',
  deleteText: '删除',
  restartText: '重启',
  repairText: '报修',
  filterText: '筛选',
  refreshText: '刷新',
  checkText: '排查',
  orderText: '派单',
  acceptText: '验收',
  excelName: '设备管理列表',
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
