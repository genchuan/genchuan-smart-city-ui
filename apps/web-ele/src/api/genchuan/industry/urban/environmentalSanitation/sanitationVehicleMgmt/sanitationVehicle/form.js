import { requestClient } from '#/api/request';

// ========== 新增 options 接口 ==========
export function getVehicleTypeOptions() {
  return requestClient.get('/envirhealth/vehicle-type/options');
}

export function getDeptOptions() {
  return requestClient.get('/envirhealth/dept/options');
}

export function getRouteOptions() {
  return requestClient.get('/envirhealth/route/options');
}

export function getUserOptions() {
  return requestClient.get('/envirhealth/user/options');
}

export function getVehicleStatusOptions() {
  return requestClient.get('/envirhealth/vehicle-status/options');
}

export function getPlanStatusOptions() {
  return requestClient.get('/envirhealth/plan-status/options');
}

export function getWorkStatusOptions() {
  return requestClient.get('/envirhealth/work-status/options');
}

export function getViolationTypeOptions() {
  return requestClient.get('/envirhealth/violation-type/options');
}

export function getViolationStatusOptions() {
  return requestClient.get('/envirhealth/violation-status/options');
}

export function getMaintenanceTypeOptions() {
  return requestClient.get('/envirhealth/maintenance-type/options');
}

export function getTaskTypeOptions() {
  // return requestClient.get('/envirhealth/task-type/options');
  return Promise.resolve([
    { label: '保洁任务', value: 'uuid-task-001' },
    { label: '收运任务', value: 'uuid-task-002' },
    { label: '设施维修任务', value: 'uuid-task-003' },
  ]);
}

// ========== 原有新增/编辑表单 schema（用于非“全部”标签页，字段名基于模拟数据） ==========
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '车辆牌照',
      component: 'Input',
      componentProps: { placeholder: '请输入车辆牌照' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车辆类型',
        options: [
          { label: '压缩车', value: '压缩车' },
          { label: '洒水车', value: '洒水车' },
          { label: '洗扫车', value: '洗扫车' },
          { label: '垃圾运输车', value: '垃圾运输车' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'area',
      label: '所属部门',
      component: 'Input',
      componentProps: { placeholder: '请输入所属部门' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'openHours',
      label: '车辆型号',
      component: 'Input',
      componentProps: { placeholder: '请输入车辆型号' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'stallCount',
      label: '作业路线',
      component: 'Input',
      componentProps: { placeholder: '请输入作业路线' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'manager',
      label: '驾驶员',
      component: 'Input',
      componentProps: { placeholder: '请输入驾驶员姓名' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '车辆状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车辆状态',
        options: [
          { label: '正常运营', value: '正常运营' },
          { label: '维护中', value: '维护中' },
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

// ========== 新增：用于“全部”标签页的编辑表单 schema（字段名与接口一致） ==========
export function useVehicleEditSchema() {
  return [
    {
      fieldName: 'licensePlate',
      label: '车辆牌照',
      component: 'Input',
      componentProps: { placeholder: '请输入车辆牌照' },
    },
    {
      fieldName: 'vehicleTypeId',
      label: '车辆类型',
      component: 'Select',
      componentProps: { placeholder: '请选择车辆类型', options: [] },
    },
    {
      fieldName: 'deptId',
      label: '所属部门',
      component: 'Select',
      componentProps: { placeholder: '请选择部门', options: [] },
    },
    {
      fieldName: 'model',
      label: '车辆型号',
      component: 'Input',
      componentProps: { placeholder: '请输入车辆型号' },
    },
    {
      fieldName: 'routeId',
      label: '作业路线',
      component: 'Select',
      componentProps: { placeholder: '请选择作业路线', options: [] },
    },
    {
      fieldName: 'driverId',
      label: '驾驶员',
      component: 'Select',
      componentProps: { placeholder: '请选择驾驶员', options: [] },
    },
    {
      fieldName: 'vehicleStatusId',
      label: '车辆状态',
      component: 'Select',
      componentProps: { placeholder: '请选择状态', options: [] },
    },
    {
      fieldName: 'lastMaintenanceTime',
      label: '最近维护时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'x', placeholder: '选择时间' },
      labelWidth: '100',
    },
  ];
}

// ========== 新增：搜索表单 schema（用于“全部”标签页） ==========
export function useVehicleSearchSchema() {
  return [
    {
      fieldName: 'vehicleTypeId',
      label: '车辆类型',
      component: 'Select',
      componentProps: { placeholder: '请选择车辆类型', options: [], clearable: true },
    },
    {
      fieldName: 'deptId',
      label: '所属部门',
      component: 'Select',
      componentProps: { placeholder: '请选择部门', options: [], clearable: true },
    },
    {
      fieldName: 'vehicleStatusId',
      label: '车辆状态',
      component: 'Select',
      componentProps: { placeholder: '请选择状态', options: [], clearable: true },
    },
    {
      fieldName: 'driverId',
      label: '驾驶员',
      component: 'Select',
      componentProps: { placeholder: '请选择驾驶员', options: [], clearable: true },
    },
  ];
}

// ========== 表格列配置（按状态筛选）==========
// ！！！仅修改“全部”标签页的列字段名为接口字段，其他状态列完全保留原样 ！！！
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    // 【修改】全部标签页：使用接口返回的字段名
    全部: [
      { field: 'licensePlate', title: '车辆牌照', minWidth: 150, sortable: true, slots: { default: 'licensePlate' } },
      { field: 'vehicleTypeName', title: '车辆类型', minWidth: 120, slots: { default: 'vehicleType' } },
      { field: 'deptName', title: '所属部门', minWidth: 180, slots: { default: 'dept' } },
      { field: 'model', title: '车辆型号', minWidth: 150 },
      { field: 'routeName', title: '作业路线', minWidth: 150 },
      { field: 'driverName', title: '驾驶员', minWidth: 120 },
      { field: 'vehicleStatusName', title: '车辆状态', minWidth: 120, slots: { default: 'vehicleStatus' } },
      {
        field: 'lastMaintenanceTime',
        title: '最近维护时间',
        minWidth: 180,
        formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-'),
      },
      {
        field: 'totalWorkHours',
        title: '累计作业时长(小时)',
        minWidth: 160,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
      {
        field: 'alarmCount',
        title: '违规告警次数',
        minWidth: 120,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
      {
        field: 'intactRate',
        title: '车辆完好率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'unfinishedTaskCount',
        title: '未完成任务数',
        minWidth: 120,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
      {
        field: 'averageEfficiency',
        title: '平均作业效率(吨/小时)',
        minWidth: 170,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
    ],
    // 以下五个标签页的列配置完全保留原样（基于模拟数据字段）
    车辆待作业: [
      { field: 'toiletName', title: '车辆牌照', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'location', title: '车辆类型', minWidth: 120, slots: { default: 'location' } },
      { field: 'area', title: '所属部门', minWidth: 180 },
      { field: 'stallCount', title: '作业路线', minWidth: 150, slots: { default: 'stallCount' } },
      { field: 'threshold', title: '路线长度(公里)', minWidth: 140 },
      { field: 'cleaningFrequency', title: '作业频次', minWidth: 120 },
      { field: 'cleaningTime', title: '作业时段', minWidth: 180 },
      { field: 'manager', title: '驾驶员', minWidth: 120 },
      { field: 'warningStatus', title: '计划状态', minWidth: 100, slots: { default: 'warningStatus' } },
      { field: 'cleaningRate', title: '计划完成率(%)', minWidth: 130 },
      { field: 'complaintRate', title: '预计作业量(吨)', minWidth: 140 },
      { field: 'createBy', title: '创建人', minWidth: 120 },
      { field: 'createTime', title: '创建时间', minWidth: 180 },
      { field: 'updateTime', title: '更新时间', minWidth: 180 },
      { field: 'isEffective', title: '是否生效', minWidth: 100, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    作业进行中: [
      { field: 'toiletName', title: '车辆牌照', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'location', title: '车辆类型', minWidth: 120 },
      { field: 'stallCount', title: '作业路线', minWidth: 150, slots: { default: 'stallCount' } },
      { field: 'manager', title: '驾驶员', minWidth: 120 },
      { field: 'dispatchStatus', title: '作业状态', minWidth: 100, slots: { default: 'dispatchStatus' } },
      { field: 'facilityLocation', title: '当前位置', minWidth: 200 },
      { field: 'currentStock', title: '行驶速度(km/h)', minWidth: 140 },
      { field: 'cleaningRate', title: '已作业量(吨)', minWidth: 130 },
      { field: 'gap', title: '作业进度', minWidth: 100 },
      { field: 'reportTime', title: '启动作业时间', minWidth: 180 },
      { field: 'expectedCompleteTime', title: '预计完成时间', minWidth: 180 },
      { field: 'warningStatus', title: '轨迹合规性', minWidth: 120 },
      { field: 'complaintRate', title: '实时告警数', minWidth: 110 },
    ],
    违规待处理: [
      { field: 'complaintId', title: '违规编号', minWidth: 150, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '车辆牌照', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'location', title: '车辆类型', minWidth: 120 },
      { field: 'complaintType', title: '违规类型', minWidth: 120, slots: { default: 'complaintType' } },
      { field: 'complaintTime', title: '违规时间', minWidth: 180 },
      { field: 'facilityLocation', title: '违规地点', minWidth: 200 },
      { field: 'complaintContent', title: '违规详情', minWidth: 200 },
      { field: 'manager', title: '驾驶员', minWidth: 120 },
      { field: 'photoUrl', title: '佐证材料', minWidth: 100, slots: { default: 'photoUrl' } },
      { field: 'handleStatus', title: '违规状态', minWidth: 100, slots: { default: 'handleStatus' } },
      { field: 'area', title: '责任部门', minWidth: 120 },
      { field: 'handler', title: '整改责任人', minWidth: 120 },
      { field: 'dispatchTime', title: '派单时间', minWidth: 180 },
      { field: 'expectedCompleteTime', title: '整改期限', minWidth: 180 },
      { field: 'cleaningRate', title: '整改完成率(%)', minWidth: 130 },
    ],
    车辆待维护: [
      { field: 'repairId', title: '维护编号', minWidth: 150, slots: { default: 'repairId' } },
      { field: 'toiletName', title: '车辆牌照', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'location', title: '车辆类型', minWidth: 120 },
      { field: 'facilityType', title: '维护类型', minWidth: 120, slots: { default: 'facilityType' } },
      { field: 'threshold', title: '维护周期(天)', minWidth: 120 },
      { field: 'lastSupplyTime', title: '上次维护时间', minWidth: 180 },
      { field: 'status', title: '车辆状态', minWidth: 120, slots: { default: 'status' } },
      { field: 'repairBy', title: '维护责任人', minWidth: 120 },
      { field: 'damageDesc', title: '故障描述', minWidth: 200 },
      { field: 'cleaningTime', title: '维护提醒时间', minWidth: 180 },
      { field: 'currentStock', title: '预计维护时长(小时)', minWidth: 170 },
      { field: 'repairStatus', title: '维护状态', minWidth: 100 },
      { field: 'warningCount', title: '设备完好率(%)', minWidth: 130 },
      { field: 'cleaningRate', title: '维护完成率(%)', minWidth: 130 },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '车辆牌照', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'location', title: '车辆类型', minWidth: 120 },
      { field: 'area', title: '所属部门', minWidth: 180, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180 },
      { field: 'handler', title: '处置人员', minWidth: 120 },
      { field: 'handleResult', title: '处置结果', minWidth: 120 },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, slots: { default: 'proofUrl' } },
      { field: 'cleaningRate', title: '作业覆盖率(%)', minWidth: 130 },
      { field: 'warningCount', title: '车辆完好率(%)', minWidth: 130 },
      { field: 'complaintRate', title: '违规整改率(%)', minWidth: 130 },
      { field: 'statPeriod', title: '统计周期', minWidth: 120 },
      { field: 'satisfaction', title: '运营评分', minWidth: 100 },
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
  editText: '编辑车辆信息',
  addText: '新增车辆',
  excelName: '环卫车辆管理任务列表',
  excelAllName: '环卫车辆管理任务_部门_日期.xlsx',
  total: '车辆总数18;车辆待作业3;作业进行中3;违规待处理3;车辆待维护3;已完成3',
};
