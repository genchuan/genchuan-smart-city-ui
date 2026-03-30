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

export function getEquipmentOptions() {
  return requestClient.get('/envirhealth/equipment/options')
}

// 车辆相关选项（用于预约等）
export function getVehicleOptions() {
  return requestClient.get('/envirhealth/vehicle/options');
}

// 垃圾品类选项
export function getGarbageTypeOptions() {
  return requestClient.get('/envirhealth/garbage-type/options');
}

// 预警类型选项
export function getAlarmTypeOptions() {
  return requestClient.get('/envirhealth/alarm-type/options');
}

// 处置状态选项
export function getHandleStatusOptions() {
  return requestClient.get('/envirhealth/handle-status/options');
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

// ---------- 新增弹窗表单 Schema（按需求补充） ----------
// 批量预约弹窗
export function useBatchReserveNumberSchema() {
  return [
    {
      fieldName: 'sortType',
      label: '排序方式',
      component: 'Select',
      componentProps: {
        options: [
          { label: '按预计进站时间', value: 'EXPECTED_TIME' },
          { label: '按垃圾品类+时间', value: 'GARBAGE_TYPE_TIME' },
        ],
        placeholder: '请选择排序方式',
      },
      labelWidth: '100',
    },
  ];
}

// 批量归档弹窗
export function useBatchArchiveSchema() {
  return [
    {
      fieldName: 'archiveRemark',
      label: '归档备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入归档备注',
      },
    },
  ];
}

// 确认进站弹窗
export function useConfirmEntrySchema() {
  return [
    {
      fieldName: 'entryTime',
      label: '进站时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择进站时间',
      },
      labelWidth: '100',
    },
  ];
}

// 暂停作业弹窗
export function usePauseOperationSchema() {
  return [
    {
      fieldName: 'pauseReason',
      label: '暂停原因',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入暂停原因',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'resumeTime',
      label: '预计恢复时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择预计恢复时间',
      },
      labelWidth: '100',
    },
  ];
}

// 上报预警弹窗
export function useReportAlarmSchema() {
  return [
    {
      fieldName: 'alarmTypeId',
      label: '预警类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择预警类型',
        options: [],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'alarmContent',
      label: '预警内容',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入预警内容',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'relevantInfo',
      label: '关联设备/区域',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联设备或区域信息',
      },
      labelWidth: '100',
    },
  ];
}

// 指派人员弹窗
export function useAssignPersonSchema() {
  return [
    {
      fieldName: 'handleBy',
      label: '指派人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择人员',
        options: [],
      },
    },
  ];
}

// 指派维护弹窗
export function useAssignMaintenanceSchema() {
  return [
    {
      fieldName: 'repairBy',
      label: '维修人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择维修人员',
        options: [],
      },
      labelWidth: '100',
    },
    // {
    //   fieldName: 'expectedCompleteTime',
    //   label: '预计完成时间',
    //   component: 'DatePicker',
    //   componentProps: {
    //     type: 'datetime',
    //     valueFormat: 'x',
    //     placeholder: '选择预计完成时间',
    //   },
    //   labelWidth: '100',
    // },
  ];
}

// 维护处理弹窗
export function useMaintenanceProcessSchema() {
  return [
    {
      fieldName: 'equipmentId',
      label: '设备',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备',
        options: [], // 动态从 loadedOptions.equipment 获取
      },
      labelWidth: '100',
    },
    {
      fieldName: 'maintenanceContent',
      label: '维护内容',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入维护内容',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'maintenanceStatus',
      label: '维护状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择维护状态',
        options: [
          { label: '待维护', value: '待维护' },
          { label: '维护中', value: '维护中' },
          { label: '已完成', value: '已完成' },
        ],
      },
      labelWidth: '100',
    },
    // {
    //   fieldName: 'replaceParts',
    //   label: '更换配件',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入更换配件',
    //   },
    //   labelWidth: '100',
    // },
    // {
    //   fieldName: 'maintenanceCost',
    //   label: '维护费用（元）',
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入费用',
    //     min: 0,
    //     precision: 2,
    //   },
    //   labelWidth: '100',
    // },
    // {
    //   fieldName: 'maintenancePhoto',
    //   label: '维护照片',
    //   component: 'Upload',
    //   componentProps: {
    //     // 根据项目中的上传组件配置
    //     action: '/api/upload',
    //     listType: 'picture-card',
    //     multiple: true,
    //     // 处理返回值，存储为 JSON 数组
    //   },
    //   labelWidth: '100',
    // },
    {
      fieldName: 'abnormalIsTimeout',
      label: '超时提醒',
      component: 'Select',
      componentProps: {
        placeholder: '是否超时',
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' },
        ],
      },
      labelWidth: '100',
    },
    // maintenanceCycle 和 lastMaintenanceTime 通常由系统维护，可不展示
  ];
}

// 验收维护弹窗
export function useAcceptMaintenanceSchema() {
  return [
    {
      fieldName: 'result',
      label: '验收结果',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '合格', value: '合格' },
          { label: '不合格', value: '不合格' },
        ],
      },
      rules: 'required',
    },
  ];
}

// 转运归档弹窗
export function useTransferArchiveSchema() {
  return [
    {
      fieldName: 'archiveRemark',
      label: '归档备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入归档备注',
      },
      rules: 'required',
    },
  ];
}

// 重新预约弹窗
export function useReReserveSchema() {
  return [
    {
      fieldName: 'vehicleId',
      label: '选择车辆',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车辆',
        options: [],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'garbageTypeId',
      label: '垃圾品类',
      component: 'Select',
      componentProps: {
        placeholder: '请选择垃圾品类',
        options: [],
      },
      labelWidth: '100',
    },
    {
      fieldName: 'expectedTime',
      label: '预计进站时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择预计进站时间',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2,
        placeholder: '请输入备注',
      },
      labelWidth: '100',
    },
  ];
}

// 复用建档信息弹窗
export function useReuseProfileSchema() {
  return [
    {
      fieldName: 'confirmAction',
      label: '操作确认',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '覆盖现有信息', value: 'override' },
          { label: '新建档案', value: 'new' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2,
        placeholder: '请输入备注',
      },
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
      { field: 'areaName', title: '所属区域', minWidth: 150, sortable: true, slots: { default: 'area' } },
      {
        field: 'equipmentsName',
        title: '核心设备',
        minWidth: 200,
        sortable: true,
        formatter: ({ cellValue }) => (Array.isArray(cellValue) ? cellValue.join('、') : cellValue || '-'),
      },
      { field: 'operationStatusName', title: '运营状态', minWidth: 120, sortable: true, slots: { default: 'status' } },
      { field: 'managerName', title: '负责人', minWidth: 120, sortable: true },
      {
        field: 'dailyTransferVolume',
        title: '日转运量(吨)',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}吨` : '-'),
      },
      {
        field: 'progressStatus',
        title: '流程状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'progressStatus' }
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
