// 新增/编辑表单 schema
export function useFormSchema() {
  return [
    {
      fieldName: 'planNo',
      label: '清扫计划编号',
      component: 'Input',
      componentProps: { placeholder: '请输入计划编号' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'roadName',
      label: '清扫路段',
      component: 'Input',
      componentProps: { placeholder: '请输入清扫路段' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'area',
      label: '责任区域',
      component: 'Input',
      componentProps: { placeholder: '如：芗城区-巷口街道' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'frequency',
      label: '清扫频次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择清扫频次',
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
      fieldName: 'timePeriod',
      label: '清扫时段',
      component: 'Input',
      componentProps: { placeholder: '如 05:00-07:00（多个用逗号分隔）' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'staff',
      label: '负责人员',
      component: 'Input',
      componentProps: { placeholder: '请输入负责人员姓名（多个用逗号分隔）' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'standard',
      label: '清扫标准',
      component: 'Select',
      componentProps: {
        placeholder: '请选择清扫标准',
        options: [
          { label: '一级道路清扫标准', value: '一级道路清扫标准' },
          { label: '二级道路清扫标准', value: '二级道路清扫标准' },
          { label: '三级道路清扫标准', value: '三级道路清扫标准' },
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
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true, slots: { default: 'roadName' } },
      { field: 'area', title: '责任区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'frequency', title: '清扫频次', minWidth: 120, sortable: true },
      { field: 'timePeriod', title: '清扫时段', minWidth: 180, sortable: true },
      { field: 'staff', title: '负责人员', minWidth: 150, sortable: true },
      { field: 'status', title: '计划状态', minWidth: 120, sortable: true, slots: { default: 'status' } },
      { field: 'qualityRate', title: '质量达标率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined && cellValue !== null ? `${cellValue}%` : '-') },
      { field: 'problemCount', title: '问题处置数', minWidth: 100, sortable: true },
      { field: 'attendanceRate', title: '考勤全勤率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined && cellValue !== null ? `${cellValue}%` : '-') },
    ],
    清扫待执行: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'area', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'frequency', title: '清扫频次', minWidth: 120, sortable: true },
      { field: 'timePeriod', title: '清扫时段', minWidth: 180, sortable: true },
      { field: 'staff', title: '负责人员', minWidth: 150, sortable: true },
      { field: 'tool', title: '清扫工具', minWidth: 150, sortable: true },
      { field: 'standard', title: '清扫标准', minWidth: 150, sortable: true },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      { field: 'isEffective', title: '是否生效', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    作业进行中: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'area', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'staff', title: '负责人员', minWidth: 150, sortable: true },
      { field: 'checkinTime', title: '到岗时间', minWidth: 160, sortable: true },
      { field: 'progress', title: '当前进度(%)', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'operationStatus', title: '作业状态', minWidth: 100, sortable: true },
      { field: 'trackCoverage', title: '轨迹覆盖', minWidth: 100, sortable: true },
      { field: 'lastReportTime', title: '最新上报时间', minWidth: 160, sortable: true },
      { field: 'isAbnormal', title: '是否异常', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    问题待处置: [
      { field: 'problemId', title: '问题编号', minWidth: 150, sortable: true, slots: { default: 'problemId' } },
      { field: 'planNo', title: '关联计划', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'problemType', title: '问题类型', minWidth: 120, sortable: true, slots: { default: 'problemType' } },
      { field: 'location', title: '问题位置', minWidth: 200, sortable: true },
      { field: 'reportBy', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'reportTime', title: '上报时间', minWidth: 160, sortable: true },
      { field: 'desc', title: '问题描述', minWidth: 200, sortable: true },
      { field: 'team', title: '处置组', minWidth: 120, sortable: true },
      { field: 'handleStatus', title: '处置状态', minWidth: 100, sortable: true },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '超时' : '正常') },
    ],
    质量待核查: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'area', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'staff', title: '作业人员', minWidth: 150, sortable: true },
      { field: 'completeTime', title: '作业完成时间', minWidth: 160, sortable: true },
      { field: 'checkPhotoUrl', title: '上报照片', minWidth: 100, sortable: true, slots: { default: 'checkPhotoUrl' } },
      { field: 'tool', title: '清扫工具', minWidth: 150, sortable: true },
      { field: 'reviewStatus', title: '核查状态', minWidth: 100, sortable: true },
      { field: 'reviewBy', title: '核查人员', minWidth: 120, sortable: true },
      { field: 'reviewTime', title: '核查时间', minWidth: 160, sortable: true },
      { field: 'reformRequire', title: '整改要求', minWidth: 200, sortable: true },
    ],
    已完成: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'area', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'completeTime', title: '完成时间', minWidth: 160, sortable: true },
      { field: 'staff', title: '作业人员', minWidth: 150, sortable: true },
      { field: 'reviewResult', title: '质量核查结果', minWidth: 120, sortable: true },
      { field: 'problemHandleDesc', title: '问题处置情况', minWidth: 200, sortable: true },
      { field: 'completionRate', title: '清扫完成率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'qualityRate', title: '质量达标率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'problemHandleRate', title: '问题处置及时率(%)', minWidth: 140, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
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
  editText: '编辑清扫计划',
  addText: '新增清扫计划',
  excelName: '道路清扫任务列表',
  excelAllName: '道路清扫任务_区域_日期.xlsx',
  total: '道路清扫任务总数10;清扫待执行2;作业进行中2;问题待处置2;质量待核查2;已完成2',
};
