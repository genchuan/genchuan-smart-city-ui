import { requestClient } from '#/api/request';

// ---------- options 接口 ----------
export function getRoadOptions() {
  return requestClient.get('/envirhealth/road/options');
}

export function getAreaOptions() {
  return requestClient.get('/envirhealth/area/options');
}

export function getUserOptions() {
  return requestClient.get('/envirhealth/user/options');
}

export function getPlanStatusOptions() {
  return requestClient.get('/envirhealth/plan-status/options');
}

export function getHandleStatusOptions() {
  return requestClient.get('/envirhealth/handle-status/options');
}

export function getToolOptions() {
  return requestClient.get('/envirhealth/tool/options');
}

export function getProblemTypeOptions() {
  return requestClient.get('/envirhealth/problem-type/options');
}

export function getTeamOptions() {
  return requestClient.get('/envirhealth/team/options');
}

// ---------- 通用表单 schema ----------
export function useRoadFormSchema() {
  return [
    {
      fieldName: 'roadId',
      label: '清扫路段',
      component: 'Select',
      componentProps: { placeholder: '请选择清扫路段', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'areaCode',
      label: '责任区域',
      component: 'Select',
      componentProps: { placeholder: '请选择责任区域', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'frequency',
      label: '清扫频次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择清扫频次',
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
      fieldName: 'timePeriod',
      label: '清扫时段',
      component: 'Select',
      componentProps: {
        placeholder: '请选择清扫时段',
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
      searchFilter: true,
    },
    {
      fieldName: 'staffIds',
      label: '负责人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择负责人员',
        options: [],
        multiple: true,
        valueFormat: 'array',
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'planStatusId',
      label: '计划状态',
      component: 'Select',
      componentProps: { placeholder: '请选择计划状态', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'toolIds',
      label: '清扫工具',
      component: 'Select',
      componentProps: {
        placeholder: '请选择清扫工具',
        options: [],
        multiple: true,
        valueFormat: 'array',
      },
      labelWidth: '120',
    },
    {
      fieldName: 'standard',
      label: '清扫标准',
      component: 'Input',
      componentProps: { placeholder: '请输入清扫标准' },
      labelWidth: '120',
    },
    {
      fieldName: 'isEffective',
      label: '是否生效',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' },
        ],
      },
      labelWidth: '120',
    },
  ];
}

// ---------- 作业进行中编辑表单 schema ----------
export function useExecutingEditSchema() {
  return [
    {
      fieldName: 'planStatusId',
      label: '计划状态',
      component: 'Select',
      componentProps: { placeholder: '请选择计划状态', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'checkinTime',
      label: '到岗时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'x', placeholder: '选择时间' },
      labelWidth: '120',
    },
    {
      fieldName: 'progress',
      label: '当前进度',
      component: 'InputNumber',
      componentProps: { placeholder: '0-100', min: 0, max: 100 },
      labelWidth: '120',
    },
    {
      fieldName: 'operationStatus',
      label: '作业状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择作业状态',
        options: [
          { label: '运行', value: '运行' },
          { label: '暂停', value: '暂停' },
          { label: '异常', value: '异常' },
        ],
      },
      labelWidth: '120',
    },
    {
      fieldName: 'trackCoverage',
      label: '轨迹覆盖情况',
      component: 'Select',
      componentProps: {
        placeholder: '请选择轨迹覆盖情况',
        options: [
          { label: '合规', value: '合规' },
          { label: '偏离', value: '偏离' },
        ],
      },
      labelWidth: '120',
    },
    {
      fieldName: 'lastReportTime',
      label: '最新上报时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', valueFormat: 'x', placeholder: '选择时间' },
      labelWidth: '120',
    },
  ];
}

// 问题上报
export function useProblemReportSchema() {
  return [
    {
      fieldName: 'problemTypeId',
      label: '问题类型',
      component: 'Select',
      componentProps: { placeholder: '请选择问题类型', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'location',
      label: '问题位置',
      component: 'Input',
      componentProps: { placeholder: '请输入问题位置' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'problemDesc',
      label: '问题描述',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请输入问题描述' },
      rules: 'required',
    },
    {
      fieldName: 'reportBy',
      label: '上报人员',
      component: 'Select',
      componentProps: { placeholder: '请选择上报人员', options: [] },
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
        placeholder: '选择上报时间',
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'handleStatus',
      label: '处置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '待处置', value: '待处置' },
          { label: '处理中', value: '处理中' },
          { label: '已办结', value: '已办结' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    // 新增：照片字段（隐藏，通过上传组件管理）
    {
      fieldName: 'photoUrls',
      label: '现场照片',
      component: 'Input',
      componentProps: { placeholder: '照片URL', style: { display: 'none' } },
      labelWidth: '120',
    },
  ];
}

// 问题处置
export function useProblemFormSchema() {
  return [
    {
      fieldName: 'problemTypeId',
      label: '问题类型',
      component: 'Select',
      componentProps: { placeholder: '请选择问题类型', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'location',
      label: '问题位置',
      component: 'Input',
      componentProps: { placeholder: '请输入问题位置' },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'teamId',
      label: '处置组',
      component: 'Select',
      componentProps: { placeholder: '请选择处置组', options: [] },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'handleStatus',
      label: '处置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '待处置', value: '待处置' },
          { label: '处理中', value: '处理中' },
          { label: '已办结', value: '已办结' },
        ],
      },
      labelWidth: '120',
      searchFilter: true,
    },
    {
      fieldName: 'isTimeout',
      label: '超时提醒',
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
  ];
}

// 批量问题处理（用于问题待处置标签页）
export function useBatchProblemSchema() {
  return [
    {
      fieldName: 'action',
      label: '批量操作',
      component: 'RadioGroup',
      labelWidth: '100',
      componentProps: {
        options: [
          { label: '派发', value: 'dispatch' },
          { label: '更新状态', value: 'updateStatus' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'teamId',
      label: '处置组',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择处置组',
        options: [],
      },
      dependencies: {
        show: (values) => values.action === 'dispatch',
      },
    },
    {
      fieldName: 'handleStatus',
      label: '处置状态',
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [],
      },
      dependencies: {
        show: (values) => values.action === 'updateStatus',
      },
    },
  ];
}

// 批量调整
export function useBatchAdjustFormSchema() {
  return [
    {
      fieldName: 'adjustType',
      label: '调整维度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择调整维度',
        options: [
          { label: '清扫时段', value: 'timePeriod' },
          { label: '清扫频次', value: 'frequency' },
          { label: '负责人员', value: 'staffIds' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'newTimePeriod',
      label: '新清扫时段',
      component: 'Select',
      componentProps: {
        placeholder: '请选择清扫时段',
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
      if: ({ values }) => values.adjustType === 'timePeriod',
    },
    {
      fieldName: 'newFrequency',
      label: '新清扫频次',
      component: 'Select',
      componentProps: {
        placeholder: '请选择新清扫频次',
        options: [
          { label: '每日一次', value: '每日一次' },
          { label: '每日两次', value: '每日两次' },
          { label: '每周三次', value: '每周三次' },
          { label: '每周一次', value: '每周一次' },
        ],
      },
      if: ({ values }) => values.adjustType === 'frequency',
    },
    {
      fieldName: 'newStaffIds',
      label: '新负责人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择新负责人员',
        options: [],
        multiple: true,
        valueFormat: 'array',
      },
      if: ({ values }) => values.adjustType === 'staffIds',
    },
  ];
}

// 批量核查
export function useBatchReviewFormSchema() {
  return [
    {
      fieldName: 'reviewStatus',
      label: '核查结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '达标', value: '达标' },
          { label: '不达标', value: '不达标' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'reformRequire',
      label: '核查意见',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '不达标时请填写整改要求' },
    }
  ];
}

// 核查
export function useReviewFormSchema() {
  return [
    {
      fieldName: 'reviewStatus',
      label: '核查结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '待核查', value: '待核查' },
          { label: '达标', value: '达标' },
          { label: '不达标', value: '不达标' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'reformRequire',
      label: '整改要求',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '不达标时请填写整改要求' },
    },
    {
      fieldName: 'reviewPhotoUrl',
      label: '核查照片',
      component: 'Input',
      componentProps: { placeholder: '照片URL', style: { display: 'none' } },
    },
  ];
}

// 沟通
export function useCommunicationFormSchema() {
  return [
    {
      fieldName: 'message',
      label: '提醒内容',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请输入提醒内容' },
      rules: 'required',
    },
  ];
}

// 复盘
export function useAftermathFormSchema() {
  return [
    {
      fieldName: 'reviewOpinion',
      label: '复盘意见',
      component: 'Input',
      componentProps: { type: 'textarea', rows: 3, placeholder: '请输入复盘意见' },
      rules: 'required',
    },
  ];
}

// ---------- 表格列配置（按状态筛选）----------
export function getColumnsByStatus(status) {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const statusColumnsMap = {
    全部: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'areaName', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'frequency', title: '清扫频次', minWidth: 120, sortable: true },
      { field: 'timePeriod', title: '清扫时段', minWidth: 180, sortable: true },
      { field: 'staffsName', title: '负责人员', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'planStatusName', title: '计划状态', minWidth: 120, sortable: true },
      { field: 'qualityRate', title: '质量达标率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined && cellValue !== null ? `${cellValue}%` : '-') },
      { field: 'problemCount', title: '问题处置数', minWidth: 100, sortable: true },
      { field: 'attendanceRate', title: '考勤全勤率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined && cellValue !== null ? `${cellValue}%` : '-') },
    ],
    清扫待执行: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'areaName', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'frequency', title: '清扫频次', minWidth: 120, sortable: true },
      { field: 'timePeriod', title: '清扫时段', minWidth: 180, sortable: true },
      { field: 'staffsName', title: '负责人员', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'toolsName', title: '清扫工具', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'standard', title: '清扫标准', minWidth: 150, sortable: true },
      { field: 'isEffective', title: '是否生效', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue === '是' ? '是' : '否') },
      { field: 'creator', title: '创建人', minWidth: 120, sortable: true },
      { field: 'updateTime', title: '更新时间', minWidth: 180, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
    ],
    作业进行中: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'areaName', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'staffsName', title: '负责人员', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'checkinTime', title: '到岗时间', minWidth: 160, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
      { field: 'progress', title: '当前进度(%)', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'operationStatus', title: '作业状态', minWidth: 100, sortable: true },
      { field: 'trackCoverage', title: '轨迹覆盖', minWidth: 100, sortable: true },
      { field: 'lastReportTime', title: '最新上报时间', minWidth: 160, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
      { field: 'isAbnormal', title: '是否异常', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue === '是' ? '是' : '否') },
    ],
    问题待处置: [
      { field: 'problemId', title: '问题编号', minWidth: 150, sortable: true, slots: { default: 'problemId' } },
      { field: 'planId', title: '关联计划', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'problemTypeName', title: '问题类型', minWidth: 120, sortable: true },
      { field: 'location', title: '问题位置', minWidth: 200, sortable: true },
      { field: 'reportName', title: '上报人员', minWidth: 120, sortable: true },
      { field: 'reportTime', title: '上报时间', minWidth: 160, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
      { field: 'problemDesc', title: '问题描述', minWidth: 200, sortable: true },
      // 新增照片列
      { field: 'photoUrls', title: '现场照片', minWidth: 100, sortable: false, slots: { default: 'photoUrls' } },
      { field: 'teamName', title: '处置组', minWidth: 120, sortable: true },
      { field: 'handleStatus', title: '处置状态', minWidth: 100, sortable: true, slots: { default: 'handleStatus' } },
      { field: 'isTimeout', title: '超时提醒', minWidth: 100, sortable: true, formatter: ({ cellValue }) => (cellValue === '是' ? '超时' : '正常') },
    ],
    质量待核查: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'areaName', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'staffsName', title: '作业人员', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'completeTime', title: '作业完成时间', minWidth: 160, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
      { field: 'checkPhotoUrl', title: '上报照片', minWidth: 100, sortable: true, slots: { default: 'checkPhotoUrl' } },
      { field: 'toolsName', title: '清扫工具', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'reviewStatus', title: '核查状态', minWidth: 100, sortable: true },
      { field: 'reviewByName', title: '核查人员', minWidth: 120, sortable: true },
      { field: 'reviewTime', title: '核查时间', minWidth: 160, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
      { field: 'reformRequire', title: '整改要求', minWidth: 200, sortable: true },
    ],
    已完成: [
      { field: 'planNo', title: '清扫计划编号', minWidth: 160, sortable: true, slots: { default: 'planNo' } },
      { field: 'roadName', title: '清扫路段', minWidth: 150, sortable: true },
      { field: 'areaName', title: '责任区域', minWidth: 180, sortable: true },
      { field: 'completeTime', title: '完成时间', minWidth: 160, sortable: true, formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleString() : '-') },
      { field: 'staffsName', title: '作业人员', minWidth: 150, sortable: true, formatter: ({ cellValue }) => Array.isArray(cellValue) ? cellValue.join(', ') : cellValue },
      { field: 'completionRate', title: '清扫完成率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'qualityRate', title: '质量达标率(%)', minWidth: 120, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'problemHandleRate', title: '问题处置及时率(%)', minWidth: 140, sortable: true, formatter: ({ cellValue }) => (cellValue !== undefined ? `${cellValue}%` : '-') },
      { field: 'statPeriod', title: '统计周期', minWidth: 120, sortable: true },
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
  editText: '编辑清扫计划',
  addText: '新增清扫计划',
  excelName: '道路清扫任务列表',
  excelAllName: '道路清扫任务_区域_日期.xlsx',
  total: '道路清扫任务总数10;清扫待执行2;作业进行中2;问题待处置2;质量待核查2;已完成2',
};
