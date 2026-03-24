import { requestClient } from '#/api/request';

// ---------- options 接口（新增） ----------
export function getAreaOptions() {
  return requestClient.get('/envirhealth/area/options');
}

export function getUserOptions() {
  return requestClient.get('/envirhealth/user/options');
}

export function getOperationStatusOptions() {
  return requestClient.get('/envirhealth/operation-status/options');
}

// 设备选项（如果后端有设备表则调用接口，否则用静态数据）
export function getEquipmentOptions() {
  // 若后端提供了设备选项接口，可替换为 requestClient.get('/envirhealth/equipment/options')
  return Promise.resolve([
    { label: '垃圾压缩机', value: 'uuid-equip-001' },
    { label: '输送机', value: 'uuid-equip-002' },
    { label: '除臭设备', value: 'uuid-equip-003' },
    { label: '地磅', value: 'uuid-equip-004' },
    { label: '监控设备', value: 'uuid-equip-005' },
    { label: '喷淋设备', value: 'uuid-equip-006' },
    { label: '叉车', value: 'uuid-equip-007' },
    { label: '装载机', value: 'uuid-equip-008' },
  ]);
}

// ---------- 新增/编辑表单 schema（更新，采用后端字段名） ----------
export function useGarbageTransferFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '转运站名称',
      component: 'Input',
      componentProps: { placeholder: '请输入转运站名称' },
    },
    {
      fieldName: 'location',
      label: '转运站位置',
      component: 'Input',
      componentProps: { placeholder: '请输入详细地址' },
    },
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: { placeholder: '请选择区域', options: [] },
    },
    {
      fieldName: 'equipmentIds',
      label: '核心设备',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备',
        multiple: true,
        valueFormat: 'array',
        options: [],
      },
    },
    {
      fieldName: 'operationStatusId',
      label: '运营状态',
      component: 'Select',
      componentProps: { placeholder: '请选择状态', options: [] },
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      componentProps: { placeholder: '请选择负责人', options: [] },
    },
    {
      fieldName: 'dailyTransferVolume',
      label: '日转运量(吨)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 0 },
    },
  ];
}

// ---------- 搜索表单 schema（新增） ----------
export function useGarbageTransferSearchSchema() {
  return [
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: { placeholder: '请选择区域', options: [], clearable: true },
    },
    {
      fieldName: 'operationStatusId',
      label: '运营状态',
      component: 'Select',
      componentProps: { placeholder: '请选择状态', options: [], clearable: true },
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      componentProps: { placeholder: '请选择负责人', options: [], clearable: true },
    },
  ];
}

// ---------- 表格列配置（按状态筛选）----------
// ！！！原有其他状态列配置完全保留，仅更新“全部”标签页的列定义以适应接口字段 ！！！
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    // 【修改】全部标签页：改用后端返回的字段名
    全部: [
      { field: 'name', title: '转运站名称', minWidth: 160, sortable: true, slots: { default: 'name' } },
      { field: 'location', title: '转运站位置', minWidth: 180, sortable: true },
      { field: 'areaName', title: '所属区域', minWidth: 150, sortable: true },
      {
        field: 'equipmentsName',
        title: '核心设备',
        minWidth: 200,
        sortable: true,
        formatter: ({ cellValue }) => (Array.isArray(cellValue) ? cellValue.join('、') : cellValue || '-'),
      },
      { field: 'operationStatusName', title: '运营状态', minWidth: 120, sortable: true },
      { field: 'managerName', title: '负责人', minWidth: 120, sortable: true },
      {
        field: 'dailyTransferVolume',
        title: '日转运量(吨)',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}吨` : '-'),
      },
      {
        field: 'equipmentRate',
        title: '设备正常运行率',
        minWidth: 140,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'environmentRate',
        title: '环境达标率',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      { field: 'unhandledAlarmCount', title: '预警未处理数', minWidth: 120, sortable: true },
      { field: 'pendingMaintenanceCount', title: '设备待维护数', minWidth: 120, sortable: true },
    ],
    // 以下五个标签页的列配置完全保留原样（基于模拟数据字段）
    车辆待进站: [
      { field: 'reserveId', title: '预约编号', minWidth: 150, sortable: true, slots: { default: 'reserveId' } },
      { field: 'licensePlate', title: '车辆牌照', minWidth: 130, sortable: true, slots: { default: 'licensePlate' } },
      { field: 'garbageType', title: '垃圾品类', minWidth: 120, sortable: true, slots: { default: 'garbageType' } },
      { field: 'expectedTime', title: '预计进站时间', minWidth: 180, sortable: true },
      { field: 'garbageWeight', title: '垃圾重量(吨)', minWidth: 120, sortable: true },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'reserveStatus', title: '预约状态', minWidth: 100, sortable: true },
      { field: 'sortNo', title: '排序序号', minWidth: 100, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'handler', title: '处理人员', minWidth: 120, sortable: true },
    ],
    作业进行中: [
      { field: 'operationId', title: '进站编号', minWidth: 150, sortable: true, slots: { default: 'operationId' } },
      { field: 'licensePlate', title: '车辆牌照', minWidth: 130, sortable: true, slots: { default: 'licensePlate' } },
      { field: 'garbageType', title: '垃圾品类', minWidth: 120, sortable: true },
      { field: 'entryTime', title: '进站时间', minWidth: 180, sortable: true },
      { field: 'garbageWeight', title: '垃圾重量(吨)', minWidth: 120, sortable: true },
      { field: 'relatedPoints', title: '关联点位', minWidth: 200, sortable: true },
      { field: 'equipmentStatus', title: '核心设备状态', minWidth: 150, sortable: true },
      { field: 'environmentData', title: '实时环境数据', minWidth: 180, sortable: true },
      { field: 'progress', title: '作业进度(%)', minWidth: 100, sortable: true },
      { field: 'destination', title: '转运去向', minWidth: 120, sortable: true },
      { field: 'isAbnormal', title: '异常标记', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    预警待处理: [
      { field: 'alarmId', title: '预警编号', minWidth: 150, sortable: true, slots: { default: 'alarmId' } },
      { field: 'transferName', title: '关联转运站', minWidth: 150, sortable: true, slots: { default: 'transferName' } },
      { field: 'alarmType', title: '预警类型', minWidth: 120, sortable: true, slots: { default: 'alarmType' } },
      { field: 'alarmTime', title: '发生时间', minWidth: 180, sortable: true },
      { field: 'alarmContent', title: '预警内容', minWidth: 200, sortable: true },
      { field: 'relevantInfo', title: '关联设备/区域', minWidth: 150, sortable: true },
      { field: 'handleStatus', title: '处置状态', minWidth: 100, sortable: true },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
      { field: 'handleProgress', title: '处置进度(%)', minWidth: 100, sortable: true },
    ],
    设备待维护: [
      { field: 'maintenanceId', title: '维护编号', minWidth: 150, sortable: true, slots: { default: 'maintenanceId' } },
      { field: 'transferName', title: '关联转运站', minWidth: 150, sortable: true, slots: { default: 'transferName' } },
      { field: 'equipmentName', title: '设备名称', minWidth: 150, sortable: true, slots: { default: 'equipmentName' } },
      { field: 'maintenanceCycle', title: '维护周期', minWidth: 120, sortable: true },
      { field: 'lastMaintenanceTime', title: '上次维护时间', minWidth: 180, sortable: true },
      { field: 'maintenanceContent', title: '维护内容', minWidth: 200, sortable: true },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      { field: 'maintenanceStatus', title: '维护状态', minWidth: 100, sortable: true },
      { field: 'expectedCompleteTime', title: '预计完成时间', minWidth: 180, sortable: true },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, sortable: true, slots: { default: 'taskType' } },
      { field: 'transferName', title: '关联转运站', minWidth: 150, sortable: true, slots: { default: 'transferName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180, sortable: true },
      { field: 'handler', title: '处置人员', minWidth: 120, sortable: true },
      { field: 'handleResult', title: '处置结果', minWidth: 120, sortable: true },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, sortable: true, slots: { default: 'proofUrl' } },
      { field: 'handleDuration', title: '任务耗时', minWidth: 100, sortable: true },
      { field: 'totalEntryVolume', title: '进站总量(吨)', minWidth: 120, sortable: true },
      { field: 'equipmentIntactRate', title: '设备完好率(%)', minWidth: 120, sortable: true },
      { field: 'environmentQualifiedRate', title: '环境达标率(%)', minWidth: 130, sortable: true },
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
  editText: '编辑转运站信息',
  addText: '新增转运站',
  excelName: '转运站运营任务列表',
  excelAllName: '转运站运营任务_区域_日期.xlsx',
};
