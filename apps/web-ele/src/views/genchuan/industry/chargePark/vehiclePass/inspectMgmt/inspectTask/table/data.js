/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      taskType: '违规通行稽查',
      dispatchTime: '2025-04-18 08:30:15',
      deadlineTime: '2025-04-20 18:00:00',
      status: '待派发',
      areaName: '芗城区',
      executeUserName: '',
      finishTime: '',
      taskProgress: '',
      remark: '稽查违规通行车辆',
      createTime: '2025-04-18 08:30:15',
    },
    {
      id: 2,
      taskType: '欠费逃费稽查',
      dispatchTime: '2025-04-18 09:15:30',
      deadlineTime: '2025-04-21 18:00:00',
      status: '待认领',
      areaName: '龙文区',
      executeUserName: '张三',
      finishTime: '',
      taskProgress: '',
      remark: '稽查欠费逃费车辆',
      createTime: '2025-04-18 09:15:30',
    },
    {
      id: 3,
      taskType: '违规通行稽查',
      dispatchTime: '2025-04-18 10:20:45',
      deadlineTime: '2025-04-22 18:00:00',
      status: '处理中',
      areaName: '龙海区',
      executeUserName: '李四',
      finishTime: '',
      taskProgress: '已联系车主，等待处理',
      remark: '稽查违规通行车辆',
      createTime: '2025-04-18 10:20:45',
    },
    {
      id: 4,
      taskType: '欠费逃费稽查',
      dispatchTime: '2025-04-17 14:30:00',
      deadlineTime: '2025-04-19 18:00:00',
      status: '已完成',
      areaName: '芗城区',
      executeUserName: '王五',
      finishTime: '2025-04-19 16:30:00',
      taskProgress: '已完成处理',
      remark: '稽查欠费逃费车辆',
      createTime: '2025-04-17 14:30:00',
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'taskType',
      label: '任务类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务类型',
        options: [
          { label: '违规通行稽查', value: '违规通行稽查' },
          { label: '欠费逃费稽查', value: '欠费逃费稽查' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待派发', value: '待派发' },
          { label: '待认领', value: '待认领' },
          { label: '处理中', value: '处理中' },
          { label: '已完成', value: '已完成' },
          { label: '已归档', value: '已归档' },
        ],
      },
    },
    {
      fieldName: 'areaId',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [],
      },
    },
    {
      fieldName: 'dispatchTime',
      label: '派发时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择派发时间',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  ];
}

/** 新增表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'taskType',
      label: '任务类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务类型',
        options: [
          { label: '违规通行稽查', value: '违规通行稽查' },
          { label: '欠费逃费稽查', value: '欠费逃费稽查' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'areaId',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'deadlineTime',
      label: '截止时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择截止时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 3,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '任务ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'taskType',
      title: '任务类型',
      minWidth: 140,
      sortable: true,
      slots: { default: 'taskType' },
    },
    {
      field: 'dispatchTime',
      title: '派发时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'deadlineTime',
      title: '截止时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'areaName',
      title: '片区',
      minWidth: 120,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'executeUserName',
      title: '执行人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'executeUserName' },
    },
    {
      field: 'finishTime',
      title: '完成时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'taskProgress',
      title: '任务进度',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑稽查任务',
  addText: '新增稽查任务',
  excelName: '稽查任务列表',
  excelAllName: '稽查任务导出.xlsx',
  total: '总计: 任务4条; 待派发1条; 待认领1条; 处理中1条; 已完成1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '任务ID' },
  { key: 'taskType', label: '任务类型' },
  { key: 'dispatchTime', label: '派发时间' },
  { key: 'deadlineTime', label: '截止时间' },
  { key: 'status', label: '状态' },
  { key: 'areaName', label: '片区' },
  { key: 'executeUserName', label: '执行人' },
  { key: 'finishTime', label: '完成时间' },
  { key: 'taskProgress', label: '任务进度' },
  { key: 'remark', label: '备注' },
  { key: 'createTime', label: '创建时间' },
];
