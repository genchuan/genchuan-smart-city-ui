// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'studentNo',
      label: '学生编号',
      component: 'Input',
      componentProps: { placeholder: '请输入学生编号' },
      labelWidth: '100',
    },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入姓名' },
      labelWidth: '100',
    },
    {
      fieldName: 'className',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级名称' },
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '专业',
      component: 'Input',
      componentProps: { placeholder: '请输入专业' },
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '学籍状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学籍状态',
        clearable: true,
        options: [
          { label: '在籍', value: '0' },
          { label: '休学', value: '1' },
          { label: '退学', value: '2' },
          { label: '异动', value: '3' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'processStatus',
      label: '流程状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择流程状态',
        clearable: true,
        options: [
          { label: '待审核', value: '0' },
          { label: '正常', value: '1' },
          { label: '已归档', value: '2' },
        ],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'archiveTime',
      label: '建档时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '-',
        startPlaceholder: '起始',
        endPlaceholder: '结束',
        format: 'YYYY-MM-DD',
        valueFormat: 'x',
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'studentNo', title: '学生编号', minWidth: 120, slots: { default: 'studentNo' } },
    { field: 'name', title: '姓名', minWidth: 100, slots: { default: 'name' } },
    { field: 'classId', title: '班级', minWidth: 150, slots: { default: 'classId' } },
    { field: 'major', title: '专业', minWidth: 150 },
    { field: 'level', title: '层次', minWidth: 100 },
    { field: 'studyType', title: '学习形式', minWidth: 100 },
    { field: 'idCard', title: '身份证号', minWidth: 180 },
    { field: 'phone', title: '联系电话', minWidth: 120 },
    { field: 'parentPhone', title: '家长电话', minWidth: 120 },
    { field: 'status', title: '学籍状态', minWidth: 100, slots: { default: 'status' } },
    { field: 'archiveTime', title: '建档时间', minWidth: 180, slots: { default: 'archiveTime' } },
    { field: 'processStatus', title: '流程状态', minWidth: 100, slots: { default: 'processStatus' } },
    { field: 'rejectReason', title: '驳回原因', minWidth: 150 },
    { field: 'changeReason', title: '异动原因', minWidth: 150 },
    { field: 'evidenceUrl', title: '佐证材料', minWidth: 100, slots: { default: 'evidenceUrl' } },
    { field: 'creator', title: '建档人', minWidth: 100, slots: { default: 'creator' } },
    { field: 'createTime', title: '建档时间(系统)', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updater', title: '审核/维护人', minWidth: 120, slots: { default: 'updater' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
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

// 新增/编辑表单 schema
export function useArchiveFormSchema(isEdit = false) {
  return [
    {
      fieldName: 'studentNo',
      label: '学生编号',
      component: 'Input',
      componentProps: { placeholder: '请输入学生编号', disabled: isEdit },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入姓名' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'classId',
      label: '班级',
      component: 'Input',
      componentProps: { placeholder: '请输入班级ID' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'major',
      label: '专业',
      component: 'Input',
      componentProps: { placeholder: '请输入专业' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'level',
      label: '层次',
      component: 'Input',
      componentProps: { placeholder: '请输入层次' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'studyType',
      label: '学习形式',
      component: 'Input',
      componentProps: { placeholder: '请输入学习形式' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'idCard',
      label: '身份证号',
      component: 'Input',
      componentProps: { placeholder: '请输入身份证号', disabled: isEdit },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入联系电话' },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'parentPhone',
      label: '家长电话',
      component: 'Input',
      componentProps: { placeholder: '请输入家长电话' },
      labelWidth: '100',
    },
    {
      fieldName: 'archiveTime',
      label: '建档时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择建档时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
      rules: 'required',
      defaultValue: Date.now(),
      labelWidth: '100',
    },
    {
      fieldName: 'status',
      label: '学籍状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择学籍状态',
        options: [
          { label: '在籍', value: '0' },
          { label: '休学', value: '1' },
          { label: '退学', value: '2' },
          { label: '异动', value: '3' },
        ],
      },
      rules: 'required',
      defaultValue: '0',
      labelWidth: '100',
    },
    {
      fieldName: 'processStatus',
      label: '流程状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择流程状态',
        options: [
          { label: '待审核', value: '0' },
          { label: '正常', value: '1' },
          { label: '已归档', value: '2' },
        ],
      },
      rules: 'required',
      defaultValue: '0',
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

// 审核表单 schema（字段名改为 processStatus）
export function useAuditFormSchema() {
  return [
    {
      fieldName: 'processStatus',
      label: '审核结果',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '通过', value: '1' },   // 正常
          { label: '驳回', value: '0' },   // 待审核
        ],
      },
      rules: 'required',
      defaultValue: '1',
      labelWidth: '100',
    },
    {
      fieldName: 'rejectReason',
      label: '驳回原因',
      component: 'Input',
      componentProps: { placeholder: '请输入驳回原因', type: 'textarea', rows: 2 },
      labelWidth: '100',
      ifShow: (model) => model.processStatus === '0',
    },
  ];
}

// 维护表单 schema（学籍状态变更）
export function useMaintainFormSchema() {
  return [
    {
      fieldName: 'status',
      label: '学籍状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择新的学籍状态',
        options: [
          { label: '休学', value: '1' },
          { label: '退学', value: '2' },
          { label: '异动', value: '3' },
        ],
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'changeReason',
      label: '异动原因',
      component: 'Input',
      componentProps: { placeholder: '请输入异动原因', type: 'textarea', rows: 2 },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'evidenceUrl',
      label: '佐证材料',
      component: 'Input',
      componentProps: { placeholder: '请输入佐证材料地址' },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  addText: '新增',
  importText: '批量导入',
  exportText: '批量导出',
  editText: '编辑',
  auditText: '审核',
  maintainText: '维护',
  viewText: '查看',
  excelName: '学籍档案列表',
};
