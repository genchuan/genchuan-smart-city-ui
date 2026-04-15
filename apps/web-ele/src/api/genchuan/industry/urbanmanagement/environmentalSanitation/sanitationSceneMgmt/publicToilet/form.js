// ---------- options 接口 ----------
import { requestClient } from '#/api/request';

/**
 * 获取任务状态下拉选项
 */
export function getPlanStatusOptions() {
  return requestClient.get('/envirhealth/plan-status/options');
}

/**
 * 获取公厕名称下拉选项
 */
export function getPublicToiletOptions() {
  return requestClient.get('/envirhealth/public-toilet/options');
}

/**
 * 获取保洁人员下拉选项
 */
export function getUserOptions() {
  return requestClient.get('/envirhealth/user/options');
}

/**
 * 获取区域下拉选项
 */
export function getAreaOptions() {
  return requestClient.get('/envirhealth/area/options');
}

/**
 * 获取运营状态下拉选项
 */
export function getOperationStatusOptions() {
  return requestClient.get('/envirhealth/operation-status/options');
}

/**
 * 获取投诉类型下拉选项
 */
export function getComplaintTypeOptions() {
  return requestClient.get('/envirhealth/complaint-type/options');
}

/**
 * 获取设施类型下拉选项
 */
export function getFacilityOptions() {
  return requestClient.get('/envirhealth/facility/options');
}

/**
 * 获取耗材名称下拉选项（用于物资待补充）
 */
export function getConsumableOptions() {
  return requestClient.get('/envirhealth/consumable/options');
}

// ---------- 公厕基础表单 ----------
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '公厕名称',
      component: 'Input',
      componentProps: { placeholder: '请输入公厕名称' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: { placeholder: '请选择所属区域', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'location',
      label: '公厕位置',
      component: 'Input',
      componentProps: { placeholder: '请输入详细地址' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'openHours',
      label: '开放时段',
      component: 'Input',
      componentProps: { placeholder: '如 06:00-22:00' },
      labelWidth: '120',
    },
    {
      fieldName: 'stallCount',
      label: '蹲位数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 0 },
      labelWidth: '120',
    },
    {
      fieldName: 'operationStatusId',
      label: '运营状态',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
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
      component: 'Select',
      componentProps: {
        placeholder: '请选择保洁时段',
        options: [
          { label: '06:00-08:00', value: '06:00-08:00' },
          { label: '08:00-10:00', value: '08:00-10:00' },
          { label: '10:00-12:00', value: '10:00-12:00' },
          { label: '14:00-16:00', value: '14:00-16:00' },
          { label: '16:00-18:00', value: '16:00-18:00' },
          { label: '18:00-20:00', value: '18:00-20:00' },
          { label: '20:00-22:00', value: '20:00-22:00' },
        ],
      },
      labelWidth: '120',
    },
    {
      fieldName: 'cleaningContent',
      label: '保洁内容',
      component: 'Input',
      componentProps: { placeholder: '如 地面清洁、耗材补充' },
      labelWidth: '120',
    },
    {
      fieldName: 'cleaningStandard',
      label: '保洁标准',
      component: 'Input',
      componentProps: { placeholder: '如 无异味、无积水' },
      labelWidth: '120',
    },
    {
      fieldName: 'cleanerIds',
      label: '保洁人员',
      component: 'Select',
      componentProps: { placeholder: '请选择保洁人员', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'consumableStock',
      label: '物资库存',
      component: 'Input',
      componentProps: { placeholder: '如 卫生纸:10包' },
      labelWidth: '120',
    },
    {
      fieldName: 'consumableThreshold',
      label: '预警阈值',
      component: 'InputNumber',
      componentProps: { placeholder: '阈值数量', min: 0 },
      labelWidth: '120',
    },
    {
      fieldName: 'lastSupplyTime',
      label: '上次补充时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择时间',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'supplyCycle',
      label: '补充周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择补充周期',
        options: [
          { label: '每日', value: '每日' },
          { label: '每周', value: '每周' },
          { label: '每月', value: '每月' },
          { label: '每季度', value: '每季度' },
          { label: '不定期', value: '不定期' },
        ],
      },
      labelWidth: '120',
    },
  ];
}

// ---------- 投诉表单 ----------
export function useComplaintFormSchema() {
  return [
    {
      fieldName: 'complaintId',
      label: '投诉编号',
      component: 'Input',
      componentProps: { placeholder: '自动生成', disabled: true },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'toiletId',
      label: '关联公厕',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'complaintTypeId',
      label: '投诉类型',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'content',
      label: '投诉内容',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请输入' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'complaintName',
      label: '投诉人',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'complaintTime',
      label: '投诉时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择时间',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'dispatchStatus',
      label: '派单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '待派单', value: '待派单' },
          { label: '已派单', value: '已派单' },
          { label: '已处置', value: '已处置' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'handlerId',
      label: '责任人',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'isTimeout',
      label: '是否超时',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'handleMeasure',
      label: '处置措施',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 2, placeholder: '请输入' },
      labelWidth: '120',
    },
    {
      fieldName: 'handleResult',
      label: '处置结果',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 2, placeholder: '请输入' },
      labelWidth: '120',
    },
    {
      fieldName: 'reformPhoto',
      label: '整改照片',
      component: 'Input',
      componentProps: { placeholder: '图片URL，多个用逗号分隔' },
      labelWidth: '120',
    },
    {
      fieldName: 'feedbackContent',
      label: '反馈内容',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 2, placeholder: '请输入' },
      labelWidth: '120',
    },
  ];
}

// ---------- 维修表单 ----------
export function useRepairFormSchema() {
  return [
    {
      fieldName: 'repairId',
      label: '维修编号',
      component: 'Input',
      componentProps: { placeholder: '自动生成', disabled: true },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'toiletId',
      label: '关联公厕',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'facilityId',
      label: '设施类型',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'damageDesc',
      label: '损坏情况',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请输入' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'reportBy',
      label: '上报人员',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'reportTime',
      label: '上报时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择时间',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'photoUrl',
      label: '现场照片',
      component: 'Input',
      componentProps: { placeholder: '图片URL，多个用逗号分隔' },
      labelWidth: '120',
    },
    {
      fieldName: 'repairBy',
      label: '维修人员',
      component: 'Select',
      componentProps: { placeholder: '请选择', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'repairStatus',
      label: '维修状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '待维修', value: '待维修' },
          { label: '维修中', value: '维修中' },
          { label: '已完成', value: '已完成' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'expectedCompleteTime',
      label: '预计完成时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择时间',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'acceptResult',
      label: '验收结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '合格', value: '合格' },
          { label: '不合格', value: '不合格' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'acceptOpinion',
      label: '验收意见',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 2, placeholder: '请输入' },
      labelWidth: '120',
    },
  ];
}

// ---------- 保洁任务表单（新增） ----------
export function useCleaningFormSchema() {
  return [
    {
      fieldName: 'toiletId',
      label: '关联公厕',
      component: 'Select',
      componentProps: { placeholder: '请选择公厕', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'taskNo',
      label: '任务编号',
      component: 'Input',
      componentProps: { placeholder: '自动生成', disabled: true },
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
      component: 'Select',
      componentProps: {
        placeholder: '请选择保洁时段',
        options: [
          { label: '06:00-08:00', value: '06:00-08:00' },
          { label: '08:00-10:00', value: '08:00-10:00' },
          { label: '10:00-12:00', value: '10:00-12:00' },
          { label: '14:00-16:00', value: '14:00-16:00' },
          { label: '16:00-18:00', value: '16:00-18:00' },
          { label: '18:00-20:00', value: '18:00-20:00' },
          { label: '20:00-22:00', value: '20:00-22:00' },
        ],
      },
      labelWidth: '120',
    },
    {
      fieldName: 'cleaningContent',
      label: '保洁内容',
      component: 'Input',
      componentProps: { placeholder: '如 地面清洁、耗材补充' },
      labelWidth: '120',
    },
    {
      fieldName: 'cleaningStandard',
      label: '保洁标准',
      component: 'Input',
      componentProps: { placeholder: '如 无异味、无积水' },
      labelWidth: '120',
    },
    {
      fieldName: 'cleanerIds',
      label: '保洁人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择保洁人员',
        options: [],
        multiple: true,
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'planStatusId',
      label: '任务状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'completionRate',
      label: '完成率',
      component: 'InputNumber',
      componentProps: { placeholder: '0-100', min: 0, max: 100 },
      labelWidth: '120',
    },
    {
      fieldName: 'isAbnormal',
      label: '是否异常',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '正常', value: 0 },
          { label: '异常', value: 1 },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'abnormalDesc',
      label: '异常描述',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 2,
        placeholder: '请输入异常描述',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'proofUrls',
      label: '佐证材料',
      component: 'Input',
      componentProps: { placeholder: '图片URL，多个用逗号分隔' },
      labelWidth: '120',
    },
  ];
}

// ---------- 物资待补充表单 ----------
export function useConsumableFormSchema() {
  return [
    {
      fieldName: 'toiletId',
      label: '关联公厕',
      component: 'Select',
      componentProps: { placeholder: '请选择公厕', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'consumableId',
      label: '物资名称',
      component: 'Select',
      componentProps: { placeholder: '请选择物资', options: [] },
      labelWidth: '120',
      rules: 'required',
      searchFilter: true,
    },
    {
      fieldName: 'consumableStock',
      label: '当前库存',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入库存数量', min: 0 },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'consumableThreshold',
      label: '预警阈值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入阈值', min: 0 },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'consumableWarning',
      label: '预警状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '正常', value: '正常' },
          { label: '预警', value: '预警' },
          { label: '严重预警', value: '严重预警' },
        ],
      },
      labelWidth: '120',
    },
    {
      fieldName: 'lastSupplyTime',
      label: '上次补充时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        valueFormat: 'x',
        placeholder: '选择时间',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'supplyCycle',
      label: '补充周期（天）',
      component: 'InputNumber',
      componentProps: { placeholder: '天数', min: 0 },
      labelWidth: '120',
    },
    {
      fieldName: 'consumableGap',
      label: '缺口数量',
      component: 'InputNumber',
      componentProps: { placeholder: '自动计算', disabled: true, min: 0 },
      labelWidth: '120',
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      componentProps: { placeholder: '请选择负责人', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
  ];
}

// 表格列配置（按状态筛选）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      {
        field: 'name',
        title: '公厕名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'name' },
      },
      { field: 'location', title: '公厕位置', minWidth: 180, sortable: true },
      {
        field: 'areaName',
        title: '所属区域',
        minWidth: 180,
        sortable: true,
        slots: { default: 'area' },
      },
      { field: 'openHours', title: '开放时段', minWidth: 150, sortable: true },
      { field: 'stallCount', title: '蹲位数量', minWidth: 100, sortable: true },
      {
        field: 'operationStatusName',
        title: '运营状态',
        minWidth: 120,
        sortable: true,
        slots: { default: 'status' },
      },
      { field: 'managerName', title: '负责人', minWidth: 120, sortable: true },
      {
        field: 'cleaningRate',
        title: '保洁达标率(%)',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'complaintRate',
        title: '投诉办结率(%)',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'warningCount',
        title: '耗材库存预警数',
        minWidth: 140,
        sortable: true,
      },
      {
        field: 'facilityRate',
        title: '设施完好率(%)',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
    ],
    保洁待执行: [
      {
        field: 'toiletName',
        title: '公厕名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'name' },
      },
      {
        field: 'areaName',
        title: '所属区域',
        minWidth: 180,
        sortable: true,
        slots: { default: 'area' },
      },
      { field: 'taskNo', title: '任务编号', minWidth: 150, sortable: true },
      {
        field: 'cleaningFrequency',
        title: '保洁频次',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'cleaningTime',
        title: '保洁时段',
        minWidth: 150,
        sortable: true,
      },
      {
        field: 'cleaningContent',
        title: '保洁内容',
        minWidth: 200,
        sortable: true,
      },
      {
        field: 'cleanerNames',
        title: '保洁人员',
        minWidth: 150,
        sortable: true,
      },
      {
        field: 'cleaningStandard',
        title: '保洁标准',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'planStatusName',
        title: '任务状态',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'completionRate',
        title: '完成率(%)',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue !== undefined ? `${cellValue}%` : '-',
      },
      {
        field: 'isAbnormal',
        title: '是否异常',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue === 1 ? '是' : '否'),
      },
      {
        field: 'createTime',
        title: '创建时间',
        minWidth: 180,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue ? new Date(cellValue).toLocaleString() : '-',
      },
    ],
    物资待补充: [
      {
        field: 'toiletName',
        title: '公厕名称',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      { field: 'areaName', title: '所属区域', minWidth: 180, sortable: true },
      {
        field: 'consumableName',
        title: '物资名称',
        minWidth: 120,
        sortable: true,
        slots: { default: 'consumableName' },
      },
      {
        field: 'consumableStock',
        title: '当前库存',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'consumableThreshold',
        title: '预警阈值',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'consumableGap',
        title: '缺口数量',
        minWidth: 100,
        sortable: true,
      },
      { field: 'managerName', title: '负责人', minWidth: 120, sortable: true },
      {
        field: 'consumableWarning',
        title: '预警状态',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => cellValue || '-',
      },
      {
        field: 'lastSupplyTime',
        title: '上次补充时间',
        minWidth: 180,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue ? new Date(cellValue).toLocaleString() : '-',
      },
      {
        field: 'supplyCycle',
        title: '补充周期（天）',
        minWidth: 120,
        sortable: true,
      },
    ],
    投诉待处置: [
      {
        field: 'complaintId',
        title: '投诉编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'complaintId' },
      },
      {
        field: 'toiletName',
        title: '关联公厕',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      {
        field: 'complaintTypeName',
        title: '投诉类型',
        minWidth: 120,
        sortable: true,
      },
      { field: 'content', title: '投诉内容', minWidth: 200, sortable: true },
      {
        field: 'complaintName',
        title: '投诉人',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'complaintTime',
        title: '投诉时间',
        minWidth: 180,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue ? new Date(cellValue).toLocaleString() : '-',
      },
      { field: 'phone', title: '联系电话', minWidth: 120, sortable: true },
      {
        field: 'dispatchStatus',
        title: '派单状态',
        minWidth: 100,
        sortable: true,
      },
      { field: 'handlerName', title: '责任人', minWidth: 120, sortable: true },
      {
        field: 'isTimeout',
        title: '是否超时',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue === '是' ? '是' : '否'),
      },
    ],
    设施待维修: [
      {
        field: 'repairId',
        title: '维修编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'repairId' },
      },
      {
        field: 'toiletName',
        title: '关联公厕',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      {
        field: 'facilityName',
        title: '设施类型',
        minWidth: 120,
        sortable: true,
      },
      { field: 'damageDesc', title: '损坏情况', minWidth: 200, sortable: true },
      { field: 'reportName', title: '上报人员', minWidth: 120, sortable: true },
      {
        field: 'reportTime',
        title: '上报时间',
        minWidth: 180,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue ? new Date(cellValue).toLocaleString() : '-',
      },
      {
        field: 'photoUrl',
        title: '现场照片',
        minWidth: 100,
        sortable: true,
        slots: { default: 'photoUrl' },
      },
      { field: 'repairName', title: '维修人员', minWidth: 120, sortable: true },
      {
        field: 'repairStatus',
        title: '维修状态',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'expectedCompleteTime',
        title: '预计完成时间',
        minWidth: 180,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue ? new Date(cellValue).toLocaleString() : '-',
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
        title: '关联公厕',
        minWidth: 150,
        sortable: true,
        slots: { default: 'toiletName' },
      },
      { field: 'areaName', title: '所属区域', minWidth: 180, sortable: true },
      {
        field: 'completeTime',
        title: '完成时间',
        minWidth: 180,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue ? new Date(cellValue).toLocaleString() : '-',
      },
      {
        field: 'handlerName',
        title: '处置人员',
        minWidth: 120,
        sortable: true,
      },
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
        field: 'satisfaction',
        title: '满意度',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? `${cellValue}%` : '-'),
      },
      { field: 'statPeriod', title: '统计周期', minWidth: 120, sortable: true },
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
  editText: '编辑',
  addText: '新增',
  excelName: '公厕运营任务',
  excelAllName: '公厕运营任务_区域_日期.xlsx',
  total: '公厕总数18;保洁待执行3;物资待补充4;投诉待处置3;设施待维修4;已完成4',
};
