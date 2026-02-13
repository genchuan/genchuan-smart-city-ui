// data.js
/** 政务报表生成 - 初始数据 */
export const dataList = () => {
  return [
    {
      "id": 1,
      "report_no": "REP20260205001",
      "template_name": "市级停车场运营日报",
      "area_name": "天河区",
      "area_code": "440106",
      "stat_period": "日",
      "start_date": "2026-02-05",
      "end_date": "2026-02-05",
      "data_content": {
        "total_entry": 1250,
        "total_income": 28750.50,
        "order_count": 1245,
        "avg_utilization": "78.5%",
        "peak_hours": ["08:00-10:00", "17:00-19:00"],
        "complaint_count": 3
      },
      "report_status": "已生成",
      "upload_status": "未上报",
      "generate_time": "2026-02-05 18:30",
      "operator": "张管理员"
    },
    {
      "id": 2,
      "report_no": "REP20260204001",
      "template_name": "区域停车设施统计月报",
      "area_name": "越秀区",
      "area_code": "440104",
      "stat_period": "月",
      "start_date": "2026-02-01",
      "end_date": "2026-02-04",
      "data_content": {
        "total_spaces": 1560,
        "free_spaces": 285,
        "turnover_rate": "4.2",
        "avg_utilization": "81.7%",
        "maintenance_count": 12
      },
      "report_status": "已生成",
      "upload_status": "已上报",
      "generate_time": "2026-02-04 16:45",
      "operator": "李运维"
    },
    {
      "id": 3,
      "report_no": "REP20260205002",
      "template_name": "政务停车场监管日报",
      "area_name": "海珠区",
      "area_code": "440105",
      "stat_period": "日",
      "start_date": "2026-02-05",
      "end_date": "2026-02-05",
      "data_content": {
        "compliance_rate": "98.2%",
        "complaint_count": 5,
        "accident_count": 1,
        "inspection_completed": 45,
        "inspection_rate": "100%"
      },
      "report_status": "已生成",
      "upload_status": "待上报",
      "generate_time": "2026-02-05 11:20",
      "operator": "王监管"
    },
    {
      "id": 4,
      "report_no": "REP20260205003",
      "template_name": "节假日停车预测报告",
      "area_name": "全市",
      "area_code": "440100",
      "stat_period": "周",
      "start_date": "2026-02-10",
      "end_date": "2026-02-16",
      "data_content": {
        "predicted_entry": 8500,
        "predicted_income": 215000,
        "congestion_index": 6.8,
        "peak_days": ["2026-02-12", "2026-02-15"],
        "recommendations": ["增加临时车位", "延长营业时间"]
      },
      "report_status": "已生成",
      "upload_status": "未上报",
      "generate_time": "2026-02-05 09:30",
      "operator": "赵分析师"
    },
    {
      "id": 5,
      "report_no": "REP20260204002",
      "template_name": "小区停车场使用周报",
      "area_name": "白云区",
      "area_code": "440111",
      "stat_period": "周",
      "start_date": "2026-01-29",
      "end_date": "2026-02-04",
      "data_content": {
        "owner_usage_rate": "72.3%",
        "visitor_ratio": "27.7%",
        "avg_duration": "8.5小时",
        "complaint_count": 8,
        "satisfaction_rate": "92.5%"
      },
      "report_status": "已生成",
      "upload_status": "已上报",
      "generate_time": "2026-02-05 15:10",
      "operator": "钱物业"
    },
    {
      "id": 6,
      "report_no": "REP20260131001",
      "template_name": "商业中心停车月报",
      "area_name": "天河区",
      "area_code": "440106",
      "stat_period": "月",
      "start_date": "2026-01-01",
      "end_date": "2026-01-31",
      "data_content": {
        "total_entry": 32500,
        "total_income": 782500,
        "consumption_link_rate": "65.8%",
        "avg_utilization": "76.4%",
        "peak_hours": ["11:00-13:00", "18:00-20:00"]
      },
      "report_status": "已生成",
      "upload_status": "已上报",
      "generate_time": "2026-02-04 14:35",
      "operator": "孙经理"
    },
    {
      "id": 7,
      "report_no": "REP20260203001",
      "template_name": "路边停车收费日报",
      "area_name": "荔湾区",
      "area_code": "440103",
      "stat_period": "日",
      "start_date": "2026-02-03",
      "end_date": "2026-02-03",
      "data_content": {
        "collection_rate": "94.7%",
        "arrears_amount": 1285.50,
        "inspection_count": 156,
        "electronic_rate": "98.2%",
        "violation_count": 23
      },
      "report_status": "已生成",
      "upload_status": "已上报",
      "generate_time": "2026-02-05 10:15",
      "operator": "周收费员"
    },
    {
      "id": 8,
      "report_no": "REP20260202001",
      "template_name": "景区停车场节假日报告",
      "area_name": "从化区",
      "area_code": "440117",
      "stat_period": "季度",
      "start_date": "2026-01-01",
      "end_date": "2026-03-31",
      "data_content": {
        "peak_traffic": 4200,
        "capacity_assessment": "饱和",
        "visitor_satisfaction": "88.3%",
        "recommendations": ["增加临时车位", "优化引导标识"]
      },
      "report_status": "生成中",
      "upload_status": "未上报",
      "generate_time": "2026-02-03 09:45",
      "operator": "吴景区管理"
    },
    {
      "id": 9,
      "report_no": "REP20260201001",
      "template_name": "医院停车场服务报告",
      "area_name": "黄埔区",
      "area_code": "440112",
      "stat_period": "周",
      "start_date": "2026-01-26",
      "end_date": "2026-02-01",
      "data_content": {
        "emergency_space_usage": "92.8%",
        "avg_wait_time": "15分钟",
        "medical_service_link": "84.6%",
        "special_rate": "100%",
        "satisfaction_rate": "95.2%"
      },
      "report_status": "已生成",
      "upload_status": "已上报",
      "generate_time": "2026-02-05 13:40",
      "operator": "郑医院管理"
    },
    {
      "id": 10,
      "report_no": "REP20260127001",
      "template_name": "学校周边停车分析",
      "area_name": "番禺区",
      "area_code": "440113",
      "stat_period": "学期",
      "start_date": "2026-02-01",
      "end_date": "2026-07-31",
      "data_content": {
        "school_peak_hours": ["07:00-08:00", "16:00-17:30"],
        "parking_demand_index": 8.2,
        "safety_assessment": "良好",
        "recommendations": ["设置临时停车区", "加强交通疏导"]
      },
      "report_status": "已生成",
      "upload_status": "已上报",
      "generate_time": "2026-02-04 16:25",
      "operator": "王教育局"
    }
  ];
};

/** 模板选择数据 */
export const templateList = () => {
  return [
    { label: '市级停车场运营日报', value: '市级停车场运营日报' },
    { label: '区域停车设施统计月报', value: '区域停车设施统计月报' },
    { label: '政务停车场监管日报', value: '政务停车场监管日报' },
    { label: '节假日停车预测报告', value: '节假日停车预测报告' },
    { label: '小区停车场使用周报', value: '小区停车场使用周报' },
    { label: '商业中心停车月报', value: '商业中心停车月报' },
    { label: '路边停车收费日报', value: '路边停车收费日报' },
    { label: '景区停车场节假日报告', value: '景区停车场节假日报告' },
    { label: '医院停车场服务报告', value: '医院停车场服务报告' },
    { label: '学校周边停车分析', value: '学校周边停车分析' }
  ];
};

/** 区域数据 */
export const areaList = () => {
  return [
    { label: '天河区', value: '440106', area_name: '天河区' },
    { label: '越秀区', value: '440104', area_name: '越秀区' },
    { label: '海珠区', value: '440105', area_name: '海珠区' },
    { label: '白云区', value: '440111', area_name: '白云区' },
    { label: '黄埔区', value: '440112', area_name: '黄埔区' },
    { label: '荔湾区', value: '440103', area_name: '荔湾区' },
    { label: '番禺区', value: '440113', area_name: '番禺区' },
    { label: '南沙区', value: '440115', area_name: '南沙区' },
    { label: '从化区', value: '440117', area_name: '从化区' },
    { label: '全市', value: '440100', area_name: '全市' }
  ];
};

/** 获取最大ID */
export function getMaxId() {
  const list = dataList();
  return list.length > 0 ? Math.max(...list.map(item => item.id)) : 0;
}

/** 生成新的报表编号 */
export function generateReportNo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const list = dataList();
  const todayReports = list.filter(item =>
    item.report_no.startsWith(`REP${year}${month}${day}`)
  );
  const nextNum = todayReports.length + 1;
  return `REP${year}${month}${day}${String(nextNum).padStart(3, '0')}`;
}

/** 搜索表单配置 */
export function useFormSchema() {
  return [
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: templateList(),
        placeholder: '请选择目标模板',
        showSearch: true,
      },
      fieldName: 'template_name',
      label: '模板选择',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: areaList().map(item => ({
          label: item.label,
          value: item.value
        })),
        placeholder: '请选择行政区域',
        showSearch: true,
      },
      fieldName: 'area_code',
      label: '行政区域',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '日', value: '日' },
          { label: '周', value: '周' },
          { label: '月', value: '月' },
          { label: '季度', value: '季度' },
          { label: '学期', value: '学期' },
        ],
        placeholder: '请选择统计周期',
        showSearch: true,
      },
      fieldName: 'stat_period',
      label: '统计周期',
    },
    {
      fieldName: 'time_range',
      label: '时间范围',
      component: 'DatePicker',
      labelWidth: '100',
      componentProps: {
        type: 'daterange',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '已生成', value: '已生成' },
          { label: '生成中', value: '生成中' },
          { label: '生成失败', value: '生成失败' },
        ],
        placeholder: '请选择报表状态',
        showSearch: true,
      },
      fieldName: 'report_status',
      label: '报表状态',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未上报', value: '未上报' },
          { label: '待上报', value: '待上报' },
          { label: '已上报', value: '已上报' },
        ],
        placeholder: '请选择上报状态',
        showSearch: true,
      },
      fieldName: 'upload_status',
      label: '上报状态',
    },
  ];
}

/** 表格字段配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'report_no',
      title: '报表编号',
      minWidth: 140,
      sortable: true,
      slots: { default: 'report_no' },
    },
    {
      field: 'template_name',
      title: '模板名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'template_name' },
    },
    {
      field: 'area_name',
      title: '区域名称',
      minWidth: 100,
      sortable: true,
      slots: { default: 'area_name' },
    },
    {
      field: 'stat_period',
      title: '统计周期',
      minWidth: 90,
      sortable: true,
      slots: { default: 'stat_period' },
    },
    {
      field: 'time_range',
      title: '时间范围',
      minWidth: 180,
      sortable: false,
      slots: { default: 'time_range' },
    },
    {
      field: 'report_status',
      title: '报表状态',
      minWidth: 90,
      sortable: true,
      slots: { default: 'report_status' },
    },
    {
      field: 'upload_status',
      title: '上报状态',
      minWidth: 90,
      sortable: true,
      slots: { default: 'upload_status' },
    },
    {
      field: 'generate_time',
      title: '生成时间',
      minWidth: 140,
      sortable: true,
      slots: { default: 'generate_time' },
    },
    {
      title: '操作',
      width: 240,
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
};
