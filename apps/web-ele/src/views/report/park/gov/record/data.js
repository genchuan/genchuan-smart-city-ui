// data.js
/** 政务上报记录管理 - 模拟数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      uploadId: 'UP202602050001',
      reportNo: 'RPT20260205001',
      templateName: '停车场日运营报表',
      areaCode: '440106',
      areaName: '天河区',
      uploadTime: '2026-02-05 14:23:10',
      uploadStatus: '已上报',
      rejectReason: null,
      userName: '张三',
    },
    {
      id: 2,
      uploadId: 'UP202602050002',
      reportNo: 'RPT20260205002',
      templateName: '停车场日运营报表',
      areaCode: '440104',
      areaName: '越秀区',
      uploadTime: '2026-02-05 15:47:22',
      uploadStatus: '已驳回',
      rejectReason: '营收数据异常，请核对',
      userName: '李四',
    },
    {
      id: 3,
      uploadId: 'UP202602050003',
      reportNo: 'RPT20260205003',
      templateName: '车流高峰分析表',
      areaCode: '440105',
      areaName: '海珠区',
      uploadTime: '2026-02-05 09:12:05',
      uploadStatus: '审核通过',
      rejectReason: null,
      userName: '王五',
    },
    {
      id: 4,
      uploadId: 'UP202602040001',
      reportNo: 'RPT20260204001',
      templateName: '停车场日运营报表',
      areaCode: '440111',
      areaName: '白云区',
      uploadTime: '2026-02-04 11:03:34',
      uploadStatus: '待上报',
      rejectReason: null,
      userName: '赵六',
    },
    {
      id: 5,
      uploadId: 'UP202602040002',
      reportNo: 'RPT20260204002',
      templateName: '车流高峰分析表',
      areaCode: '440112',
      areaName: '黄埔区',
      uploadTime: '2026-02-04 16:28:19',
      uploadStatus: '已上报',
      rejectReason: null,
      userName: '陈七',
    },
    {
      id: 6,
      uploadId: 'UP202602030001',
      reportNo: 'RPT20260203001',
      templateName: '停车场日运营报表',
      areaCode: '440103',
      areaName: '荔湾区',
      uploadTime: '2026-02-03 10:55:43',
      uploadStatus: '已驳回',
      rejectReason: '上报时间超时',
      userName: '周八',
    },
    {
      id: 7,
      uploadId: 'UP202602030002',
      reportNo: 'RPT20260203002',
      templateName: '车流高峰分析表',
      areaCode: '440113',
      areaName: '番禺区',
      uploadTime: '2026-02-03 13:41:27',
      uploadStatus: '审核通过',
      rejectReason: null,
      userName: '吴九',
    },
  ];
};

/** 获取最大ID */
export function getMaxId() {
  const list = dataList();
  return list.length > 0 ? Math.max(...list.map((item) => item.id)) : 0;
}

/** 筛选弹窗表单配置（全字段筛选） */
export function useFormSchema() {
  return [
    {
      fieldName: 'uploadTimeRange',
      label: '上报时间范围',
      component: 'DatePicker',
      labelWidth: '120',
      componentProps: {
        type: 'daterange',
        placeholder: '开始时间 ~ 结束时间',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
    },
    {
      fieldName: 'templateName',
      label: '模板名称',
      component: 'Input',
      labelWidth: '120',
      componentProps: {
        placeholder: '请输入模板名称',
      },
    },
    {
      fieldName: 'areaCode',
      label: '行政区域',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '天河区', value: '440106' },
          { label: '越秀区', value: '440104' },
          { label: '海珠区', value: '440105' },
          { label: '白云区', value: '440111' },
          { label: '黄埔区', value: '440112' },
          { label: '荔湾区', value: '440103' },
          { label: '番禺区', value: '440113' },
          { label: '南沙区', value: '440115' },
          { label: '从化区', value: '440117' },
        ],
        placeholder: '请选择行政区域',
        showSearch: true,
      },
    },
    {
      fieldName: 'uploadStatus',
      label: '上报状态',
      component: 'Select',
      labelWidth: '120',
      componentProps: {
        allowClear: true,
        options: [
          { label: '待上报', value: '待上报' },
          { label: '已上报', value: '已上报' },
          { label: '已驳回', value: '已驳回' },
          { label: '审核通过', value: '审核通过' },
        ],
        placeholder: '请选择上报状态',
      },
    },
  ];
}

/** 表格字段配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'uploadId',
      title: '上报ID',
      minWidth: 150,
      sortable: true,
      slots: { default: 'uploadId' }, // 用于钻取打开详情
    },
    {
      field: 'reportNo',
      title: '报表编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'reportNo' }, // 钻取：查询该编号记录
    },
    {
      field: 'templateName',
      title: '模板名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'templateName' }, // 钻取：筛选该模板
    },
    {
      field: 'areaName',
      title: '区域名称',
      minWidth: 120,
      sortable: true,
      slots: { default: 'areaName' }, // 钻取：筛选该区域
    },
    {
      field: 'uploadTime',
      title: '上报时间',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'uploadStatus',
      title: '上报状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'uploadStatus' }, // 钻取：筛选同状态
    },
    {
      field: 'rejectReason',
      title: '驳回原因',
      minWidth: 180,
      slots: { default: 'rejectReason' }, // 仅驳回状态显示
    },
    {
      field: 'userName',
      title: '上报人',
      minWidth: 120,
      sortable: true,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  resubmitText: '重新上报',
  excelName: '政务上报记录',
  excelAllName: '政务上报记录.xlsx',
  total: '上报总数: 7; 今日上报: 3; 待处理: 1;',
};
