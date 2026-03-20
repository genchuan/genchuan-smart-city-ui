// ---------- options 接口 ----------
import { requestClient } from '#/api/request';

export function getGarbageTypeOptions() {
  return requestClient.get('/envirhealth/garbage-type/options');
}

export function getPointOptions() {
  return requestClient.get('/envirhealth/point/options');
}

export function getPlanStatusOptions() {
  return requestClient.get('/envirhealth/plan-status/options');
}

export function getCollectionFrequencyOptions() {
  return requestClient.get('/envirhealth/collection-frequency/options');
}

export function getUserOptions() {
  return requestClient.get('/envirhealth/user/options');
}

export function getVehicleOptions() {
  return requestClient.get('/envirhealth/vehicle/options');
}

export function getTimePeriodOptions() {
  return requestClient.get('/envirhealth/collection-time-period/options');
}

export function getAreaOptions() {
  return requestClient.get('/envirhealth/area/options');
}

// 异常数据相关选项接口
export function getAbnormalTypeOptions() {
  return requestClient.get('/envirhealth/abnormal-type/options');
}

export function getHandleStatusOptions() {
  return requestClient.get('/envirhealth/handle-status/options');
}

export function getReviewStatusOptions() {
  return requestClient.get('/envirhealth/review-status/options');
}

export function getGarbageCollectionOptions() {
  return requestClient.get('/envirhealth/garbage-collection/options');
}

// 通用表单 Schema（搜索和编辑共用，通过 searchFilter 标记搜索字段）
export function useFormSchema() {
  return [
    {
      fieldName: 'planNo',
      label: '收运计划单编号',
      component: 'Input',
      componentProps: { placeholder: '请输入计划单编号（新增时自动生成）' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'garbageTypeId',
      label: '收运品类',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择收运品类',
        options: [],
      },
      searchFilter: true,
    },
    {
      fieldName: 'areaCode',
      label: '收运区域',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择收运区域',
        options: [],
      },
      searchFilter: true,
    },
    {
      fieldName: 'pointIds',
      label: '收运点位',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择收运点位（可多选）',
        multiple: true,
        options: [],
      },
    },
    {
      fieldName: 'frequency',
      label: '收运频次',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择收运频次',
        options: [],
      },
      searchFilter: true,
    },
    {
      fieldName: 'timePeriod',
      label: '收运时段',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择收运时段',
        options: [],
      },
    },
    {
      fieldName: 'vehicleId',
      label: '负责车辆',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择车辆',
        options: [],
      },
      searchFilter: true,
    },
    {
      fieldName: 'staffIds',
      label: '负责人员',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择负责人员（可多选）',
        multiple: true,
        options: [],
      },
    },
    {
      fieldName: 'planStatusId',
      label: '计划状态',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择计划状态',
        options: [],
      },
      searchFilter: true,
    },
    {
      fieldName: 'totalVolume',
      label: '总收运量',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入总收运量',
        type: 'number',
        step: 0.1,
      },
    },
    {
      fieldName: 'abnormalResult',
      label: '异常处置结果',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择异常处置结果',
        options: [
          { label: '无', value: '无' },
          { label: '已办结', value: '已办结' },
          { label: '部分办结', value: '部分办结' },
        ],
      },
    },
    {
      fieldName: 'createBy',
      label: '创建人',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择创建人',
        options: [],
      },
    },
    {
      fieldName: 'completeTime',
      label: '完成时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择完成时间',
        type: 'datetime',
        valueFormat: 'x',
      },
    },
  ];
}

// 异常上报
export function useAbnormalFormSchema() {
  return [
    {
      fieldName: 'planNo',
      label: '关联计划单',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择关联计划单',
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'abnormalTypeId',
      label: '异常类型',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择异常类型',
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'abnormalDesc',
      label: '异常描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入异常描述',
        type: 'textarea',
        rows: 3,
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'areaCode',
      label: '发生区域',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择发生区域',
        options: [],
      },
    },
    {
      fieldName: 'priority',
      label: '优先级',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择优先级',
        options: [
          { label: '高', value: '高' },
          { label: '中', value: '中' },
          { label: '低', value: '低' },
        ],
      },
    },
    {
      fieldName: 'reportUserId',
      label: '上报人员',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择上报人员',
        options: [],
      },
    },
    {
      fieldName: 'reportTime',
      label: '上报时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择上报时间',
        type: 'datetime',
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm',
      },
    },
    {
      fieldName: 'handleStatus',
      label: '处置状态',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [],
      },
    },
    {
      fieldName: 'abnormalPhotoUrl',
      label: '异常照片',
      component: 'Upload',
      labelWidth: '100',
      componentProps: {
        tip: '支持上传图片，最多9张',
        limit: 9,
        accept: 'image/*',
      },
    },
  ];
}

// 异常处置
export function useAbnormalHandleSchema() {
  return [
    {
      fieldName: 'planNo',
      label: '关联计划单',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择关联计划单',
        options: [],
        disabled: true,
      },
    },
    {
      fieldName: 'handlerId',
      label: '处置人员',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择处置人员',
        options: [],
      },
    },
    {
      fieldName: 'handleTime',
      label: '处置时间',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择处置时间',
        type: 'datetime',
        valueFormat: 'x',
        format: 'YYYY-MM-DD HH:mm',
      },
    },
    {
      fieldName: 'handleStatus',
      label: '处置状态',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [],
      },
    },
    {
      fieldName: 'handleDesc',
      label: '整改说明',
      component: 'Input',
      componentProps: {
        placeholder: '请输入整改说明',
        type: 'textarea',
        rows: 3,
      },
      labelWidth: '120',
    },
    {
      fieldName: 'handlePhotoUrl',
      label: '整改照片',
      component: 'Upload',
      labelWidth: '100',
      componentProps: {
        tip: '支持上传图片，最多9张',
        limit: 9,
        accept: 'image/*',
      },
    },
  ];
}

// ---------- 新增弹窗表单 Schema ----------

// 批量导入弹窗（上传文件，无复杂表单）
export function useBatchImportSchema() {
  return [
    {
      fieldName: 'file',
      label: '上传文件',
      component: 'Upload',
      labelWidth: '100',
      componentProps: {
        accept: '.xlsx,.xls',
        limit: 1,
        tip: '请上传 Excel 文件',
      },
      rules: 'required',
    },
  ];
}

// 批量调整弹窗
export function useBatchAdjustSchema() {
  return [
    {
      fieldName: 'adjustType',
      label: '调整维度',
      component: 'RadioGroup',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '时段', value: 'timePeriod' },
          { label: '频次', value: 'frequency' },
          { label: '车辆', value: 'vehicleId' },
          { label: '人员', value: 'staffIds' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'newTimePeriod',
      label: '新时段',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择新时段',
        options: [],
      },
      dependencies: {
        show: (values) => values.adjustType === 'timePeriod',
      },
    },
    {
      fieldName: 'newFrequency',
      label: '新频次',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择新频次',
        options: [],
      },
      dependencies: {
        show: (values) => values.adjustType === 'frequency',
      },
    },
    {
      fieldName: 'newVehicleId',
      label: '新车辆',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择新车辆',
        options: [],
      },
      dependencies: {
        show: (values) => values.adjustType === 'vehicleId',
      },
    },
    {
      fieldName: 'newStaffIds',
      label: '新人员',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择新人员（可多选）',
        multiple: true,
        options: [],
      },
      dependencies: {
        show: (values) => values.adjustType === 'staffIds',
      },
    },
  ];
}

// 沟通弹窗
export function useCommunicationSchema() {
  return [
    {
      fieldName: 'message',
      label: '沟通内容',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: '请输入发送给作业人员的文字提醒',
      },
      labelWidth: '100',
      rules: 'required',
    },
  ];
}

// 派发弹窗 / 指派弹窗（共用）
export function useDispatchSchema() {
  return [
    {
      fieldName: 'handlerId',
      label: '责任人',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择责任人',
        options: [],
      },
      rules: 'required',
    },
  ];
}

// 跟踪弹窗（查看日志+添加备注）
export function useTrackSchema() {
  return [
    {
      fieldName: 'remark',
      label: '跟进备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入跟进备注',
      },
      labelWidth: '100',
    },
  ];
  // 注意：日志列表需要额外展示，不在表单内
}

// 复核弹窗
export function useReviewSchema() {
  return [
    {
      fieldName: 'reviewResult',
      label: '复核结果',
      component: 'RadioGroup',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '通过', value: '通过' },
          { label: '退回', value: '退回' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'reviewComment',
      label: '复核意见',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入复核意见',
      },
      labelWidth: '100',
    },
  ];
}

// 复盘弹窗
export function useReviewPostSchema() {
  return [
    {
      fieldName: 'reviewPostComment',
      label: '复盘意见',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: '请输入复盘意见',
      },
      labelWidth: '100',
      rules: 'required',
    },
  ];
}

// 批量处理弹窗（用于异常待处置）
export function useBatchHandleSchema() {
  return [
    {
      fieldName: 'handleStatus',
      label: '处置状态',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [], // 选项会在组件中动态更新
      },
      rules: 'required',
    },
  ];
}

// 表格列配置（按状态筛选）
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      {
        field: 'planNo',
        title: '收运计划单编号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'planNo' },
      },
      {
        field: 'garbageTypeName',
        title: '收运品类',
        minWidth: 120,
        sortable: true,
      },
      { field: 'areaCode', title: '收运区域', minWidth: 180, sortable: true },
      { field: 'frequency', title: '收运频次', minWidth: 120, sortable: true },
      { field: 'timePeriod', title: '收运时段', minWidth: 180, sortable: true },
      {
        field: 'vehicleNumber',
        title: '负责车辆',
        minWidth: 120,
        sortable: true,
      },
      { field: 'usersName', title: '负责人员', minWidth: 120, sortable: true },
      {
        field: 'planStatusName',
        title: '计划状态',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'completionRate',
        title: '完成率',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) =>
          cellValue === undefined ? '-' : `${cellValue}%`,
      },
      {
        field: 'abnormalCount',
        title: '异常记录数',
        minWidth: 120,
        sortable: true,
      },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
    ],
    计划待执行: [
      {
        field: 'planNo',
        title: '收运计划单编号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'planNo' },
      },
      {
        field: 'garbageTypeName',
        title: '收运品类',
        minWidth: 120,
        sortable: true,
      },
      { field: 'areaCode', title: '收运区域', minWidth: 180, sortable: true },
      { field: 'pointsName', title: '收运点位', minWidth: 200, sortable: true },
      { field: 'frequency', title: '收运频次', minWidth: 120, sortable: true },
      { field: 'timePeriod', title: '收运时段', minWidth: 180, sortable: true },
      {
        field: 'vehicleNumber',
        title: '负责车辆',
        minWidth: 120,
        sortable: true,
      },
      { field: 'usersName', title: '负责人员', minWidth: 120, sortable: true },
      { field: 'createByName', title: '创建人', minWidth: 120, sortable: true },
      { field: 'createTime', title: '创建时间', minWidth: 180, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true },
    ],
    作业进行中: [
      {
        field: 'planNo',
        title: '收运计划单编号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'planNo' },
      },
      { field: 'areaCode', title: '收运区域', minWidth: 180, sortable: true },
      {
        field: 'vehicleNumber',
        title: '负责车辆',
        minWidth: 120,
        sortable: true,
      },
      { field: 'usersName', title: '负责人员', minWidth: 120, sortable: true },
      {
        field: 'completionRate',
        title: '当前进度',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => `${cellValue || 0}%`,
      },
      {
        field: 'collectedVolume',
        title: '已收运量(吨)',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'checkinStatus',
        title: '打卡状态',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'trackCoverage',
        title: '轨迹覆盖',
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'lastReportTime',
        title: '最新上报时间',
        minWidth: 180,
        sortable: true,
      },
      {
        field: 'isAbnormal',
        title: '是否异常',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
      },
    ],
    异常待处置: [
      {
        field: 'abnormalId',
        title: '异常编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'abnormalId' },
      },
      {
        field: 'planNo',
        title: '关联计划单',
        minWidth: 180,
        sortable: true,
        slots: { default: 'planNo' },
      },
      {
        field: 'abnormalType',
        title: '异常类型',
        minWidth: 120,
        sortable: true,
      },
      { field: 'areaCode', title: '发生区域', minWidth: 180, sortable: true },
      { field: 'usersName', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'createTime', title: '上报时间', minWidth: 180, sortable: true },
      { field: 'priority', title: '优先级', minWidth: 100, sortable: true },
      { field: 'handler', title: '责任人', minWidth: 120, sortable: true },
      {
        field: 'handleStatus',
        title: '处置状态',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'isTimeout',
        title: '超时提醒',
        minWidth: 100,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? '超时' : '正常'),
      },
    ],
    处置待复核: [
      {
        field: 'abnormalId',
        title: '异常编号',
        minWidth: 150,
        sortable: true,
        slots: { default: 'abnormalId' },
      },
      {
        field: 'planNo',
        title: '关联计划单',
        minWidth: 180,
        sortable: true,
        slots: { default: 'planNo' },
      },
      {
        field: 'abnormalType',
        title: '异常类型',
        minWidth: 120,
        sortable: true,
      },
      { field: 'handler', title: '处置人员', minWidth: 120, sortable: true },
      { field: 'updateTime', title: '处置时间', minWidth: 180, sortable: true },
      {
        field: 'reviewStatus',
        title: '复核状态',
        minWidth: 120,
        sortable: true,
      },
      { field: 'reviewBy', title: '复核人员', minWidth: 120, sortable: true },
      { field: 'reviewTime', title: '复核时间', minWidth: 180, sortable: true },
    ],
    已完成: [
      {
        field: 'planNo',
        title: '收运计划单编号',
        minWidth: 180,
        sortable: true,
        slots: { default: 'planNo' },
      },
      { field: 'areaCode', title: '收运区域', minWidth: 180, sortable: true },
      {
        field: 'garbageTypeName',
        title: '收运品类',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'totalVolume',
        title: '总收运量(吨)',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'abnormalResult',
        title: '异常处置结果',
        minWidth: 120,
        sortable: true,
      },
      {
        field: 'vehicleNumber',
        title: '负责车辆',
        minWidth: 120,
        sortable: true,
      },
      { field: 'usersName', title: '负责人员', minWidth: 120, sortable: true },
      {
        field: 'completionRate',
        title: '收运完成率',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) => `${cellValue || 0}%`,
      },
      {
        field: 'abnormalCompleteRate',
        title: '异常办结率',
        minWidth: 120,
        sortable: true,
        formatter: ({ cellValue }) => (cellValue ? `${cellValue}%` : '-'),
      },
      { field: 'createByName', title: '创建人', minWidth: 120, sortable: true },
      {
        field: 'completeTime',
        title: '完成时间',
        minWidth: 180,
        sortable: true,
      },
    ],
  };

  const columns = [
    ...baseColumns,
    ...(statusColumnsMap[status] || statusColumnsMap.全部),
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
  return columns;
}

export const textObj = {
  editText: '编辑收运计划',
  addText: '新增收运计划',
  excelAllName: '',
  total: '',
};
