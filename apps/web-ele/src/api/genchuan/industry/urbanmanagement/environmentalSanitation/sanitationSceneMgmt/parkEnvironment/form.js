// 新增/编辑表单 schema（公园基础信息）
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '公园名称',
      component: 'Input',
      componentProps: { placeholder: '请输入公园名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '公园地址',
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
      fieldName: 'cleaningFrequency',
      label: '保洁频次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择保洁频次',
        options: [
          { label: '每日一次', value: '每日一次' },
          { label: '每日两次', value: '每日两次' },
          { label: '每日三次', value: '每日三次' },
          { label: '每日四次', value: '每日四次' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'greenMaintenanceCycle',
      label: '绿化养护周期(天)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入天数', min: 1 },
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
          { label: '部分停运', value: '部分停运' },
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
      {
        field: 'toiletName',
        title: '公园名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      { field: 'location', title: '公园地址', minWidth: 200, sortable: true },
      {
        field: 'area',
        title: '所属区域',
        minWidth: 180,
        sortable: true,
        slots: { default: 'area' },
      },
      {
        field: 'cleaningFrequency',
        title: '保洁频次',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'greenMaintenanceCycle',
        title: '绿化养护周期(天)',
        minWidth: 150,
        sortable: true,
      },
      { field: 'manager', title: '负责人', minWidth: 120, sortable: true },
      {
        field: 'status',
        title: '运营状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'status' },
      },
      {
        field: 'cleaningRate',
        title: '保洁达标率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'greenSurvivalRate',
        title: '绿化存活率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'facilityRate',
        title: '设施完好率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'environmentRate',
        title: '环境达标率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'wasteTransferCompleteRate',
        title: '清运完成率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
    ],
    保洁待执行: [
      {
        field: 'toiletName',
        title: '公园名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      {
        field: 'cleaningArea',
        title: '保洁区域',
        minWidth: 180,
        sortable: true,
      },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      {
        field: 'cleaningFrequency',
        title: '保洁频次',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'cleaningTime',
        title: '保洁时段',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'cleaningStandard',
        title: '保洁标准',
        minWidth: 120,
        sortable: true,
      },
      { field: 'staff', title: '负责人员', minWidth: 150, sortable: true },
      {
        field: 'planStatus',
        title: '计划状态',
        minWidth: 100,
        sortable: true,
        slots: { default: 'planStatus' },
      },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      {
        field: 'cleaningPlanCompleteRate',
        title: '计划完成率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'attendanceRate',
        title: '考勤全勤率(%)',
        minWidth: 130,
        sortable: true,
      },
    ],
    绿化待养护: [
      {
        field: 'repairId',
        title: '养护编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'repairId' },
      },
      {
        field: 'toiletName',
        title: '公园名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      {
        field: 'facilityType',
        title: '绿化品类',
        minWidth: 120,
        sortable: true,
        slots: { default: 'facilityType' },
      },
      { field: 'greenArea', title: '养护区域', minWidth: 180, sortable: true },
      {
        field: 'greenMaintenanceCycle',
        title: '养护周期(天)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'maintenanceContent',
        title: '养护内容',
        minWidth: 200,
        sortable: true,
      },
      { field: 'greenStaff', title: '负责人员', minWidth: 150, sortable: true },
      { field: 'planStatus', title: '计划状态', minWidth: 100, sortable: true },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      {
        field: 'greenExecuteTime',
        title: '养护执行时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'greenSurvivalRate',
        title: '绿化存活率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'pestHandleRecord',
        title: '病虫害处置记录',
        minWidth: 200,
        sortable: true,
      },
      {
        field: 'greenMaintenanceCompleteRate',
        title: '养护完成率(%)',
        minWidth: 130,
        sortable: true,
      },
    ],
    设施待维护: [
      {
        field: 'repairId',
        title: '维护编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'repairId' },
      },
      {
        field: 'toiletName',
        title: '公园名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      {
        field: 'facilityType',
        title: '设施类型',
        minWidth: 120,
        sortable: true,
        slots: { default: 'facilityType' },
      },
      {
        field: 'facilityLocation',
        title: '设施位置',
        minWidth: 180,
        sortable: true,
      },
      { field: 'damageDesc', title: '损坏描述', minWidth: 200, sortable: true },
      { field: 'reportBy', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'reportTime', title: '上报时间', minWidth: 180, sortable: true },
      {
        field: 'photoUrl',
        title: '上报照片',
        minWidth: 100,
        sortable: true,
        slots: { default: 'photoUrl' },
      },
      { field: 'repairBy', title: '维护责任人', minWidth: 120, sortable: true },
      {
        field: 'dispatchTime',
        title: '派单时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'repairStatus',
        title: '维护状态',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'expectedCompleteTime',
        title: '预计完成时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'facilityRate',
        title: '设施完好率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'maintainResult',
        title: '维护结果',
        minWidth: 120,
        sortable: true,
      },
    ],
    清运待执行: [
      {
        field: 'toiletName',
        title: '公园名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      {
        field: 'wasteCollectionPoints',
        title: '垃圾收集点位',
        minWidth: 140,
        sortable: true,
      },
      {
        field: 'wasteTransferFrequency',
        title: '清运频次',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'wasteTransferTime',
        title: '清运时段',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'vehicle',
        title: '负责车辆',
        minWidth: 130,
        sortable: true,
        slots: { default: 'vehicle' },
      },
      { field: 'staff', title: '负责人员', minWidth: 150, sortable: true },
      {
        field: 'planStatus',
        title: '计划状态',
        minWidth: 100,
        sortable: true,
        slots: { default: 'planStatus' },
      },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      {
        field: 'wasteTransferCompleteRate',
        title: '清运完成率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'wasteVolume',
        title: '垃圾清运量(吨)',
        minWidth: 130,
        sortable: true,
      },
    ],
    已完成: [
      {
        field: 'taskType',
        title: '任务类型',
        minWidth: 120,
        sortable: true,
        slots: { default: 'taskType' },
      },
      {
        field: 'toiletName',
        title: '公园名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      {
        field: 'area',
        title: '所属区域',
        minWidth: 180,
        sortable: true,
        slots: { default: 'area' },
      },
      {
        field: 'completeTime',
        title: '完成时间',
        minWidth: 180,
        sortable: true,
      },
      { field: 'handler', title: '处置人员', minWidth: 120, sortable: true },
      {
        field: 'handleResult',
        title: '处置结果',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'proofUrl',
        title: '佐证材料',
        minWidth: 100,
        sortable: true,
        slots: { default: 'proofUrl' },
      },
      {
        field: 'cleaningRate',
        title: '保洁达标率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'greenSurvivalRate',
        title: '绿化存活率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'facilityRate',
        title: '设施完好率(%)',
        minWidth: 130,
        sortable: true,
      },
      {
        field: 'environmentRate',
        title: '环境达标率(%)',
        minWidth: 130,
        sortable: true,
      },
      { field: 'statPeriod', title: '统计周期', minWidth: 120, sortable: true },
      {
        field: 'totalWasteVolume',
        title: '垃圾清运总量(吨)',
        minWidth: 150,
        sortable: true,
      },
    ],
  };

  const columns = [
    ...baseColumns,
    ...(statusColumnsMap[status] || statusColumnsMap.全部),
  ];
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
  editText: '编辑公园信息',
  addText: '新增公园',
  excelName: '公园环境管理任务列表',
  excelAllName: '公园环境管理任务_区域_日期.xlsx',
  total: '公园总数3;保洁待执行3;绿化待养护3;设施待维护3;清运待执行3;已完成3',
};
