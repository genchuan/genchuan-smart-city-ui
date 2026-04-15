// 新增/编辑表单 schema（此处改为转运站基础信息）
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '转运站名称',
      component: 'Input',
      componentProps: { placeholder: '请输入转运站名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '转运站位置',
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
      fieldName: 'openHours',
      label: '开放时段',
      component: 'Input',
      componentProps: { placeholder: '如 06:00-22:00' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'stallCount',
      label: '压缩机数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入数量', min: 0 },
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
      fieldName: 'coreEquipment',
      label: '核心设备',
      component: 'Input',
      componentProps: { placeholder: '多个设备用逗号分隔' },
      labelWidth: '120',
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
        title: '转运站名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      { field: 'location', title: '转运站位置', minWidth: 180, sortable: true },
      {
        field: 'area',
        title: '所属区域',
        minWidth: 180,
        sortable: true,
        slots: { default: 'area' },
      },
      {
        field: 'coreEquipment',
        title: '核心设备',
        minWidth: 200,
        sortable: true,
      },
      {
        field: 'status',
        title: '运营状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'status' },
      },
      { field: 'manager', title: '负责人', minWidth: 120, sortable: true },
      {
        field: 'dailyTransferVolume',
        title: '日转运量(吨)',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}吨` : '-',
      },
      {
        field: 'equipmentRate',
        title: '设备正常运行率(%)',
        minWidth: 140,
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
        field: 'unhandledAlarmCount',
        title: '预警未处理数',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'pendingMaintenanceCount',
        title: '设备待维护数',
        minWidth: 120,
        sortable: true,
      },
    ],
    车辆待进站: [
      {
        field: 'reserveId',
        title: '预约编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'reserveId' },
      },
      {
        field: 'licensePlate',
        title: '车辆牌照',
        minWidth: 130,
        sortable: true,
        slots: { default: 'licensePlate' },
      },
      {
        field: 'garbageType',
        title: '垃圾品类',
        minWidth: 120,
        sortable: true,
        slots: { default: 'garbageType' },
      },
      {
        field: 'expectedTime',
        title: '预计进站时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'garbageWeight',
        title: '垃圾重量(吨)',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'area',
        title: '所属区域',
        minWidth: 180,
        sortable: true,
        slots: { default: 'area' },
      },
      {
        field: 'reserveStatus',
        title: '预约状态',
        minWidth: 100,
        sortable: true,
      },
      { field: 'sortNo', title: '排序序号', minWidth: 100, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'handler', title: '处理人员', minWidth: 120, sortable: true },
    ],
    作业进行中: [
      {
        field: 'operationId',
        title: '进站编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'operationId' },
      },
      {
        field: 'licensePlate',
        title: '车辆牌照',
        minWidth: 130,
        sortable: true,
        slots: { default: 'licensePlate' },
      },
      {
        field: 'garbageType',
        title: '垃圾品类',
        minWidth: 120,
        sortable: true,
      },
      { field: 'entryTime', title: '进站时间', minWidth: 180, sortable: true },
      {
        field: 'garbageWeight',
        title: '垃圾重量(吨)',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'relatedPoints',
        title: '关联点位',
        minWidth: 200,
        sortable: true,
      },
      {
        field: 'equipmentStatus',
        title: '核心设备状态',
        minWidth: 150,
        sortable: true,
      },
      {
        field: 'environmentData',
        title: '实时环境数据',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'progress',
        title: '作业进度(%)',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'destination',
        title: '转运去向',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'isAbnormal',
        title: '异常标记',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
      },
    ],
    预警待处理: [
      {
        field: 'alarmId',
        title: '预警编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'alarmId' },
      },
      {
        field: 'transferName',
        title: '关联转运站',
        minWidth: 150,
        sortable: true,
        slots: { default: 'transferName' },
      },
      {
        field: 'alarmType',
        title: '预警类型',
        minWidth: 120,
        sortable: true,
        slots: { default: 'alarmType' },
      },
      { field: 'alarmTime', title: '发生时间', minWidth: 180, sortable: true },
      {
        field: 'alarmContent',
        title: '预警内容',
        minWidth: 200,
        sortable: true,
      },
      {
        field: 'relevantInfo',
        title: '关联设备/区域',
        minWidth: 150,
        sortable: true,
      },
      {
        field: 'handleStatus',
        title: '处置状态',
        minWidth: 100,
        sortable: true,
      },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      {
        field: 'isTimeout',
        title: '超时提醒',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
      },
      {
        field: 'handleProgress',
        title: '处置进度(%)',
        minWidth: 100,
        sortable: true,
      },
    ],
    设备待维护: [
      {
        field: 'maintenanceId',
        title: '维护编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'maintenanceId' },
      },
      {
        field: 'transferName',
        title: '关联转运站',
        minWidth: 150,
        sortable: true,
        slots: { default: 'transferName' },
      },
      {
        field: 'equipmentName',
        title: '设备名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'equipmentName' },
      },
      {
        field: 'maintenanceCycle',
        title: '维护周期',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'lastMaintenanceTime',
        title: '上次维护时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'maintenanceContent',
        title: '维护内容',
        minWidth: 200,
        sortable: true,
      },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      {
        field: 'maintenanceStatus',
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
        field: 'isTimeout',
        title: '超时提醒',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
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
        field: 'transferName',
        title: '关联转运站',
        minWidth: 150,
        sortable: true,
        slots: { default: 'transferName' },
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
        field: 'handleDuration',
        title: '任务耗时',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'totalEntryVolume',
        title: '进站总量(吨)',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'equipmentIntactRate',
        title: '设备完好率(%)',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'environmentQualifiedRate',
        title: '环境达标率(%)',
        minWidth: 130,
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
  editText: '编辑转运站信息',
  addText: '新增转运站',
  excelName: '转运站运营任务列表',
  excelAllName: '转运站运营任务_区域_日期.xlsx',
  total: '转运站总数3;车辆待进站3;作业进行中3;预警待处理3;设备待维护3;已完成3',
};
