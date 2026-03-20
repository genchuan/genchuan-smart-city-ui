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

export function getFacilityOptions() {
  return requestClient.get('/envirhealth/facility/options');
}

// ========== 原有新增/编辑表单 schema（用于非“全部”标签页，字段名基于模拟数据） ==========
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '商业街名称',
      component: 'Input',
      componentProps: { placeholder: '请输入商业街名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '商业街地址',
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
          { label: '每日两次', value: '每日两次' },
          { label: '每日四次', value: '每日四次' },
          { label: '每日六次', value: '每日六次' },
          { label: '每日八次', value: '每日八次' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'transferInterval',
      label: '垃圾清运间隔(小时)',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入间隔小时数', min: 0.5, step: 0.5 },
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
export function useCommercialStreetEditSchema() {
  return [
    {
      fieldName: 'name',
      label: '商业街名称',
      component: 'Input',
      componentProps: { placeholder: '请输入商业街名称' },
    },
    {
      fieldName: 'address',
      label: '商业街地址',
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
      fieldName: 'cleaningFrequency',
      label: '保洁频次',
      component: 'Input',
      componentProps: { placeholder: '请输入保洁频次，如每30分钟1次' },
    },
    {
      fieldName: 'transferInterval',
      label: '垃圾清运间隔',
      component: 'Input',
      componentProps: { placeholder: '请输入清运间隔，如每1小时1次' },
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
export function useCommercialStreetSearchSchema() {
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
      { field: 'name', title: '商业街名称', minWidth: 160, sortable: true, slots: { default: 'name' } },
      { field: 'address', title: '商业街地址', minWidth: 200, sortable: true },
      { field: 'areaName', title: '所属区域', minWidth: 180, sortable: true },
      { field: 'cleaningFrequency', title: '保洁频次', minWidth: 120, sortable: true },
      { field: 'transferInterval', title: '清运间隔', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue || '-') },
      { field: 'managerName', title: '负责人', minWidth: 120, sortable: true },
      { field: 'operationStatusName', title: '运营状态', minWidth: 120, sortable: true },
      {
        field: 'cleaningCoverage',
        title: '保洁覆盖率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'facilityRate',
        title: '设施完好率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'disposalDuration',
        title: '问题平均处置时长(分)',
        minWidth: 160,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}分钟` : '-'),
      },
      {
        field: 'collectionCompleteRate',
        title: '收运完成率(%)',
        minWidth: 130,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
    ],
    // 以下五个标签页的列配置完全保留原样（基于模拟数据字段）
    保洁待执行: [
      { field: 'toiletName', title: '商业街名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      { field: 'cleaningFrequency', title: '保洁频次', minWidth: 120, sortable: true },
      { field: 'patrolInterval', title: '巡回保洁间隔(分)', minWidth: 150, sortable: true, formatter: ({ cellValue }) => (cellValue ? `${cellValue}分钟` : '-') },
      { field: 'cleaningTime', title: '保洁时段', minWidth: 200, sortable: true },
      { field: 'cleaner', title: '保洁人员', minWidth: 150, sortable: true },
      { field: 'responsibilityArea', title: '责任区域', minWidth: 200, sortable: true },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      { field: 'isEffective', title: '是否生效', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    收运待执行: [
      { field: 'toiletName', title: '商业街名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true },
      { field: 'collectionPoints', title: '垃圾收集点位', minWidth: 140, sortable: true },
      { field: 'transferInterval', title: '清运间隔(小时)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue ? `${cellValue}小时` : '-') },
      { field: 'collectionTime', title: '收运时段', minWidth: 180, sortable: true },
      { field: 'vehicle', title: '负责车辆', minWidth: 130, sortable: true, slots: { default: 'vehicle' } },
      { field: 'staff', title: '负责人员', minWidth: 150, sortable: true },
      { field: 'planStatus', title: '计划状态', minWidth: 100, sortable: true, slots: { default: 'planStatus' } },
      { field: 'createBy', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
      { field: 'collectionCompleteRate', title: '收运完成率(%)', minWidth: 130, sortable: true },
      { field: 'abnormalCount', title: '异常记录数', minWidth: 100, sortable: true },
    ],
    设施待维护: [
      { field: 'repairId', title: '维护编号', minWidth: 150, sortable: true, slots: { default: 'repairId' } },
      { field: 'toiletName', title: '商业街名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'facilityType', title: '设施类型', minWidth: 120, sortable: true, slots: { default: 'facilityType' } },
      { field: 'facilityLocation', title: '设施位置', minWidth: 180, sortable: true },
      { field: 'damageDesc', title: '损坏描述', minWidth: 200, sortable: true },
      { field: 'reportBy', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'reportTime', title: '上报时间', minWidth: 180, sortable: true },
      { field: 'photoUrl', title: '上报照片', minWidth: 100, sortable: true, slots: { default: 'photoUrl' } },
      { field: 'repairBy', title: '维护责任人', minWidth: 120, sortable: true },
      { field: 'dispatchTime', title: '派单时间', minWidth: 180, sortable: true },
      { field: 'repairStatus', title: '维护状态', minWidth: 100, sortable: true },
      { field: 'expectedCompleteTime', title: '预计完成时间', minWidth: 180, sortable: true },
    ],
    问题待处置: [
      { field: 'complaintId', title: '问题编号', minWidth: 150, sortable: true, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '商业街名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'complaintType', title: '问题类型', minWidth: 120, sortable: true, slots: { default: 'complaintType' } },
      { field: 'problemLocation', title: '问题位置', minWidth: 180, sortable: true },
      { field: 'complaintContent', title: '问题描述', minWidth: 200, sortable: true },
      { field: 'complaintName', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'complaintTime', title: '上报时间', minWidth: 180, sortable: true },
      { field: 'photoUrl', title: '现场照片', minWidth: 100, sortable: true, slots: { default: 'photoUrl' } },
      { field: 'handler', title: '处置责任人', minWidth: 120, sortable: true },
      { field: 'dispatchTime', title: '派单时间', minWidth: 180, sortable: true },
      { field: 'handleStatus', title: '处置状态', minWidth: 100, sortable: true },
      { field: 'disposalDuration', title: '处置时长(分)', minWidth: 120, sortable: true },
      { field: 'handleResult', title: '处置结果', minWidth: 120, sortable: true },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, sortable: true, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '商业街名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, sortable: true, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180, sortable: true },
      { field: 'handler', title: '处置人员', minWidth: 120, sortable: true },
      { field: 'handleResult', title: '处置结果', minWidth: 120, sortable: true },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, sortable: true, slots: { default: 'proofUrl' } },
      { field: 'cleaningCoverage', title: '保洁覆盖率(%)', minWidth: 130, sortable: true },
      { field: 'facilityRate', title: '设施完好率(%)', minWidth: 130, sortable: true },
      { field: 'collectionCompleteRate', title: '收运完成率(%)', minWidth: 130, sortable: true },
      { field: 'statPeriod', title: '统计周期', minWidth: 120, sortable: true },
      { field: 'manageScore', title: '综合管理评分', minWidth: 120, sortable: true },
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
  editText: '编辑商业街信息',
  addText: '新增商业街',
  excelName: '商业街环境管理任务列表',
  excelAllName: '商业街环境管理任务_区域_日期.xlsx',
  total: '商业街总数3;保洁待执行3;收运待执行3;设施待维护3;问题待处置3;已完成3',
};
