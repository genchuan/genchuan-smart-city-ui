// 新增/编辑表单 schema
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '公厕名称',
      component: 'Input',
      componentProps: { placeholder: '请输入公厕名称' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'area',
      label: '所属区域',
      component: 'Input',
      componentProps: { placeholder: '如：芗城区-巷口街道' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'cleaningFrequency',
      label: '保洁频次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择保洁频次',
        options: [
          { label: '每日一次', value: '每日一次' },
          { label: '每日两次', value: '每日两次' },
          { label: '每周三次', value: '每周三次' },
          { label: '每周一次', value: '每周一次' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'cleaningTime',
      label: '保洁时段',
      component: 'Input',
      componentProps: { placeholder: '如 07:00-09:00（多个用逗号分隔）' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'cleaningContent',
      label: '保洁内容',
      component: 'Input',
      componentProps: { placeholder: '请输入保洁内容' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'cleaner',
      label: '保洁人员',
      component: 'Input',
      componentProps: { placeholder: '请输入保洁人员姓名（多个用逗号分隔）' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'cleaningStandard',
      label: '保洁标准',
      component: 'Select',
      componentProps: {
        placeholder: '请选择保洁标准',
        options: [
          { label: '一级标准', value: '一级标准' },
          { label: '二级标准', value: '二级标准' },
          { label: '三级标准', value: '三级标准' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
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
      searchFilter: true,
    },
  ];
}

// 根据状态获取表格列定义
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      { field: 'toiletName', title: '公厕名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'location', title: '公厕位置', minWidth: 180, sortable: true },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'openHours', title: '开放时段', minWidth: 150, sortable: true },
      { field: 'stallCount', title: '蹲位数量', minWidth: 100, sortable: true },
      { field: 'status', title: '运营状态', minWidth: 120, sortable: true, slots: { default: 'status' } },
      { field: 'manager', title: '负责人', minWidth: 120, sortable: true },
      { field: 'cleaningRate', title: '保洁达标率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'complaintRate', title: '投诉办结率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'warningCount', title: '耗材库存预警数', minWidth: 140, sortable: true },
      { field: 'facilityRate', title: '设施完好率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
    ],
    保洁待执行: [
      { field: 'toiletName', title: '公厕名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      { field: 'cleaningFrequency', title: '保洁频次', minWidth: 120, sortable: true },
      { field: 'cleaningTime', title: '保洁时段', minWidth: 180, sortable: true },
      { field: 'cleaningContent', title: '保洁内容', minWidth: 200, sortable: true },
      { field: 'cleaner', title: '保洁人员', minWidth: 150, sortable: true },
      { field: 'cleaningStandard', title: '保洁标准', minWidth: 120, sortable: true },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      { field: 'isEffective', title: '是否生效', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    物资待补充: [
      { field: 'toiletName', title: '公厕名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      { field: 'consumableName', title: '物资名称', minWidth: 150, sortable: true, slots: { default: 'consumableName' } },
      { field: 'currentStock', title: '当前库存', minWidth: 100, sortable: true },
      { field: 'threshold', title: '预警阈值', minWidth: 100, sortable: true },
      { field: 'gap', title: '缺口数量', minWidth: 100, sortable: true },
      { field: 'manager', title: '负责人', minWidth: 120, sortable: true },
      { field: 'warningStatus', title: '预警状态', minWidth: 100, sortable: true },
      { field: 'lastSupplyTime', title: '上次补充时间', minWidth: 180, sortable: true },
      { field: 'supplyCycle', title: '补充周期', minWidth: 120, sortable: true },
    ],
    投诉待处置: [
      { field: 'complaintId', title: '投诉编号', minWidth: 150, sortable: true, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '关联公厕', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'complaintType', title: '投诉类型', minWidth: 120, sortable: true, slots: { default: 'complaintType' } },
      { field: 'complaintContent', title: '投诉内容', minWidth: 200, sortable: true },
      { field: 'complaintName', title: '投诉人', minWidth: 120, sortable: true },
      { field: 'complaintTime', title: '投诉时间', minWidth: 180, sortable: true },
      { field: 'phone', title: '联系电话', minWidth: 120, sortable: true },
      { field: 'dispatchStatus', title: '派单状态', minWidth: 100, sortable: true },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      { field: 'isTimeout', title: '是否超时', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    设施待维修: [
      { field: 'repairId', title: '维修编号', minWidth: 150, sortable: true, slots: { default: 'repairId' } },
      { field: 'toiletName', title: '关联公厕', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'facilityType', title: '设施类型', minWidth: 120, sortable: true, slots: { default: 'facilityType' } },
      { field: 'damageDesc', title: '损坏情况', minWidth: 200, sortable: true },
      { field: 'reportBy', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'reportTime', title: '上报时间', minWidth: 180, sortable: true },
      { field: 'photoUrl', title: '现场照片', minWidth: 100, sortable: true, slots: { default: 'photoUrl' } },
      { field: 'repairBy', title: '维修人员', minWidth: 120, sortable: true },
      { field: 'repairStatus', title: '维修状态', minWidth: 100, sortable: true },
      { field: 'expectedCompleteTime', title: '预计完成时间', minWidth: 180, sortable: true },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, sortable: true, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '关联公厕', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180, sortable: true },
      { field: 'handler', title: '处置人员', minWidth: 120, sortable: true },
      { field: 'handleResult', title: '处置结果', minWidth: 120, sortable: true },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, sortable: true, slots: { default: 'proofUrl' } },
      { field: 'handleDuration', title: '任务耗时', minWidth: 100, sortable: true },
      { field: 'satisfaction', title: '满意度', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? `${cellValue}%` : '-') },
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
  editText: '编辑保洁计划',
  addText: '新增保洁计划',
  excelName: '公厕运营任务列表',
  excelAllName: '公厕运营任务_区域_日期.xlsx',
  total: '公厕运营任务总数18;保洁待执行3;物资待补充4;投诉待处置3;设施待维修4;已完成4',
};
