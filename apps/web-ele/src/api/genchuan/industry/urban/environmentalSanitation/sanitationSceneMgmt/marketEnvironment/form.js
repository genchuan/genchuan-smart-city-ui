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

export function getGarbageTypeOptions() {
  return requestClient.get('/envirhealth/garbage-type/options');
}

export function getVehicleOptions() {
  return requestClient.get('/envirhealth/vehicle/options');
}

// 处置状态选项（可选）
export function getHandleStatusOptions() {
  return requestClient.get('/envirhealth/handle-status/options');
}

// 核查结果选项（可选）
export function getCheckResultOptions() {
  return requestClient.get('/envirhealth/check-result/options');
}

// ========== 原有新增/编辑表单 schema（用于非“全部”标签页，字段名基于模拟数据） ==========
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '市场名称',
      component: 'Input',
      componentProps: { placeholder: '请输入市场名称' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '市场地址',
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
      fieldName: 'stallCount',
      label: '摊位数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入摊位数量', min: 0 },
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
export function useMarketEditSchema() {
  return [
    {
      fieldName: 'name',
      label: '市场名称',
      component: 'Input',
      componentProps: { placeholder: '请输入市场名称' },
    },
    {
      fieldName: 'address',
      label: '市场地址',
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
      fieldName: 'stallCount',
      label: '摊位数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入', min: 0 },
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
export function useMarketSearchSchema() {
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
      { field: 'name', title: '市场名称', minWidth: 160, sortable: true, slots: { default: 'name' } },
      { field: 'address', title: '市场地址', minWidth: 200 },
      { field: 'areaName', title: '所属区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'stallCount', title: '摊位数量', minWidth: 100 },
      { field: 'managerName', title: '负责人', minWidth: 120 },
      { field: 'operationStatusName', title: '运营状态', minWidth: 120, slots: { default: 'operationStatus' } },
      {
        field: 'hygieneRate',
        title: '卫生达标率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'wasteTransferRate',
        title: '收运完成率(%)',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'sewageRate',
        title: '污水处置合格率(%)',
        minWidth: 150,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
      {
        field: 'unfinishedTaskCount',
        title: '未完成任务数',
        minWidth: 120,
      },
    ],
    // 以下五个标签页的列配置完全保留原样（基于模拟数据字段）
    保洁待执行: [
      { field: 'toiletName', title: '市场名称', minWidth: 150, sortable: true, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180 },
      { field: 'cleaningFrequency', title: '保洁频次', minWidth: 120 },
      { field: 'cleaningTime', title: '保洁时段', minWidth: 180 },
      { field: 'cleaningArea', title: '保洁区域', minWidth: 150 },
      { field: 'cleaner', title: '负责人员', minWidth: 150 },
      { field: 'cleaningStandard', title: '保洁标准', minWidth: 120 },
      { field: 'createBy', title: '创建人', minWidth: 120 },
      { field: 'createTime', title: '创建时间', minWidth: 180 },
      { field: 'updateTime', title: '更新时间', minWidth: 180 },
      { field: 'isEffective', title: '是否生效', minWidth: 100, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
      { field: 'cleaningPlanCompleteRate', title: '计划完成率(%)', minWidth: 130 },
    ],
    收运待执行: [
      { field: 'toiletName', title: '市场名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180 },
      { field: 'consumableName', title: '垃圾类型', minWidth: 120, slots: { default: 'consumableName' } },
      { field: 'currentStock', title: '收集容器数量', minWidth: 130 },
      { field: 'threshold', title: '收运间隔(小时)', minWidth: 120 },
      { field: 'lastSupplyTime', title: '收运时段', minWidth: 150 },
      { field: 'repairBy', title: '负责车辆', minWidth: 130, slots: { default: 'repairBy' } },
      { field: 'handler', title: '负责人员', minWidth: 150 },
      { field: 'createBy', title: '创建人', minWidth: 120 },
      { field: 'createTime', title: '创建时间', minWidth: 180 },
      { field: 'updateTime', title: '更新时间', minWidth: 180 },
      { field: 'wasteTransferCompleteRate', title: '收运完成率(%)', minWidth: 130 },
    ],
    污水待处置: [
      { field: 'complaintId', title: '问题编号', minWidth: 150, slots: { default: 'complaintId' } },
      { field: 'toiletName', title: '市场名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'sewageDischargeArea', title: '污水排放区域', minWidth: 150 },
      { field: 'complaintType', title: '处置方式', minWidth: 120, slots: { default: 'complaintType' } },
      { field: 'sewageCleaningFrequency', title: '清理频次', minWidth: 120 },
      { field: 'complaintName', title: '负责人员', minWidth: 120 },
      { field: 'complaintTime', title: '上次清理时间', minWidth: 180 },
      { field: 'handleStatus', title: '处置状态', minWidth: 100 },
      { field: 'nextCleaningTime', title: '下次清理时间', minWidth: 180 },
      { field: 'sewageRate', title: '处置合格率(%)', minWidth: 130 },
      { field: 'disposalLog', title: '处置日志', minWidth: 200 },
    ],
    卫生待核查: [
      { field: 'repairId', title: '核查编号', minWidth: 150, slots: { default: 'repairId' } },
      { field: 'toiletName', title: '市场名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'facilityType', title: '核查时段', minWidth: 120, slots: { default: 'facilityType' } },
      { field: 'facilityLocation', title: '核查人员', minWidth: 120 },
      { field: 'reportTime', title: '核查日期', minWidth: 180 },
      { field: 'damageDesc', title: '前期问题', minWidth: 200 },
      { field: 'repairStatus', title: '核查结果', minWidth: 100 },
      { field: 'qualifiedItemCount', title: '达标项数', minWidth: 100 },
      { field: 'unqualifiedItemCount', title: '不达标项数', minWidth: 110 },
      { field: 'hygieneRate', title: '卫生达标率(%)', minWidth: 130 },
      { field: 'reformRequire', title: '整改要求', minWidth: 150 },
      { field: 'expectedCompleteTime', title: '整改期限', minWidth: 180 },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 120, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '市场名称', minWidth: 150, slots: { default: 'toiletName' } },
      { field: 'area', title: '所属区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180 },
      { field: 'handler', title: '处置人员', minWidth: 120 },
      { field: 'handleResult', title: '处置结果', minWidth: 120 },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, slots: { default: 'proofUrl' } },
      { field: 'hygieneRate', title: '卫生达标率(%)', minWidth: 130 },
      { field: 'wasteTransferCompleteRate', title: '收运完成率(%)', minWidth: 130 },
      { field: 'sewageRate', title: '污水处置合格率(%)', minWidth: 150 },
      { field: 'statPeriod', title: '统计周期', minWidth: 120 },
      { field: 'manageScore', title: '综合管理评分', minWidth: 130 },
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
  editText: '编辑市场信息',
  addText: '新增市场',
  excelName: '集贸市场环境管理任务列表',
  excelAllName: '集贸市场环境管理任务_区域_日期.xlsx',
  total: '市场总数3;保洁待执行3;收运待执行3;污水待处置3;卫生待核查3;已完成3',
};
