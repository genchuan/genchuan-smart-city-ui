
/** 获取报表周期Tag类型（用于表格状态色） */
export function getReportPeriodTagType(period) {
  const map = {
    日报: 'info',
    周报: 'success',
    月报: 'primary',
    季报: 'warning',
    半年报: 'danger',
    年报: 'danger',
    自定义报表: 'info',
  };
  return map[period] || 'info';
}

/** 获取生成状态Tag类型 */
export function getGenerateStatusTagType(status) {
  const map = {
    已生成: 'success',
    生成中: 'warning',
    生成失败: 'danger',
    未生成: 'info',
  };
  return map[status] || 'info';
}

// ==================== 生成报表表单配置（右侧抽屉） ====================
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'statisticalPeriod',
      label: '统计时段',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
      },
      rules: 'required',
    },
    {
      fieldName: 'reportPeriod',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        options: [
          { label: '日报', value: '日报' },
          { label: '周报', value: '周报' },
          { label: '月报', value: '月报' },
          { label: '季报', value: '季报' },
          { label: '半年报', value: '半年报' },
          { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'campus',
      label: '校区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择校区',
        options: [], // 动态从接口获取校区列表
        filterable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'grade',
      label: '年级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择年级',
        options: [], // 动态获取年级列表
        filterable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'majorName',
      label: '专业名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择专业（可选）',
        options: [], // 动态获取
        filterable: true,
        clearable: true,
      },
    },
    {
      fieldName: 'className',
      label: '班级名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择班级（可选）',
        options: [], // 动态获取
        filterable: true,
        clearable: true,
      },
    },
  ];
}

// ==================== 列表页搜索表单配置 ====================
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'reportPeriod',
      label: '报表周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表周期',
        options: [
          { label: '日报', value: '日报' },
          { label: '周报', value: '周报' },
          { label: '月报', value: '月报' },
          { label: '季报', value: '季报' },
          { label: '半年报', value: '半年报' },
          { label: '年报', value: '年报' },
          { label: '自定义报表', value: '自定义报表' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'statisticalPeriod',
      label: '统计时段',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        placeholder: ['开始时间', '结束时间'],
        clearable: true,
      },
    },
    {
      fieldName: 'className',
      label: '班级名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入班级名称',
        clearable: true,
      },
    },
    {
      fieldName: 'majorName',
      label: '专业名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入专业名称',
        clearable: true,
      },
    },
    {
      fieldName: 'grade',
      label: '年级',
      component: 'Select',
      componentProps: {
        placeholder: '请选择年级',
        options: [], // 动态获取年级列表
        clearable: true,
      },
    },
    {
      fieldName: 'campus',
      label: '校区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择校区',
        options: [], // 动态获取校区列表
        clearable: true,
      },
    },
    {
      fieldName: 'generateStatus',
      label: '生成状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择生成状态',
        options: [
          { label: '未生成', value: '未生成' },
          { label: '生成中', value: '生成中' },
          { label: '已生成', value: '已生成' },
          { label: '生成失败', value: '生成失败' },
        ],
        clearable: true,
      },
    },
  ];
}

// ==================== 表格列配置 ====================
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'reportPeriod',
      title: '报表周期',
      minWidth: 120,
      sortable: true,
      slots: { default: 'reportPeriod' },
    },
    {
      field: 'statisticalPeriod',
      title: '统计时段',
      minWidth: 280,
      sortable: true,
    },
    {
      field: 'className',
      title: '班级名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'className' }, // 支持钻取筛选
    },
    {
      field: 'majorName',
      title: '专业名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'majorName' },
    },
    {
      field: 'grade',
      title: '年级',
      minWidth: 100,
      sortable: true,
      slots: { default: 'grade' },
    },
    {
      field: 'campus',
      title: '校区',
      minWidth: 120,
      sortable: true,
      slots: { default: 'campus' },
    },
    {
      field: 'totalAssessScore',
      title: '四项考评总分',
      minWidth: 130,
      sortable: true,
      slots: { default: 'totalAssessScore' }, // 点击跳转班级考评明细弹窗
    },
    {
      field: 'healthScore',
      title: '卫生得分',
      minWidth: 100,
      sortable: true,
      slots: { default: 'healthScore' }, // 点击查看卫生考评明细
    },
    {
      field: 'morningExerciseScore',
      title: '早操得分',
      minWidth: 100,
      sortable: true,
      slots: { default: 'morningExerciseScore' },
    },
    {
      field: 'civilizedClassScore',
      title: '文明班级得分',
      minWidth: 130,
      sortable: true,
      slots: { default: 'civilizedClassScore' },
    },
    {
      field: 'blackboardNewsScore',
      title: '黑板报得分',
      minWidth: 120,
      sortable: true,
      slots: { default: 'blackboardNewsScore' },
    },
    {
      field: 'assessRank',
      title: '考评排名',
      minWidth: 100,
      sortable: true,
      slots: { default: 'assessRank' }, // 点击筛选同排名班级
    },
    {
      field: 'generateStatus',
      title: '生成状态',
      minWidth: 110,
      sortable: true,
      slots: { default: 'generateStatus' },
    },
    {
      field: 'generateTime',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'operator',
      title: '操作人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'operator' }, // 点击查看操作人信息弹窗
    },
    {
      field: 'exportCount',
      title: '导出次数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'dataUpdateTime',
      title: '数据更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' }, // 查看、导出按钮
    },
  ];
}

// ==================== 详情抽屉字段配置 ====================
export const detailFields = [
  { key: 'reportPeriod', label: '报表周期' },
  { key: 'statisticalPeriod', label: '统计时段' },
  { key: 'className', label: '班级名称' },
  { key: 'majorName', label: '专业名称' },
  { key: 'grade', label: '年级' },
  { key: 'campus', label: '校区' },
  { key: 'totalAssessScore', label: '四项考评总分' },
  { key: 'healthScore', label: '卫生得分' },
  { key: 'morningExerciseScore', label: '早操得分' },
  { key: 'civilizedClassScore', label: '文明班级得分' },
  { key: 'blackboardNewsScore', label: '黑板报得分' },
  { key: 'assessRank', label: '考评排名' },
  { key: 'generateStatus', label: '生成状态' },
  { key: 'generateTime', label: '生成时间' },
  { key: 'operator', label: '操作人' },
  { key: 'exportCount', label: '导出次数' },
  { key: 'dataUpdateTime', label: '数据更新时间' },
  { key: 'creator', label: '创建者' },
  // { key: 'createTime', label: '创建时间' },
  // { key: 'updateTime', label: '更新时间' },
];
