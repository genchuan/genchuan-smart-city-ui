// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'clubName',
      label: '社团名称',
      component: 'Input',
      componentProps: { placeholder: '请输入社团名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'Input',
      componentProps: { placeholder: '请输入学号' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        clearable: true,
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
          { label: '已建档', value: '已建档' },
        ],
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'clubName', title: '社团名称', minWidth: 120, sortable: true, slots: { default: 'clubName' } },
    { field: 'clubType', title: '社团类型', minWidth: 100, sortable: true, slots: { default: 'clubType' } },
    { field: 'studentId', title: '学号', minWidth: 100, sortable: true, slots: { default: 'studentId' } },
    { field: 'status', title: '状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'venueApplyStatus', title: '场馆申请状态', minWidth: 120, sortable: true, },
    { field: 'applyTime', title: '申请时间', minWidth: 180, sortable: true, slots: { default: 'applyTime' } },
    { field: 'auditUser', title: '审核人', minWidth: 120, sortable: true, },
    { field: 'auditTime', title: '审核时间', minWidth: 180, sortable: true, slots: { default: 'auditTime' } },
    { field: 'archiveTime', title: '建档时间', minWidth: 180, sortable: true, slots: { default: 'archiveTime' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, slots: { default: 'updateTime' } },
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

// 前端写死的社团列表
const clubOptions = [
  { label: '篮球社', value: '篮球社' },
  { label: '文学社', value: '文学社' },
  { label: '志愿者协会', value: '志愿者协会' },
  { label: '动漫社', value: '动漫社' },
  { label: '舞蹈社', value: '舞蹈社' },
  { label: '书法社', value: '书法社' },
  { label: '环保协会', value: '环保协会' },
  { label: '摄影社', value: '摄影社' },
];

// 申请表单 schema（社团类型手动选择，不禁用）
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'clubName',
      label: '社团名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择社团',
        filterable: true,
        options: clubOptions,
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'clubType',
      label: '社团类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择社团类型',
        options: [
          { label: '文体', value: '文体' },
          { label: '学术', value: '学术' },
          { label: '志愿', value: '志愿' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'studentId',
      label: '学号',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入学号',
        controls: false,
        style: 'width: 100%',
        min: 1,
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '申请时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择申请时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        disabled: true,
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
          { label: '已建档', value: '已建档' },
        ],
      },
      defaultValue: '待审核',
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

// 场馆申请表单 schema
export function useVenueApplyFormSchema() {
  return [
    {
      fieldName: 'venueName',
      label: '场馆名称',
      component: 'Input',
      componentProps: { placeholder: '请输入场馆名称' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyTime',
      label: '申请使用时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择使用时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'applyReason',
      label: '申请原因',
      component: 'Input',
      componentProps: { placeholder: '请输入申请原因', type: 'textarea', rows: 3 },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  editText: '编辑入团申请',
  addText: '入团申请',
  excelName: '社团管理列表',
};
