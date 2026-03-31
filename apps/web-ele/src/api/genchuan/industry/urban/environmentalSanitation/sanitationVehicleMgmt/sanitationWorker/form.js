import { requestClient } from '#/api/request';

// ========== options 接口 ==========

export function getTeamOptions() {
  return requestClient.get('/envirhealth/team/options');
}

export function getAreaOptions() {
  return requestClient.get('/envirhealth/area/options');
}

export function getDeptOptions() {
  return requestClient.get('/envirhealth/dept/options');
}

export function getJobTypeOptions() {
  return requestClient.get('/envirhealth/job-type/options');
}

export function getPersonStatusOptions() {
  return requestClient.get('/envirhealth/person-status/options');
}

// ========== 原有新增/编辑表单 schema（用于非“全部”标签页，字段名基于模拟数据） ==========
export function useFormSchema() {
  return [
    {
      fieldName: 'toiletName',
      label: '人员姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入人员姓名' },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'location',
      label: '岗位类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择岗位类型',
        options: [
          { label: '保洁员', value: '保洁员' },
          { label: '清运工', value: '清运工' },
          { label: '巡查员', value: '巡查员' },
          { label: '管理员', value: '管理员' },
        ],
      },
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
      fieldName: 'openHours',
      label: '入职时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入职时间',
        type: 'date',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'stallCount',
      label: '累计考勤天数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入天数', min: 0 },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '人员状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择人员状态',
        options: [
          { label: '在岗', value: '在岗' },
          { label: '休假', value: '休假' },
          { label: '离岗', value: '离岗' },
        ],
      },
      labelWidth: '120',
      rules: 'required',
    },
    {
      fieldName: 'phone',
      label: '联系方式',
      component: 'Input',
      componentProps: { placeholder: '请输入手机号码' },
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
export function useUserEditSchema() {
  return [
    {
      fieldName: 'userId',
      label: '人员编号',
      component: 'Input',
      componentProps: { placeholder: '请输入人员编号（如：uuid-user-001）' },
    },
    {
      fieldName: 'userName',
      label: '人员姓名',
      component: 'Input',
      componentProps: { placeholder: '请输入人员姓名' },
    },
    {
      fieldName: 'jobTypeId',
      label: '岗位类型',
      component: 'Select',
      componentProps: { placeholder: '请选择岗位类型', options: [] },
    },
    {
      fieldName: 'teamId',
      label: '所属班组',
      component: 'Select',
      componentProps: { placeholder: '请选择班组', options: [] },
    },
    {
      fieldName: 'areaCode',
      label: '负责区域',
      component: 'Select',
      componentProps: { placeholder: '请选择区域', options: [] },
    },
    {
      fieldName: 'phone',
      label: '联系方式',
      component: 'Input',
      componentProps: { placeholder: '请输入手机号码' },
    },
    {
      fieldName: 'entryTime',
      label: '入职时间',
      component: 'DatePicker',
      componentProps: { type: 'date', valueFormat: 'x', placeholder: '选择日期' },
    },
    {
      fieldName: 'personStatusId',
      label: '人员状态',
      component: 'Select',
      componentProps: { placeholder: '请选择人员状态', options: [] },
    },
  ];
}

// ========== 新增：搜索表单 schema（用于“全部”标签页） ==========
export function useUserSearchSchema() {
  return [
    {
      fieldName: 'jobTypeId',
      label: '岗位类型',
      component: 'Select',
      componentProps: { placeholder: '请选择岗位类型', options: [], clearable: true },
    },
    {
      fieldName: 'teamId',
      label: '所属班组',
      component: 'Select',
      componentProps: { placeholder: '请选择班组', options: [], clearable: true },
    },
    {
      fieldName: 'areaCode',
      label: '负责区域',
      component: 'Select',
      componentProps: { placeholder: '请选择区域', options: [], clearable: true },
    },
    {
      fieldName: 'personStatusId',
      label: '人员状态',
      component: 'Select',
      componentProps: { placeholder: '请选择状态', options: [], clearable: true },
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
      { field: 'userName', title: '人员姓名', minWidth: 120, sortable: true, slots: { default: 'userName' } },
      { field: 'jobTypeName', title: '岗位类型', minWidth: 100, slots: { default: 'jobType' } },
      { field: 'teamName', title: '所属班组', minWidth: 120, slots: { default: 'team' } },
      { field: 'areaName', title: '负责区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'phone', title: '联系方式', minWidth: 130 },
      {
        field: 'entryTime',
        title: '入职时间',
        minWidth: 120,
        formatter: ({ cellValue }) => (cellValue ? new Date(cellValue).toLocaleDateString() : '-'),
      },
      { field: 'personStatusName', title: '人员状态', minWidth: 100, slots: { default: 'status' } },
      {
        field: 'totalAttendanceDays',
        title: '累计考勤天数',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? cellValue : '-'),
      },
      {
        field: 'averageScore',
        title: '平均考核得分',
        minWidth: 130,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}分` : '-'),
      },
      {
        field: 'workCompletionRate',
        title: '作业完成率(%)',
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
        field: 'fullAttendanceRate',
        title: '全勤率(%)',
        minWidth: 110,
        formatter: ({ cellValue }) => (cellValue != null ? `${cellValue}%` : '-'),
      },
    ],
    // 以下四个标签页的列配置完全保留原样（基于模拟数据字段）
    待排班: [
      { field: 'toiletName', title: '人员姓名', minWidth: 120, sortable: true, slots: { default: 'toiletName' } },
      { field: 'location', title: '岗位类型', minWidth: 100 },
      { field: 'openHours', title: '所属班组', minWidth: 120 },
      { field: 'area', title: '负责区域', minWidth: 180 },
      { field: 'stallCount', title: '排班周期', minWidth: 100 },
      { field: 'cleaningTime', title: '作业时段', minWidth: 180 },
      { field: 'dispatchStatus', title: '排班状态', minWidth: 100 },
      { field: 'handler', title: '换班申请状态', minWidth: 120 },
      { field: 'swapApplyCount', title: '换班申请数', minWidth: 110 },
      { field: 'createBy', title: '创建人', minWidth: 120 },
      { field: 'createTime', title: '创建时间', minWidth: 180 },
      { field: 'updateTime', title: '更新时间', minWidth: 180 },
      { field: 'isEffective', title: '是否生效', minWidth: 100, formatter: ({ cellValue }) => (cellValue ? '是' : '否') },
    ],
    待考勤: [
      { field: 'toiletName', title: '人员姓名', minWidth: 120, sortable: true, slots: { default: 'toiletName' } },
      { field: 'location', title: '岗位类型', minWidth: 100 },
      { field: 'openHours', title: '所属班组', minWidth: 120 },
      { field: 'stallCount', title: '打卡日期', minWidth: 120 },
      { field: 'cleaningTime', title: '到岗打卡时间', minWidth: 150 },
      { field: 'cleaningContent', title: '离岗打卡时间', minWidth: 150 },
      { field: 'cleaner', title: '打卡状态', minWidth: 100 },
      { field: 'photoUrl', title: '打卡位置', minWidth: 180, slots: { default: 'photoUrl' } },
      { field: 'cleaningRate', title: '考勤时长(小时)', minWidth: 130 },
      { field: 'repairBy', title: '异常类型', minWidth: 120 },
      { field: 'warningCount', title: '异常说明', minWidth: 200 },
      { field: 'repairStatus', title: '审核状态', minWidth: 100 },
    ],
    考核待审核: [
      { field: 'toiletName', title: '人员姓名', minWidth: 120, sortable: true, slots: { default: 'toiletName' } },
      { field: 'location', title: '岗位类型', minWidth: 100 },
      { field: 'openHours', title: '所属班组', minWidth: 120 },
      { field: 'area', title: '负责区域', minWidth: 180 },
      { field: 'stallCount', title: '考核周期', minWidth: 120 },
      { field: 'cleaningRate', title: '考勤得分', minWidth: 100 },
      { field: 'complaintRate', title: '作业质量得分', minWidth: 120 },
      { field: 'warningCount', title: '问题处置得分', minWidth: 120 },
      { field: 'facilityRate', title: '初始总分', minWidth: 100 },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, slots: { default: 'proofUrl' } },
      { field: 'repairBy', title: '考核人员', minWidth: 120 },
      { field: 'reportTime', title: '审核时间', minWidth: 180 },
      { field: 'repairStatus', title: '最终总分', minWidth: 100 },
      { field: 'expectedCompleteTime', title: '考核等级', minWidth: 100 },
      { field: 'damageDesc', title: '考核意见', minWidth: 150 },
      { field: 'teamPassRate', title: '班组考核通过率(%)', minWidth: 160 },
    ],
    已完成: [
      { field: 'taskType', title: '任务类型', minWidth: 100, slots: { default: 'taskType' } },
      { field: 'toiletName', title: '人员姓名', minWidth: 120, slots: { default: 'toiletName' } },
      { field: 'openHours', title: '所属班组', minWidth: 120 },
      { field: 'area', title: '负责区域', minWidth: 180, slots: { default: 'area' } },
      { field: 'completeTime', title: '完成时间', minWidth: 180 },
      { field: 'handler', title: '处置人员', minWidth: 120 },
      { field: 'handleResult', title: '处置结果', minWidth: 120 },
      { field: 'proofUrl', title: '佐证材料', minWidth: 100, slots: { default: 'proofUrl' } },
      { field: 'cleaningRate', title: '班组考勤率(%)', minWidth: 130 },
      { field: 'complaintRate', title: '平均考核分', minWidth: 120 },
      { field: 'warningCount', title: '优秀人员占比(%)', minWidth: 140 },
      { field: 'statPeriod', title: '统计周期', minWidth: 120 },
      { field: 'satisfaction', title: '综合管理评分', minWidth: 130 },
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
  editText: '编辑人员信息',
  addText: '新增人员',
  excelName: '环卫人员管理任务列表',
  excelAllName: '环卫人员管理任务_班组_日期.xlsx',
  total: '人员总数15;待排班3;待考勤3;考核待审核3;已完成3',
};
