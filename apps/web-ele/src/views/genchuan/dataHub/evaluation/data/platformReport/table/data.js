// platform-report/data.js
/** 平台上报数据管理 - 数据字典与模拟数据 */

// 评价任务表模拟（复用现有）
export const evalTaskList = [
  { task_id: 'task01', name: '2025年10月XX区网格管理评价任务' },
  { task_id: 'task02', name: '2025年11月河道水质监测任务' },
  { task_id: 'task03', name: '2025年第四季度设备在线率考核' }
];

// 系统用户表模拟
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' },
  { id: 'u3', name: '王五' }
];

// 上报状态字典表
export const reportStatusList = [
  { id: 'unverified', name: '未校验' },
  { id: 'verified', name: '已校验' },
  { id: 'failed', name: '校验失败' }
];

// 平台上报表模拟数据
let platformReports = [
  {
    report_id: 'rep001',
    batch_no: 'BATCH20250317001',
    task_id: 'task01',
    task_name: '2025年10月XX区网格管理评价任务',
    report_by: 'u1',
    report_by_name: '张三',
    report_time: '2025-03-17 10:30:00',
    file_name: '网格满意度数据.xlsx',
    data_count: 120,
    success_count: 115,
    fail_count: 5,
    status: 'verified',
    check_time: '2025-03-17 10:35:00',
    check_by: 'u2',
    check_by_name: '李四',
    error_file_url: null,
    template_status: '已下载',
    file_preview_url: '可预览',
    reupload_count: 0,
    last_reupload_time: null,
    fail_reason: null
  },
  {
    report_id: 'rep002',
    batch_no: 'BATCH20250316002',
    task_id: 'task02',
    task_name: '2025年11月河道水质监测任务',
    report_by: 'u2',
    report_by_name: '李四',
    report_time: '2025-03-16 14:20:00',
    file_name: '水质监测数据.xlsx',
    data_count: 85,
    success_count: 0,
    fail_count: 85,
    status: 'failed',
    check_time: '2025-03-16 14:30:00',
    check_by: 'u2',
    check_by_name: '李四',
    error_file_url: '/error/rep002_error.xlsx',
    template_status: '已下载',
    file_preview_url: '可预览',
    reupload_count: 1,
    last_reupload_time: '2025-03-17 09:00:00',
    fail_reason: '评价对象ID不存在(45条), 指标项与对象不匹配(40条)'
  },
  {
    report_id: 'rep003',
    batch_no: 'BATCH20250315003',
    task_id: 'task03',
    task_name: '2025年第四季度设备在线率考核',
    report_by: 'u3',
    report_by_name: '王五',
    report_time: '2025-03-15 11:10:00',
    file_name: '设备在线率数据.xlsx',
    data_count: 200,
    success_count: 200,
    fail_count: 0,
    status: 'verified',
    check_time: '2025-03-15 11:20:00',
    check_by: 'u1',
    check_by_name: '张三',
    error_file_url: null,
    template_status: '已下载',
    file_preview_url: '可预览',
    reupload_count: 0,
    last_reupload_time: null,
    fail_reason: null
  },
  {
    report_id: 'rep004',
    batch_no: 'BATCH20250318004',
    task_id: 'task01',
    task_name: '2025年10月XX区网格管理评价任务',
    report_by: 'u1',
    report_by_name: '张三',
    report_time: '2025-03-18 09:15:00',
    file_name: '网格基础数据.xlsx',
    data_count: 150,
    success_count: 0,
    fail_count: 150,
    status: 'unverified',
    check_time: null,
    check_by: null,
    check_by_name: null,
    error_file_url: null,
    template_status: '可下载',
    file_preview_url: '可预览',
    reupload_count: 0,
    last_reupload_time: null,
    fail_reason: null
  }
];

// 获取所有上报记录（模拟API）
export const getAllPlatformReports = () => {
  return platformReports.map(r => ({
    ...r,
    task_name: evalTaskList.find(t => t.task_id === r.task_id)?.name || '',
    report_by_name: userList.find(u => u.id === r.report_by)?.name || '',
    check_by_name: r.check_by ? (userList.find(u => u.id === r.check_by)?.name || '') : null
  }));
};

// 根据条件获取上报记录（用于表格）
export const getPlatformReportsByFilter = (activeTab, searchParams = {}) => {
  let reports = getAllPlatformReports();
  // 按状态筛选
  if (activeTab === '未校验') {
    reports = reports.filter(r => r.status === 'unverified');
  } else if (activeTab === '已校验') {
    reports = reports.filter(r => r.status === 'verified');
  } else if (activeTab === '校验失败') {
    reports = reports.filter(r => r.status === 'failed');
  }

  // 搜索条件过滤
  if (Object.keys(searchParams).length) {
    reports = reports.filter(r => {
      let match = true;
      if (searchParams.task_id && r.task_id !== searchParams.task_id) match = false;
      if (searchParams.report_by && r.report_by !== searchParams.report_by) match = false;
      if (searchParams.status && r.status !== searchParams.status) match = false;
      if (searchParams.start_time && r.report_time < searchParams.start_time) match = false;
      if (searchParams.end_time && r.report_time > searchParams.end_time) match = false;
      if (searchParams.fail_reason && (!r.fail_reason || !r.fail_reason.includes(searchParams.fail_reason))) match = false;
      return match;
    });
  }

  return reports;
};

// 模拟上传校验函数（返回校验结果和错误文件链接）
export const validateUploadFile = (file, taskId) => {
  // 实际应解析文件内容，这里模拟校验逻辑
  return new Promise((resolve) => {
    setTimeout(() => {
      const isPass = Math.random() > 0.3; // 模拟70%通过率
      if (isPass) {
        resolve({
          success: true,
          successCount: 100,
          failCount: 0,
          message: '校验通过'
        });
      } else {
        resolve({
          success: false,
          successCount: 70,
          failCount: 30,
          message: '校验失败',
          errorFileUrl: '/error/sample_error.xlsx',
          failReason: '评价对象ID不存在(20条), 指标项与对象不匹配(10条)'
        });
      }
    }, 1000);
  });
};

// 创建新上报记录
export const createPlatformReport = (data) => {
  const newReport = {
    report_id: `rep${Date.now()}`,
    batch_no: `BATCH${new Date().toISOString().slice(0,10).replace(/-/g,'')}${Math.floor(Math.random()*1000)}`,
    ...data,
    report_time: new Date().toLocaleString(),
    status: 'unverified',
    check_time: null,
    check_by: null,
    error_file_url: null,
    reupload_count: 0,
    last_reupload_time: null,
    fail_reason: null
  };
  platformReports.unshift(newReport);
  return newReport;
};

// 更新上报记录（重新上传）
export const updatePlatformReport = (reportId, newFile, taskId) => {
  const index = platformReports.findIndex(r => r.report_id === reportId);
  if (index !== -1) {
    platformReports[index] = {
      ...platformReports[index],
      file_name: newFile.name,
      reupload_count: (platformReports[index].reupload_count || 0) + 1,
      last_reupload_time: new Date().toLocaleString(),
      status: 'unverified', // 重新上传后变为未校验
      check_time: null,
      check_by: null,
      error_file_url: null,
      fail_reason: null
    };
    return platformReports[index];
  }
  return null;
};

// 执行校验（单条或批量）
export const performCheck = (reportIds) => {
  reportIds.forEach(id => {
    const index = platformReports.findIndex(r => r.report_id === id);
    if (index !== -1 && platformReports[index].status === 'unverified') {
      // 模拟校验
      const isPass = Math.random() > 0.2;
      if (isPass) {
        platformReports[index].status = 'verified';
        platformReports[index].success_count = platformReports[index].data_count;
        platformReports[index].fail_count = 0;
        platformReports[index].fail_reason = null;
        platformReports[index].error_file_url = null;
      } else {
        platformReports[index].status = 'failed';
        platformReports[index].success_count = Math.floor(platformReports[index].data_count * 0.7);
        platformReports[index].fail_count = platformReports[index].data_count - platformReports[index].success_count;
        platformReports[index].fail_reason = '评价对象ID不存在(部分), 指标项不匹配(部分)';
        platformReports[index].error_file_url = '/error/check_error.xlsx';
      }
      platformReports[index].check_time = new Date().toLocaleString();
      platformReports[index].check_by = 'u1';
      platformReports[index].check_by_name = '张三';
    }
  });
};

// 获取错误文件下载链接
export const getErrorFileUrl = (reportId) => {
  const report = platformReports.find(r => r.report_id === reportId);
  return report?.error_file_url || null;
};

// 表格列配置（根据tab动态）
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: true }
  ];

  const commonColumns = [
    { field: 'batch_no', title: '上报批次号', minWidth: 180, sortable: true, slots: { default: 'batch_no' } },
    { field: 'task_name', title: '关联评价任务', minWidth: 200, sortable: true, slots: { default: 'taskName' } },
    { field: 'report_by_name', title: '上报人', minWidth: 100, sortable: true },
    { field: 'report_time', title: '上报时间', minWidth: 160, sortable: true },
    { field: 'file_name', title: '上报文件名称', minWidth: 200 },
    { field: 'data_count', title: '数据条数', minWidth: 100, sortable: true }
  ];

  // 全部特有列
  const allExtra = [
    { field: 'status', title: '数据状态', minWidth: 100, sortable: true, slots: { default: 'status' } },
    { field: 'success_count', title: '成功条数', minWidth: 100, sortable: true },
    { field: 'fail_count', title: '失败条数', minWidth: 100, sortable: true },
    { field: 'check_time', title: '校验时间', minWidth: 160, sortable: true },
    { field: 'check_by_name', title: '校验操作人', minWidth: 120, sortable: true },
    { field: 'error_file_url', title: '错误文件下载', minWidth: 120, slots: { default: 'errorFileDownload' } }
  ];

  // 未校验特有列
  const unverifiedExtra = [
    { field: 'template_status', title: '模板下载状态', minWidth: 120 },
    { field: 'file_preview_url', title: '文件预览链接', minWidth: 100, slots: { default: 'filePreview' } }
  ];

  // 已校验特有列
  const verifiedExtra = [
    { field: 'check_time', title: '校验时间', minWidth: 160 },
    { field: 'check_by_name', title: '校验操作人', minWidth: 120 },
    { field: 'success_count', title: '成功条数', minWidth: 100 },
    { field: 'fail_count', title: '失败条数', minWidth: 100 },
    { field: 'data_store_status', title: '数据入库状态', minWidth: 120, formatter: () => '已入库' }
  ];

  // 校验失败特有列
  const failedExtra = [
    { field: 'fail_count', title: '失败条数', minWidth: 100, sortable: true },
    { field: 'fail_reason', title: '失败原因摘要', minWidth: 250, formatter: row => row.fail_reason?.substring(0, 50) || '-' },
    { field: 'check_time', title: '校验时间', minWidth: 160 },
    { field: 'error_file_url', title: '错误文件下载', minWidth: 120, slots: { default: 'errorFileDownload' } },
    { field: 'reupload_count', title: '重新上传次数', minWidth: 120 },
    { field: 'last_reupload_time', title: '最近重新上传时间', minWidth: 160 }
  ];

  let dynamicColumns = [];
  if (tab === '全部') dynamicColumns = allExtra;
  else if (tab === '未校验') dynamicColumns = unverifiedExtra;
  else if (tab === '已校验') dynamicColumns = verifiedExtra;
  else if (tab === '校验失败') dynamicColumns = failedExtra;

  const actionsColumn = {
    title: '操作',
    width: 220,
    fixed: 'right',
    slots: { default: 'actions' }
  };

  return [...baseColumns, ...commonColumns, ...dynamicColumns, actionsColumn];
}

// 搜索表单schema（根据tab动态）
export function getSearchSchemaByTab(tab) {
  const base = [
    { fieldName: 'task_id', label: '关联评价任务', component: 'Select', componentProps: { options: evalTaskList.map(t => ({ label: t.name, value: t.task_id })) } },
    { fieldName: 'report_by', label: '上报人', component: 'Select', componentProps: { options: userList.map(u => ({ label: u.name, value: u.id })) } },
    { fieldName: 'start_time', label: '上报开始时间', component: 'DatePicker', componentProps: { type: 'datetime' } },
    { fieldName: 'end_time', label: '上报结束时间', component: 'DatePicker', componentProps: { type: 'datetime' } }
  ];
  if (tab === '全部') {
    base.push({ fieldName: 'status', label: '数据状态', component: 'Select', componentProps: { options: reportStatusList.map(s => ({ label: s.name, value: s.id })) } });
  }
  if (tab === '校验失败') {
    base.push({ fieldName: 'fail_reason', label: '失败原因', component: 'Input' });
  }
  return base;
}
