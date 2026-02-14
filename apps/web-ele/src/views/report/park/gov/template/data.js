// data.js
/** 数据上报模板配置 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "template_id": "TMP001",
      "template_name": "市级停车场运营日报",
      "report_type": "运营统计",
      "apply_scope": "平台级",
      "indicator_ids": [1, 2, 3, 4],
      "filter_condition": "statDate=today;areaLevel=市级",
      "display_style": "表格",
      "config_content": "包含入场车流、营收、订单、利用率四个维度",
      "status": "启用",
      "creator": "张管理员",
      "create_time": "2026-02-05 10:30",
      "update_time": "2026-02-05 18:30"
    },
    {
      "id": 2,
      "template_id": "TMP002",
      "template_name": "区域停车设施统计月报",
      "report_type": "设施统计",
      "apply_scope": "区域级",
      "indicator_ids": [2, 5, 6, 7],
      "filter_condition": "timeRange=month;reportLevel=region",
      "display_style": "图表",
      "config_content": "车位总数、空闲率、周转率统计",
      "status": "启用",
      "creator": "李运维",
      "create_time": "2026-02-04 14:20",
      "update_time": "2026-02-04 16:45"
    },
    {
      "id": 3,
      "template_id": "TMP003",
      "template_name": "政务停车场监管日报",
      "report_type": "监管统计",
      "apply_scope": "政务级",
      "indicator_ids": [1, 3, 8, 9],
      "filter_condition": "merchantType=政府;status=运营中",
      "display_style": "表格",
      "config_content": "合规率、投诉率、事故统计",
      "status": "启用",
      "creator": "王监管",
      "create_time": "2026-02-03 09:15",
      "update_time": "2026-02-05 11:20"
    },
    {
      "id": 4,
      "template_id": "TMP004",
      "template_name": "节假日停车预测报告",
      "report_type": "预测分析",
      "apply_scope": "平台级",
      "indicator_ids": [10, 11, 12],
      "filter_condition": "isHoliday=true;predictRange=7d",
      "display_style": "图表",
      "config_content": "节假日车流预测、拥堵预警",
      "status": "禁用",
      "creator": "赵分析师",
      "create_time": "2026-02-02 16:40",
      "update_time": "2026-02-05 09:30"
    },
    {
      "id": 5,
      "template_id": "TMP005",
      "template_name": "小区停车场使用周报",
      "report_type": "使用统计",
      "apply_scope": "商户级",
      "indicator_ids": [4, 13, 14],
      "filter_condition": "merchantType=residential;timeRange=week",
      "display_style": "表格",
      "config_content": "业主使用率、访客占比统计",
      "status": "启用",
      "creator": "钱物业",
      "create_time": "2026-02-01 13:25",
      "update_time": "2026-02-05 15:10"
    },
    {
      "id": 6,
      "template_id": "TMP006",
      "template_name": "商业中心停车月报",
      "report_type": "运营统计",
      "apply_scope": "商户级",
      "indicator_ids": [1, 2, 3, 15],
      "filter_condition": "merchantType=commercial;timeRange=month",
      "display_style": "图表",
      "config_content": "消费关联分析、高峰时段统计",
      "status": "启用",
      "creator": "孙经理",
      "create_time": "2026-01-31 11:10",
      "update_time": "2026-02-04 14:35"
    },
    {
      "id": 7,
      "template_id": "TMP007",
      "template_name": "路边停车收费日报",
      "report_type": "收费统计",
      "apply_scope": "区域级",
      "indicator_ids": [16, 17, 18],
      "filter_condition": "parkingType=roadside;collectMethod=电子收费",
      "display_style": "表格",
      "config_content": "收费率、欠费统计、巡检记录",
      "status": "启用",
      "creator": "周收费员",
      "create_time": "2026-01-30 08:45",
      "update_time": "2026-02-05 10:15"
    },
    {
      "id": 8,
      "template_id": "TMP008",
      "template_name": "景区停车场节假日报告",
      "report_type": "专题统计",
      "apply_scope": "商户级",
      "indicator_ids": [19, 20, 21],
      "filter_condition": "merchantType=scenic;timeRange=holiday",
      "display_style": "图表",
      "config_content": "节假日高峰分析、承载力评估",
      "status": "禁用",
      "creator": "吴景区管理",
      "create_time": "2026-01-29 15:30",
      "update_time": "2026-02-03 09:45"
    },
    {
      "id": 9,
      "template_id": "TMP009",
      "template_name": "医院停车场服务报告",
      "report_type": "服务统计",
      "apply_scope": "商户级",
      "indicator_ids": [22, 23, 24],
      "filter_condition": "merchantType=hospital;specialType=emergency",
      "display_style": "表格",
      "config_content": "急救车位使用、等候时间统计",
      "status": "启用",
      "creator": "郑医院管理",
      "create_time": "2026-01-28 10:20",
      "update_time": "2026-02-05 13:40"
    },
    {
      "id": 10,
      "template_id": "TMP010",
      "template_name": "学校周边停车分析",
      "report_type": "分析报告",
      "apply_scope": "区域级",
      "indicator_ids": [25, 26, 27],
      "filter_condition": "aroundType=school;timeRange=semester",
      "display_style": "图表",
      "config_content": "上下学高峰分析、停车需求预测",
      "status": "启用",
      "creator": "王教育局",
      "create_time": "2026-01-27 14:15",
      "update_time": "2026-02-04 16:25"
    }
  ];
};

/** 获取最大ID */
export function getMaxId() {
  const list = dataList();
  return list.length > 0 ? Math.max(...list.map(item => item.id)) : 0;
}

/** 获取最大模板ID号 */
export function getMaxTemplateId() {
  const list = dataList();
  const templateIds = list.map(item => {
    const num = item.template_id?.replace('TMP', '') || '0';
    return parseInt(num, 10);
  });
  return Math.max(...templateIds, 0);
}

/** 指标字典数据 */
export const indicatorList = () => {
  return [
    { id: 1, label: '入场车流量', value: 'totalEntry' },
    { id: 2, label: '营收总额', value: 'totalIncome' },
    { id: 3, label: '订单数', value: 'orderCount' },
    { id: 4, label: '平均利用率', value: 'avgUtilization' },
    { id: 5, label: '车位总数', value: 'totalSpaces' },
    { id: 6, label: '空闲车位', value: 'freeSpaces' },
    { id: 7, label: '车位周转率', value: 'turnoverRate' },
    { id: 8, label: '合规率', value: 'complianceRate' },
    { id: 9, label: '投诉数量', value: 'complaintCount' },
    { id: 10, label: '预测车流量', value: 'predictedEntry' },
    { id: 11, label: '预测营收', value: 'predictedIncome' },
    { id: 12, label: '拥堵指数', value: 'congestionIndex' },
    { id: 13, label: '业主使用率', value: 'ownerUsageRate' },
    { id: 14, label: '访客占比', value: 'visitorRatio' },
    { id: 15, label: '消费关联率', value: 'consumptionLinkRate' },
    { id: 16, label: '收费率', value: 'collectionRate' },
    { id: 17, label: '欠费金额', value: 'arrearsAmount' },
    { id: 18, label: '巡检次数', value: 'inspectionCount' },
    { id: 19, label: '高峰时段车流', value: 'peakTraffic' },
    { id: 20, label: '承载力评估', value: 'capacityAssessment' },
    { id: 21, label: '游客满意度', value: 'visitorSatisfaction' },
    { id: 22, label: '急救车位使用', value: 'emergencySpaceUsage' },
    { id: 23, label: '平均等候时间', value: 'avgWaitTime' },
    { id: 24, label: '医疗服务关联', value: 'medicalServiceLink' },
    { id: 25, label: '上下学高峰', value: 'schoolPeakHours' },
    { id: 26, label: '停车需求指数', value: 'parkingDemandIndex' },
    { id: 27, label: '安全评估', value: 'safetyAssessment' }
  ];
};

/** 搜索表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'template_name',
      label: '模板名称',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入模板名称',
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '运营统计', value: '运营统计' },
          { label: '设施统计', value: '设施统计' },
          { label: '监管统计', value: '监管统计' },
          { label: '预测分析', value: '预测分析' },
          { label: '使用统计', value: '使用统计' },
          { label: '收费统计', value: '收费统计' },
          { label: '专题统计', value: '专题统计' },
          { label: '服务统计', value: '服务统计' },
          { label: '分析报告', value: '分析报告' },
        ],
        placeholder: '请选择报表类型',
        showSearch: true,
      },
      fieldName: 'report_type',
      label: '报表类型',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '平台级', value: '平台级' },
          { label: '区域级', value: '区域级' },
          { label: '商户级', value: '商户级' },
          { label: '政务级', value: '政务级' },
        ],
        placeholder: '请选择适用范围',
        showSearch: true,
      },
      fieldName: 'apply_scope',
      label: '适用范围',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
        ],
        placeholder: '请选择状态',
        showSearch: true,
      },
      fieldName: 'status',
      label: '状态',
    },
  ];
}

/** 表格字段配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'template_id',
      title: '模板ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'template_id' },
    },
    {
      field: 'template_name',
      title: '模板名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'template_name' },
    },
    {
      field: 'report_type',
      title: '报表类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'report_type' },
    },
    {
      field: 'apply_scope',
      title: '适用范围',
      minWidth: 100,
      sortable: true,
      slots: { default: 'apply_scope' },
    },
    {
      field: 'config_content',
      title: '配置详情预览',
      minWidth: 180,
      sortable: false,
      slots: { default: 'config_content' },
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 80,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 140,
      sortable: true,
      slots: { default: 'create_time' },
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '编辑报表',
  addText: '生成报表',
  excelName: '政务报表生成记录',
  excelAllName: '政务报表生成记录.xlsx',
  pdfName: '政务报表',
  total: '报表总数: 10; 今日生成: 3; 待上报: 2;',
  generateConfirm: '确定要基于当前筛选条件生成政务报表吗？',
  uploadConfirm: '确定要将此报表上报到政务系统吗？',
  exportConfirm: '请选择导出格式',
  exportSuccess: '导出成功',
  exportFailed: '导出失败',
  noDataExport: '没有可导出的数据',
  generatingReport: '正在生成报表...',
  uploadingReport: '正在上报报表...',
  exportReport: '正在导出报表...'
};
