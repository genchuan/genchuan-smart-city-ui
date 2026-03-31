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

// 处置状态选项
export function getHandleStatusOptions() {
  return requestClient.get('/envirhealth/handle-status/options');
}

// 计划状态选项
export function getPlanStatusOptions() {
  return requestClient.get('/envirhealth/plan-status/options');
}

// 复核结果选项
export function getReviewResultOptions() {
  return requestClient.get('/envirhealth/review-result/options');
}

// 问题类型选项
export function getProblemTypeOptions() {
  return requestClient.get('/envirhealth/problem-type/options');
}

// 部门选项
export function getDeptOptions() {
  return requestClient.get('/envirhealth/dept/options');
}

// ========== 原有新增/编辑表单 schema（用于非“全部”标签页，字段名基于模拟数据） ==========
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '城中村名称',
      component: 'Input',
      componentProps: { placeholder: '请输入城中村名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '城中村地址',
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
      fieldName: 'responsibilityAreas',
      label: '责任区域数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入责任区域数量', min: 0 },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'roadCleaningFrequency',
      label: '道路保洁频次',
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
export function useUrbanVillageEditSchema() {
  return [
    {
      fieldName: 'name',
      label: '城中村名称',
      component: 'Input',
      componentProps: { placeholder: '请输入城中村名称' },
    },
    {
      fieldName: 'address',
      label: '城中村地址',
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
      fieldName: 'responsibilityAreas',
      label: '责任区域数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 0 },
    },
    {
      fieldName: 'roadCleaningFrequency',
      label: '道路保洁频次',
      component: 'Input',
      componentProps: { placeholder: '请输入保洁频次，如每30分钟1次' },
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
export function useUrbanVillageSearchSchema() {
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
      { field: 'name', title: '城中村名称', minWidth: 160, sortable: true, slots: { default: 'name' } },
      { field: 'address', title: '城中村地址', minWidth: 200 },
      { field: 'areaName', title: '所属区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'responsibilityAreas', title: '责任区域数', minWidth: 120 },
      { field: 'roadCleaningFrequency', title: '道路保洁频次', minWidth: 130 },
      { field: 'managerName', title: '负责人', minWidth: 120 },
      { field: 'operationStatusName', title: '运营状态', minWidth: 120, slots: { default: 'operationStatus' } },
      {
        field: 'cleaningRate',
        title: '保洁达标率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'problemRate',
        title: '问题处置完成率(%)',
        minWidth: 150,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'reviewPassRate',
        title: '复核通过率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'assessmentScore',
        title: '考核得分',
        minWidth: 100,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
    ],
    // 以下四个标签页的列配置完全保留原样（基于模拟数据字段）
    保洁待执行: [
      { field: 'toiletName', title: '城中村名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'responsibilityArea', title: '责任区域', minWidth: 180 },
      { field: 'area', title: '所属区域', minWidth: 180 },
      { field: 'roadCleaningFrequency', title: '道路保洁频次', minWidth: 130 },
      { field: 'cleaningTime', title: '保洁时段', minWidth: 180 },
      { field: 'cleaningStandard', title: '保洁标准', minWidth: 120 },
      { field: 'staff', title: '负责人员', minWidth: 150 },
      { field: 'planStatus', title: '计划状态', minWidth: 100, slots: { default: 'planStatus' } },
      { field: 'createBy', title: '创建人', minWidth: 120 },
      { field: 'createTime', title: '创建时间', minWidth: 180 },
      { field: 'updateTime', title: '更新时间', minWidth: 180 },
      { field: 'cleaningPlanCompleteRate', title: '计划完成率(%)', minWidth: 130 },
      { field: 'cleaningRate', title: '保洁达标率(%)', minWidth: 130 },
    ],
    问题待处置: [
      { field: 'complaintId', title: '问题编号', minWidth: 150, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '城中村名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'complaintType', title: '问题类型', minWidth: 120, slots: { default: 'complaintType' } },
      { field: 'problemLocation', title: '问题位置', minWidth: 180 },
      { field: 'complaintContent', title: '问题描述', minWidth: 200 },
      { field: 'complaintName', title: '上报人员', minWidth: 120 },
      { field: 'complaintTime', title: '上报时间', minWidth: 180 },
      { field: 'photoUrl', title: '现场照片', minWidth: 100, slots: { default: 'photoUrl' } },
      { field: 'dept', title: '责任部门', minWidth: 120 },
      { field: 'handler', title: '处置责任人', minWidth: 120 },
      { field: 'dispatchTime', title: '派单时间', minWidth: 180 },
      { field: 'handleStatus', title: '处置状态', minWidth: 100 },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    处置待复核: [
      { field: 'repairId', title: '复核编号', minWidth: 150, slots: { default: 'repairId' } },
      { field: 'toiletName', title: '城中村名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'complaintType', title: '问题类型', minWidth: 120, slots: { default: 'complaintType' } },
      { field: 'problemLocation', title: '问题位置', minWidth: 180 },
      { field: 'handleBy', title: '处置责任人', minWidth: 120 },
      { field: 'handleTime', title: '处置时间', minWidth: 180 },
      { field: 'handleDesc', title: '处置说明', minWidth: 200 },
      { field: 'reformPhotoUrl', title: '整改照片', minWidth: 100, slots: { default: 'reformPhotoUrl' } },
      { field: 'reviewBy', title: '复核人员', minWidth: 120 },
      { field: 'reviewTime', title: '复核时间', minWidth: 180 },
      { field: 'reviewResult', title: '复核结果', minWidth: 100 },
      { field: 'reviewOpinion', title: '复核意见', minWidth: 150 },
      { field: 'reviewPassRate', title: '复核通过率(%)', minWidth: 130 },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '城中村名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180 },
      { field: 'handler', title: '处置人员', minWidth: 120 },
      { field: 'handleResult', title: '处置结果', minWidth: 120 },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, slots: { default: 'proofUrl' } },
      { field: 'cleaningRate', title: '保洁达标率(%)', minWidth: 130 },
      { field: 'problemRate', title: '问题办结率(%)', minWidth: 130 },
      { field: 'reviewPassRate', title: '复核通过率(%)', minWidth: 130 },
      { field: 'statPeriod', title: '统计周期', minWidth: 120 },
      { field: 'assessmentScore', title: '考核得分', minWidth: 100 },
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
  editText: '编辑城中村信息',
  addText: '新增城中村',
  excelName: '城中村环境管理任务列表',
  excelAllName: '城中村环境管理任务_区域_日期.xlsx',
  total: '城中村总数3;保洁待执行3;问题待处置3;处置待复核3;已完成3',
};
