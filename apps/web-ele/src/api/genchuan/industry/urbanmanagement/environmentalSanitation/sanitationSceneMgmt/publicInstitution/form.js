// 新增/编辑表单 schema（机构基础信息）
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '机构名称',
      component: 'Input',
      componentProps: { placeholder: '请输入机构名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'institutionType',
      label: '机构类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择机构类型',
        options: [
          { label: '学校', value: '学校' },
          { label: '医院', value: '医院' },
          { label: '机关单位', value: '机关单位' },
          { label: '商业楼宇', value: '商业楼宇' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '机构地址',
      component: 'Input',
      componentProps: { placeholder: '请输入详细地址' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'area',
      label: '所属区域',
      component: 'Input',
      componentProps: { placeholder: '如：芗城区-巷口街道' },
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
      fieldName: 'status',
      label: '运营状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择运营状态',
        options: [
          { label: '正常运营', value: '正常运营' },
          { label: '部分停机', value: '部分停机' },
          { label: '停运', value: '停运' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '120',
      rules: 'required',
    },
  ];
}

// 根据状态获取表格列定义
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      { field: 'toiletName', title: '机构名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'institutionType', title: '机构类型', minWidth: 120, sortable: true, slots: { default: 'institutionType' } },
      { field: 'location', title: '机构地址', minWidth: 200, sortable: true },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'manager', title: '负责人', minWidth: 120, sortable: true },
      { field: 'status', title: '运营状态', minWidth: 120, sortable: true, slots: { default: 'status' } },
      { field: 'cleaningRate', title: '保洁达标率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'problemRate', title: '问题办结率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'wasteVolume', title: '垃圾清运量(kg)', minWidth: 130, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}kg` : '-') },
      { field: 'inspectionPassRate', title: '核查通过率(%)', minWidth: 130, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
    ],
    保洁待执行: [
      { field: 'toiletName', title: '机构名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      { field: 'cleaningStandard', title: '保洁标准', minWidth: 120, sortable: true },
      { field: 'cleaningFrequency', title: '保洁频次', minWidth: 120, sortable: true },
      { field: 'cleaningTime', title: '保洁时段', minWidth: 180, sortable: true },
      { field: 'cleaner', title: '保洁人员', minWidth: 150, sortable: true },
      { field: 'responsibilityArea', title: '责任区域', minWidth: 200, sortable: true },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      { field: 'isEffective', title: '是否生效', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    问题待处置: [
      { field: 'complaintId', title: '问题编号', minWidth: 150, sortable: true, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '关联机构', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'complaintType', title: '问题类型', minWidth: 120, sortable: true, slots: { default: 'complaintType' } },
      { field: 'problemLocation', title: '问题位置', minWidth: 150, sortable: true },
      { field: 'complaintName', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'complaintTime', title: '上报时间', minWidth: 180, sortable: true },
      { field: 'phone', title: '联系电话', minWidth: 120, sortable: true },
      { field: 'dispatchStatus', title: '派单状态', minWidth: 100, sortable: true },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    核查待验收: [
      { field: 'repairId', title: '核查编号', minWidth: 150, sortable: true, slots: { default: 'repairId' } },
      { field: 'toiletName', title: '关联机构', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'facilityType', title: '任务类型', minWidth: 120, sortable: true, slots: { default: 'facilityType' } },
      { field: 'damageDesc', title: '任务描述', minWidth: 200, sortable: true },
      { field: 'reportBy', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'reportTime', title: '上报时间', minWidth: 180, sortable: true },
      { field: 'photoUrl', title: '现场照片', minWidth: 100, sortable: true, slots: { default: 'photoUrl' } },
      { field: 'repairBy', title: '核查人员', minWidth: 120, sortable: true },
      { field: 'repairStatus', title: '核查状态', minWidth: 100, sortable: true },
      { field: 'expectedCompleteTime', title: '预计完成时间', minWidth: 180, sortable: true },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, sortable: true, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '关联机构', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180, sortable: true },
      { field: 'handler', title: '处置人员', minWidth: 120, sortable: true },
      { field: 'handleResult', title: '处置结果', minWidth: 120, sortable: true },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, sortable: true, slots: { default: 'proofUrl' } },
      { field: 'handleDuration', title: '任务耗时', minWidth: 100, sortable: true },
      { field: 'cleaningQualifiedRate', title: '保洁达标率(%)', minWidth: 140, sortable: true },
      { field: 'problemCompleteRate', title: '问题办结率(%)', minWidth: 140, sortable: true },
      { field: 'inspectionPassRate', title: '核查通过率(%)', minWidth: 140, sortable: true },
      { field: 'statPeriod', title: '统计周期', minWidth: 120, sortable: true },
    ],
  };

  const columns = [...baseColumns, ...(statusColumnsMap[status] || statusColumnsMap.全部)];
  columns.push({
    title: '操作',
    width: 160,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return columns;
}

// 文本常量
export const textObj = {
  editText: '编辑机构信息',
  addText: '新增机构',
  excelName: '公共机构环境管理任务列表',
  excelAllName: '公共机构环境管理任务_区域_日期.xlsx',
  total: '机构总数3;保洁待执行3;问题待处置3;核查待验收3;已完成3',
};
