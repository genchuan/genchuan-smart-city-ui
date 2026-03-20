import { requestClient } from '#/api/request';

// ========== 新增 options 接口 ==========
export function getAreaOptions() {
  return requestClient.get('/envirhealth/area/options');
}

export function getUserOptions() {
  return requestClient.get('/envirhealth/user/options');
}

export function getOperationStatusOptions() {
  return requestClient.get('/envirhealth/operation-status/options');
}

export function getCleaningTypeOptions() {
  return requestClient.get('/envirhealth/cleaning-type/options');
}

export function getMonitorTypeOptions() {
  return requestClient.get('/envirhealth/monitor-type/options');
}

export function getMonitorStatusOptions() {
  return requestClient.get('/envirhealth/monitor-status/options');
}

export function getProblemTypeOptions() {
  return requestClient.get('/envirhealth/problem-type/options');
}

export function getHandleStatusOptions() {
  return requestClient.get('/envirhealth/handle-status/options');
}

export function getDeptOptions() {
  return requestClient.get('/envirhealth/dept/options');
}

export function getToolOptions() {
  return requestClient.get('/envirhealth/tool/options');
}

// ========== 原有新增/编辑表单 schema（用于非“全部”标签页，字段名基于模拟数据） ==========
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '河道名称',
      component: 'Input',
      componentProps: { placeholder: '请输入河道名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'responsibilitySection',
      label: '责任河段',
      component: 'Input',
      componentProps: { placeholder: '如：中山桥-战备大桥段' },
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
      fieldName: 'stallCount',
      label: '河道长度(公里)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入长度', min: 0, step: 0.1 },
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

// ========== 新增：用于“全部”标签页的编辑表单 schema（字段名与接口一致） ==========
export function useRiverEditSchema() {
  return [
    {
      fieldName: 'name',
      label: '河道名称',
      component: 'Input',
      componentProps: { placeholder: '请输入河道名称' },
    },
    {
      fieldName: 'responsibilitySection',
      label: '责任河段',
      component: 'Input',
      componentProps: { placeholder: '请输入责任河段' },
    },
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: { placeholder: '请选择区域', options: [] },
    },
    {
      fieldName: 'length',
      label: '河道长度(公里)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 0, step: 0.1 },
      labelWidth: '100',
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      componentProps: { placeholder: '请选择负责人', options: [] },
    },
    {
      fieldName: 'operationStatusId',
      label: '运营状态',
      component: 'Select',
      componentProps: { placeholder: '请选择状态', options: [] },
    },
  ];
}

// ========== 新增：搜索表单 schema（用于“全部”标签页） ==========
export function useRiverSearchSchema() {
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

// ========== 表格列配置（按状态筛选）==========
// ！！！仅修改“全部”标签页的列字段名为接口字段，其他状态列完全保留原样 ！！！
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    // 【修改】全部标签页：使用接口返回的字段名
    全部: [
      { field: 'name', title: '河道名称', minWidth: 160, sortable: true, slots: { default: 'name' } },
      { field: 'responsibilitySection', title: '责任河段', minWidth: 200 },
      { field: 'areaName', title: '所属区域', minWidth: 180 },
      { field: 'length', title: '河道长度(公里)', minWidth: 130 },
      { field: 'managerName', title: '负责人', minWidth: 120 },
      { field: 'operationStatusName', title: '运营状态', minWidth: 120 },
      {
        field: 'cleaningCoverage',
        title: '保洁覆盖率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'waterQualityRate',
        title: '水质达标率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'wasteFishingVolume',
        title: '垃圾打捞总量(吨)',
        minWidth: 150,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
      {
        field: 'problemCompleteRate',
        title: '问题办结率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
    ],
    // 以下四个标签页的列配置完全保留原样（基于模拟数据字段）
    保洁待执行: [
      { field: 'toiletName', title: '河道名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'responsibilitySection', title: '责任河段', minWidth: 180 },
      { field: 'area', title: '所属区域', minWidth: 180 },
      { field: 'cleaningType', title: '保洁类型', minWidth: 120 },
      { field: 'cleaningFrequency', title: '保洁频次', minWidth: 120 },
      { field: 'cleaningTime', title: '保洁时段', minWidth: 180 },
      { field: 'cleaner', title: '负责人员', minWidth: 150 },
      { field: 'cleaningTool', title: '保洁工具', minWidth: 120 },
      { field: 'createBy', title: '创建人', minWidth: 120 },
      { field: 'createTime', title: '创建时间', minWidth: 180 },
      { field: 'updateTime', title: '更新时间', minWidth: 180 },
      { field: 'cleaningPlanCompleteRate', title: '计划完成率(%)', minWidth: 130 },
      { field: 'wasteFishingEstimate', title: '垃圾打捞预估量(吨)', minWidth: 170 },
    ],
    监测待执行: [
      { field: 'toiletName', title: '河道名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'responsibilitySection', title: '责任河段', minWidth: 180 },
      { field: 'area', title: '所属区域', minWidth: 180 },
      { field: 'consumableName', title: '监测类型', minWidth: 120, slots: { default: 'consumableName' } },
      { field: 'threshold', title: '监测周期(天)', minWidth: 120 },
      { field: 'cleaningContent', title: '监测指标', minWidth: 200 },
      { field: 'cleaner', title: '监测人员', minWidth: 150 },
      { field: 'cleaningTime', title: '计划监测时间', minWidth: 180 },
      { field: 'warningStatus', title: '监测状态', minWidth: 100 },
      { field: 'lastSupplyTime', title: '上次监测时间', minWidth: 180 },
      { field: 'supplyCycle', title: '下次监测提醒', minWidth: 180 },
      { field: 'monitorDataQualifiedRate', title: '监测数据达标率(%)', minWidth: 160 },
      { field: 'warningCount', title: '预警次数', minWidth: 100 },
    ],
    问题待处置: [
      { field: 'complaintId', title: '问题编号', minWidth: 150, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '河道名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'responsibilitySection', title: '责任河段', minWidth: 180 },
      { field: 'complaintType', title: '问题类型', minWidth: 120, slots: { default: 'complaintType' } },
      { field: 'facilityLocation', title: '问题位置', minWidth: 180 },
      { field: 'complaintContent', title: '问题描述', minWidth: 200 },
      { field: 'complaintName', title: '上报人员', minWidth: 120 },
      { field: 'complaintTime', title: '上报时间', minWidth: 180 },
      { field: 'photoUrl', title: '现场照片', minWidth: 100, slots: { default: 'photoUrl' } },
      { field: 'dept', title: '责任部门', minWidth: 120 },
      { field: 'handler', title: '处置责任人', minWidth: 120 },
      { field: 'dispatchTime', title: '派单时间', minWidth: 180 },
      { field: 'dispatchStatus', title: '处置状态', minWidth: 100 },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '河道名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'responsibilitySection', title: '责任河段', minWidth: 180 },
      { field: 'area', title: '所属区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180 },
      { field: 'handler', title: '处置人员', minWidth: 120 },
      { field: 'handleResult', title: '处置结果', minWidth: 120 },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, slots: { default: 'proofUrl' } },
      { field: 'cleaningRate', title: '保洁覆盖率(%)', minWidth: 130 },
      { field: 'facilityRate', title: '水质达标率(%)', minWidth: 130 },
      { field: 'wasteFishingVolume', title: '垃圾打捞总量(吨)', minWidth: 150 },
      { field: 'complaintRate', title: '问题办结率(%)', minWidth: 130 },
      { field: 'statPeriod', title: '统计周期', minWidth: 120 },
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
  editText: '编辑河道信息',
  addText: '新增河道',
  excelName: '河道环境管理任务列表',
  excelAllName: '河道环境管理任务_区域_日期.xlsx',
  total: '河道总数15;保洁待执行3;监测待执行3;问题待处置3;已完成3',
};
