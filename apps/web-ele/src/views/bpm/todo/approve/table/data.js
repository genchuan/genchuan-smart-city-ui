// data.js

/** 新增/编辑表单配置（发起审批） */
export function useFormSchema() {
  return [
    {
      fieldName: 'processDefinitionId',
      label: '选择流程',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择审批流程',
        options: [],  // 动态加载
        valueField: 'id',
        labelField: 'name',
      },
    },
    {
      fieldName: 'businessType',
      label: '业务类型',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择业务类型',
        options: [
          { label: '采购审批', value: '采购审批' },
          { label: '变更审批', value: '变更审批' },
          { label: '上线审批', value: '上线审批' },
          { label: '人事审批', value: '人事审批' },
          { label: '权限审批', value: '权限审批' },
          { label: '财务审批', value: '财务审批' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'approveTitle',
      label: '审批标题',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入审批标题', maxlength: 50 },
    },
    {
      fieldName: 'reason',
      label: '申请理由',
      component: 'Input',
      rules: 'required',
      componentProps: { type: 'textarea', rows: 4, placeholder: '请输入申请理由', maxlength: 500 },
    },
    {
      fieldName: 'emergencyDegree',
      label: '紧急程度',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择紧急程度',
        options: [
          { label: '紧急', value: '紧急' },
          { label: '高', value: '高' },
          { label: '中', value: '中' },
          { label: '低', value: '低' },
        ],
      },
    },
    {
      fieldName: 'deadline',
      label: '截止时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', placeholder: '请选择截止时间' },
    },
    {
      fieldName: 'attachment',
      label: '附件',
      component: 'Upload',
      componentProps: { multiple: true, limit: 3, fileList: [] },
    },
  ];
}

/** 查询表单配置 - 根据模块动态返回 */
export function useQuerySchema(moduleType = 'waiting') {
  const base = [
    {
      fieldName: 'name',
      label: '审批标题',
      component: 'Input',
      componentProps: { placeholder: '请输入审批标题' },
    },
  ];
  switch (moduleType) {
    case 'waiting':
      return [
        ...base,
        {
          fieldName: 'category',
          label: '业务类型',
          component: 'Select',
          componentProps: {
            options: [
              { label: '采购审批', value: '采购审批' },
              { label: '变更审批', value: '变更审批' },
              { label: '上线审批', value: '上线审批' },
              { label: '人事审批', value: '人事审批' },
              { label: '权限审批', value: '权限审批' },
              { label: '财务审批', value: '财务审批' },
            ],
            placeholder: '请选择业务类型',
          },
        },
        { fieldName: 'startUserId', label: '申请人', component: 'Input', componentProps: { placeholder: '请输入申请人' } },
        { fieldName: 'createTime', label: '申请时间', component: 'DatePicker', componentProps: { type: 'daterange' } },
      ];
    case 'approved':
      return [
        ...base,
        { fieldName: 'category', label: '业务类型', component: 'Select', componentProps: { options: [] } },
        {
          fieldName: 'approveResult',
          label: '审批结果',
          component: 'Select',
          componentProps: { options: [{ label: '同意', value: '同意' }, { label: '驳回', value: '驳回' }] },
        },
        { fieldName: 'createTime', label: '申请时间', component: 'DatePicker', componentProps: { type: 'daterange' } },
      ];
    case 'myApply':
      return [
        ...base,
        { fieldName: 'category', label: '业务类型', component: 'Select', componentProps: { options: [] } },
        {
          fieldName: 'status',
          label: '审批状态',
          component: 'Select',
          componentProps: { options: [{ label: '进行中', value: 1 }, { label: '已完成', value: 2 }, { label: '已取消', value: 3 }] },
        },
        { fieldName: 'startTime', label: '提交时间', component: 'DatePicker', componentProps: { type: 'daterange' } },
      ];
    case 'copy':
      return [
        ...base,
        { fieldName: 'category', label: '审批类型', component: 'Select', componentProps: { options: [] } },
        { fieldName: 'createTime', label: '抄送时间', component: 'DatePicker', componentProps: { type: 'daterange' } },
      ];
    default:
      return base;
  }
}

/** 表格列配置 - 根据模块动态返回 */
export function useGridColumns(moduleType = 'waiting') {
  const baseColumns = [
    { type: 'checkbox', width: 40 },
    { field: 'approveTitle', title: '审批标题', minWidth: 200, sortable: true, slots: { default: 'approveTitle' } },
  ];
  switch (moduleType) {
    case 'waiting':
      return [
        ...baseColumns,
        { field: 'businessType', title: '业务类型', minWidth: 100, slots: { default: 'businessType' } },
        { field: 'applicant', title: '申请人', minWidth: 100 },
        { field: 'applyTime', title: '申请时间', minWidth: 160 },
        { field: 'emergencyDegree', title: '紧急程度', minWidth: 100, slots: { default: 'emergencyDegree' } },
        { field: 'deadline', title: '截止时间', minWidth: 160 },
        { title: '操作', width: 250, fixed: 'right', slots: { default: 'waitingActions' } },
      ];
    case 'approved':
      return [
        ...baseColumns,
        { field: 'businessType', title: '业务类型', minWidth: 100 },
        { field: 'applicant', title: '申请人', minWidth: 100 },
        { field: 'applyTime', title: '申请时间', minWidth: 160 },
        { field: 'approveResult', title: '审批结果', minWidth: 100, slots: { default: 'approveResult' } },
        { field: 'approveTime', title: '审批时间', minWidth: 160 },
        { field: 'opinion', title: '审批意见', minWidth: 150 },
        { title: '操作', width: 200, fixed: 'right', slots: { default: 'approvedActions' } },
      ];
    case 'myApply':
      return [
        ...baseColumns,
        { field: 'businessType', title: '业务类型', minWidth: 100 },
        { field: 'currentNode', title: '当前节点', minWidth: 120 },
        { field: 'approver', title: '审批人', minWidth: 100 },
        { field: 'applyTime', title: '提交时间', minWidth: 160 },
        { field: 'approveStatus', title: '审批状态', minWidth: 100, slots: { default: 'approveStatus' } },
        { title: '操作', width: 200, fixed: 'right', slots: { default: 'myApplyActions' } },
      ];
    case 'copy':
      return [
        ...baseColumns,
        { field: 'businessType', title: '审批类型', minWidth: 100 },
        { field: 'applicant', title: '申请人', minWidth: 100 },
        { field: 'currentNode', title: '当前节点', minWidth: 120 },
        { field: 'copyTime', title: '抄送时间', minWidth: 160 },
        { field: 'flowSummary', title: '流转摘要', minWidth: 180 },
        { field: 'copyStatus', title: '状态', width: 80, slots: { default: 'copyStatus' } },
        { title: '操作', width: 180, fixed: 'right', slots: { default: 'copyActions' } },
      ];
    default:
      return baseColumns;
  }
}

export const textObj = {
  addText: '发起审批',
  excelName: '审批列表',
  excelAllName: '审批数据.xlsx',
};
