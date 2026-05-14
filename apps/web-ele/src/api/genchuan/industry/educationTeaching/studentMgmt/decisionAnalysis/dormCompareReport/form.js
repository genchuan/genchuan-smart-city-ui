
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
        options: [], // 动态获取校区列表
        filterable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'buildingName',
      label: '楼栋名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择楼栋',
        options: [], // 动态获取楼栋列表
        filterable: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'className',
      label: '班级名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择班级（可选）',
        options: [], // 动态获取班级列表
        filterable: true,
        clearable: true,
      },
    },
    {
      fieldName: 'dormNo',
      label: '宿舍号',
      component: 'Select',
      componentProps: {
        placeholder: '请选择宿舍号（可选）',
        options: [], // 动态获取宿舍号列表
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
      fieldName: 'dormNo',
      label: '宿舍号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入宿舍号',
        clearable: true,
      },
    },
    {
      fieldName: 'buildingName',
      label: '楼栋名称',
      component: 'Select',
      componentProps: {
        placeholder: '请选择楼栋',
        options: [], // 动态获取楼栋列表
        clearable: true,
      },
    },
    {
      fieldName: 'floor',
      label: '楼层',
      component: 'Select',
      componentProps: {
        placeholder: '请选择楼层',
        options: [], // 动态获取楼层列表
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
      fieldName: 'civilizedDormTitle',
      label: '文明宿舍称号',
      component: 'Select',
      componentProps: {
        placeholder: '请选择称号',
        options: [
          { label: '文明宿舍', value: '文明宿舍' },
          { label: '优秀宿舍', value: '优秀宿舍' },
          { label: '示范宿舍', value: '示范宿舍' },
        ],
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
      field: 'dormNo',
      title: '宿舍号',
      minWidth: 100,
      sortable: true,
      slots: { default: 'dormNo' },
    },
    {
      field: 'buildingName',
      title: '楼栋名称',
      minWidth: 120,
      sortable: true,
      slots: { default: 'buildingName' },
    },
    {
      field: 'floor',
      title: '楼层',
      minWidth: 80,
      sortable: true,
      slots: { default: 'floor' },
    },
    {
      field: 'className',
      title: '班级名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'className' },
    },
    {
      field: 'majorName',
      title: '专业名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'majorName' },
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
      title: '评比总分',
      minWidth: 110,
      sortable: true,
      slots: { default: 'totalAssessScore' },
    },
    {
      field: 'healthScore',
      title: '卫生得分',
      minWidth: 100,
      sortable: true,
      slots: { default: 'healthScore' },
    },
    {
      field: 'disciplineScore',
      title: '纪律得分',
      minWidth: 100,
      sortable: true,
      slots: { default: 'disciplineScore' },
    },
    {
      field: 'civilizedDormTitle',
      title: '文明宿舍称号',
      minWidth: 140,
      sortable: true,
      slots: { default: 'civilizedDormTitle' },
    },
    {
      field: 'assessRank',
      title: '评比排名',
      minWidth: 100,
      sortable: true,
      slots: { default: 'assessRank' },
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
      slots: { default: 'operator' },
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
      slots: { default: 'actions' },
    },
  ];
}

// ==================== 详情抽屉字段配置 ====================
export const detailFields = [
  { key: 'reportPeriod', label: '报表周期' },
  { key: 'statisticalPeriod', label: '统计时段' },
  { key: 'dormNo', label: '宿舍号' },
  { key: 'buildingName', label: '楼栋名称' },
  { key: 'floor', label: '楼层' },
  { key: 'className', label: '班级名称' },
  { key: 'majorName', label: '专业名称' },
  { key: 'campus', label: '校区' },
  { key: 'totalAssessScore', label: '评比总分' },
  { key: 'healthScore', label: '卫生得分' },
  { key: 'disciplineScore', label: '纪律得分' },
  { key: 'civilizedDormTitle', label: '文明宿舍称号' },
  { key: 'assessRank', label: '评比排名' },
  { key: 'generateStatus', label: '生成状态' },
  { key: 'generateTime', label: '生成时间' },
  { key: 'operator', label: '操作人' },
  { key: 'exportCount', label: '导出次数' },
  { key: 'dataUpdateTime', label: '数据更新时间' },
  { key: 'creator', label: '创建者' },
  // { key: 'createTime', label: '创建时间' },
  // { key: 'updateTime', label: '更新时间' },
];
