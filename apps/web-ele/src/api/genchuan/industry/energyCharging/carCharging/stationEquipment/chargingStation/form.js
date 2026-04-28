// ---------- 新增/编辑表单 schema（充电场站基础信息） ----------
export function useFormSchema() {
  return [
    {
      fieldName: 'stationCode',
      label: '场站编号',
      component: 'Input',
      componentProps: { placeholder: '请输入场站编号，唯一' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: { placeholder: '请输入场站名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'address',
      label: '场站地址',
      component: 'Input',
      componentProps: { placeholder: '请输入详细地址' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'coopMode',
      label: '合作模式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择合作模式',
        options: [
          { label: '自营', value: 'self' },
          { label: '联营', value: 'joint' },
          { label: '加盟', value: 'franchise' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'openTime',
      label: '开放时间',
      component: 'TimePicker',
      componentProps: {
        isRange: true,               // 开启范围选择
        rangeSeparator: '-',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        format: 'HH:mm',
        valueFormat: 'HH:mm',
        placeholder: '请选择开放时间段',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'priceService',
      label: '电价服务费',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 0, step: 0.01 },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'manager',
      label: '负责人',
      component: 'Input',
      componentProps: { placeholder: '请输入负责人姓名' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'lon',
      label: '经度',
      component: 'InputNumber',
      componentProps: { placeholder: '经度', step: 0.000001 },
      labelWidth: '120',
    },
    {
      fieldName: 'lat',
      label: '纬度',
      component: 'InputNumber',
      componentProps: { placeholder: '纬度', step: 0.000001 },
      labelWidth: '120',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注信息' },
      labelWidth: '120',
    },
  ];
}

// ---------- 批量编辑表单 schema ----------
export function useBatchUpdateSchema() {
  return [
    {
      fieldName: 'coopMode',
      label: '合作模式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择合作模式（可选）',
        options: [
          { label: '自营', value: 'self' },
          { label: '联营', value: 'joint' },
          { label: '加盟', value: 'franchise' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'manager',
      label: '负责人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入负责人姓名（可选）',
        clearable: true,
      },
      labelWidth: '100',
    },
  ];
}

// ---------- 搜索表单 schema ----------
export function useSearchSchema() {
  return [
    {
      fieldName: 'stationCode',
      label: '场站编号',
      component: 'Input',
      componentProps: { placeholder: '请输入场站编号', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'stationName',
      label: '场站名称',
      component: 'Input',
      componentProps: { placeholder: '请输入场站名称', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'address',
      label: '场站地址',
      component: 'Input',
      componentProps: { placeholder: '请输入场站地址', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'coopMode',
      label: '合作模式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '自营', value: 'self' },
          { label: '联营', value: 'joint' },
          { label: '加盟', value: 'franchise' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'stationStatus',
      label: '场站状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '未启用', value: 'wait' },
          { label: '已启用', value: 'enabled' },
          { label: '已停用', value: 'disabled' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
  ];
}

// ---------- 停用弹窗 schema ----------
export function useDisableSchema() {
  return [
    {
      fieldName: 'stopReason',
      label: '停用原因',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入停用原因',
      },
      labelWidth: '100',
      rules: 'required',
    },
  ];
}

// ---------- 启用确认弹窗（无表单字段） ----------
// 该弹窗不需要 schema，直接使用 confirm 对话框即可

// 时间戳格式化函数（用于表格列）
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;
  return date.toLocaleString();
};

// ---------- 表格列配置（全部状态） ----------
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      { field: 'stationCode', title: '场站编号', minWidth: 130, sortable: true, slots: { default: 'stationCode' } },
      { field: 'stationName', title: '场站名称', minWidth: 150, sortable: true, slots: { default: 'stationName' } },
      { field: 'address', title: '场站地址', minWidth: 200, slots: { default: 'address' } },
      { field: 'coopMode', title: '合作模式', minWidth: 120, slots: { default: 'coopMode' } },
      { field: 'openTime', title: '开放时间', minWidth: 150 },
      { field: 'priceService', title: '电价服务费(元/度)', minWidth: 150 },
      { field: 'manager', title: '负责人', minWidth: 120, slots: { default: 'manager' } },
      { field: 'stationStatus', title: '场站状态', minWidth: 120, slots: { default: 'status' } },
      { field: 'stopReason', title: '停用原因', minWidth: 150 },
      { field: 'remark', title: '备注', minWidth: 180 },
      { field: 'createTime', title: '创建时间', minWidth: 180, formatter: ({ cellValue }) => formatTimestamp(cellValue) },
      { field: 'updateTime', title: '更新时间', minWidth: 180, formatter: ({ cellValue }) => formatTimestamp(cellValue) },
    ],
  };

  const columns = [...baseColumns, ...(statusColumnsMap[status] || statusColumnsMap.全部)];
  columns.push({
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return columns;
}

// 文本常量
export const textObj = {
  editText: '编辑场站信息',
  addText: '新增场站',
  excelName: '充电场站管理列表',
  excelAllName: '充电场站管理_区域_日期.xlsx',
};
