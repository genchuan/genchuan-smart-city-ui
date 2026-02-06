/** 运维排班表初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      scheduleId: 'SCH001', // 排班ID
      maintainUserId: 'M001', // 运维人员ID
      deptId: 'D001', // 所属部门ID
      scheduleDate: '2026-02-10', // 排班日期
      shiftType: '早班', // 班次类型
      startTime: '08:00', // 上班时间
      endTime: '16:00', // 下班时间
      status: '正常', // 状态
      adjustReason: null, // 调整原因
      createBy: 'U001', // 排班人ID
      createTime: '2026-01-08 09:20:30', // 创建时间
      updateTime: '2026-01-08 09:20:30', // 更新时间
      remark: '', // 备注
      maintainUserName: '张三', // 运维人员姓名
      deptName: '运维一部', // 所属部门名称
      createUserName: '李四', // 操作人姓名
    },
    {
      scheduleId: 'SCH002',
      maintainUserId: 'M002',
      deptId: 'D001',
      scheduleDate: '2026-02-10',
      shiftType: '中班',
      startTime: '16:00',
      endTime: '24:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U001',
      createTime: '2026-01-08 09:25:30',
      updateTime: '2026-01-08 09:25:30',
      remark: '',
      maintainUserName: '王五',
      deptName: '运维一部',
      createUserName: '李四',
    },
    {
      scheduleId: 'SCH003',
      maintainUserId: 'M003',
      deptId: 'D002',
      scheduleDate: '2026-02-10',
      shiftType: '晚班',
      startTime: '20:00',
      endTime: '04:00',
      status: '调班',
      adjustReason: '个人原因调班',
      createBy: 'U002',
      createTime: '2026-01-08 10:30:30',
      updateTime: '2026-01-09 14:20:30',
      remark: '与赵六调班',
      maintainUserName: '赵六',
      deptName: '运维二部',
      createUserName: '孙七',
    },
    {
      scheduleId: 'SCH004',
      maintainUserId: 'M004',
      deptId: 'D002',
      scheduleDate: '2026-02-11',
      shiftType: '早班',
      startTime: '08:00',
      endTime: '16:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U002',
      createTime: '2026-01-08 10:35:30',
      updateTime: '2026-01-08 10:35:30',
      remark: '',
      maintainUserName: '周八',
      deptName: '运维二部',
      createUserName: '孙七',
    },
    {
      scheduleId: 'SCH005',
      maintainUserId: 'M005',
      deptId: 'D003',
      scheduleDate: '2026-02-11',
      shiftType: '中班',
      startTime: '16:00',
      endTime: '24:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U003',
      createTime: '2026-01-08 11:40:30',
      updateTime: '2026-01-08 11:40:30',
      remark: '',
      maintainUserName: '吴九',
      deptName: '运维三部',
      createUserName: '郑十',
    },
    {
      scheduleId: 'SCH006',
      maintainUserId: 'M006',
      deptId: 'D003',
      scheduleDate: '2026-02-11',
      shiftType: '晚班',
      startTime: '20:00',
      endTime: '04:00',
      status: '取消',
      adjustReason: '设备维护',
      createBy: 'U003',
      createTime: '2026-01-08 11:45:30',
      updateTime: '2026-01-10 08:30:30',
      remark: '因设备维护取消该班次',
      maintainUserName: '郑十',
      deptName: '运维三部',
      createUserName: '郑十',
    },
    {
      scheduleId: 'SCH007',
      maintainUserId: 'M001',
      deptId: 'D001',
      scheduleDate: '2026-02-12',
      shiftType: '早班',
      startTime: '08:00',
      endTime: '16:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U001',
      createTime: '2026-01-08 14:20:30',
      updateTime: '2026-01-08 14:20:30',
      remark: '',
      maintainUserName: '张三',
      deptName: '运维一部',
      createUserName: '李四',
    },
    {
      scheduleId: 'SCH008',
      maintainUserId: 'M002',
      deptId: 'D001',
      scheduleDate: '2026-02-12',
      shiftType: '中班',
      startTime: '16:00',
      endTime: '24:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U001',
      createTime: '2026-01-08 14:25:30',
      updateTime: '2026-01-08 14:25:30',
      remark: '',
      maintainUserName: '王五',
      deptName: '运维一部',
      createUserName: '李四',
    },
    {
      scheduleId: 'SCH009',
      maintainUserId: 'M003',
      deptId: 'D002',
      scheduleDate: '2026-02-12',
      shiftType: '晚班',
      startTime: '20:00',
      endTime: '04:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U002',
      createTime: '2026-01-08 15:30:30',
      updateTime: '2026-01-08 15:30:30',
      remark: '',
      maintainUserName: '赵六',
      deptName: '运维二部',
      createUserName: '孙七',
    },
    {
      scheduleId: 'SCH010',
      maintainUserId: 'M004',
      deptId: 'D002',
      scheduleDate: '2026-02-13',
      shiftType: '早班',
      startTime: '08:00',
      endTime: '16:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U002',
      createTime: '2026-01-08 15:35:30',
      updateTime: '2026-01-08 15:35:30',
      remark: '',
      maintainUserName: '周八',
      deptName: '运维二部',
      createUserName: '孙七',
    },
    {
      scheduleId: 'SCH011',
      maintainUserId: 'M005',
      deptId: 'D003',
      scheduleDate: '2026-02-13',
      shiftType: '中班',
      startTime: '16:00',
      endTime: '24:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U003',
      createTime: '2026-01-08 16:40:30',
      updateTime: '2026-01-08 16:40:30',
      remark: '',
      maintainUserName: '吴九',
      deptName: '运维三部',
      createUserName: '郑十',
    },
    {
      scheduleId: 'SCH012',
      maintainUserId: 'M006',
      deptId: 'D003',
      scheduleDate: '2026-02-13',
      shiftType: '晚班',
      startTime: '20:00',
      endTime: '04:00',
      status: '正常',
      adjustReason: null,
      createBy: 'U003',
      createTime: '2026-01-08 16:45:30',
      updateTime: '2026-01-08 16:45:30',
      remark: '',
      maintainUserName: '郑十',
      deptName: '运维三部',
      createUserName: '郑十',
    },
  ];
};

/** 运维排班表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'maintainUserId',
      label: '运维人员',
      component: 'Select',
      componentProps: {
        placeholder: '请选择运维人员',
        options: [
          { label: '张三', value: 'M001' },
          { label: '王五', value: 'M002' },
          { label: '赵六', value: 'M003' },
          { label: '周八', value: 'M004' },
          { label: '吴九', value: 'M005' },
          { label: '郑十', value: 'M006' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'deptId',
      label: '所属部门',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属部门',
        options: [
          { label: '运维一部', value: 'D001' },
          { label: '运维二部', value: 'D002' },
          { label: '运维三部', value: 'D003' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'scheduleDate',
      label: '排班日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择排班日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      rules: 'required',
    },
    {
      fieldName: 'shiftType',
      label: '班次类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择班次类型',
        options: [
          { label: '早班', value: '早班' },
          { label: '中班', value: '中班' },
          { label: '晚班', value: '晚班' },
          { label: '夜班', value: '夜班' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'startTime',
      label: '上班时间',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择上班时间',
        format: 'HH:mm',
        valueFormat: 'HH:mm',
      },
      rules: 'required',
    },
    {
      fieldName: 'endTime',
      label: '下班时间',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择下班时间',
        format: 'HH:mm',
        valueFormat: 'HH:mm',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: '正常' },
          { label: '调班', value: '调班' },
          { label: '取消', value: '取消' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'adjustReason',
      label: '调整原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入调整原因',
        type: 'textarea',
        rows: 3,
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        type: 'textarea',
        rows: 3,
      },
    },
  ];
}

/** 运维排班表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'scheduleId',
      title: '排班ID',
      minWidth: 120,
      sortable: true,
      slots: { default: 'scheduleId' },
    },
    {
      field: 'maintainUserName',
      title: '运维人员',
      minWidth: 120,
      sortable: true,
      slots: { default: 'maintainUserName' },
    },
    {
      field: 'deptName',
      title: '所属部门',
      minWidth: 120,
      sortable: true,
      slots: { default: 'deptName' },
    },
    {
      field: 'scheduleDate',
      title: '排班日期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'shiftType',
      title: '班次类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'shiftType' },
    },
    {
      field: 'startTime',
      title: '上班时间',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'endTime',
      title: '下班时间',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'createUserName',
      title: '操作人',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑排班',
  addText: '新增排班',
  // 导出Excel相关文本
  excelName: '运维排班列表',
  excelAllName: '运维排班数据.xlsx',
  // 统计总计文本
  total: ' 排班数量12',
};

/** 部门详情字段配置 */
export const deptDetailFields = [
  { label: '部门ID', key: 'deptId' },
  { label: '部门名称', key: 'deptName' },
  { label: '部门编码', key: 'deptCode' },
  { label: '父部门ID', key: 'parentId' },
  { label: '部门类型', key: 'deptType' },
  { label: '部门负责人ID', key: 'leaderId' },
  { label: '联系电话', key: 'contactPhone' },
  { label: '部门描述', key: 'deptDesc' },
  { label: '状态', key: 'status' },
  { label: '创建时间', key: 'createTime' },
  { label: '更新时间', key: 'updateTime' },
  { label: '备注', key: 'remark' },
];

/** 部门列表数据 */
export const deptList = [
  {
    deptId: 'D001',
    deptName: '运维一部',
    deptCode: 'OP-001',
    parentId: 'ROOT',
    deptType: '运维部门',
    leaderId: 'U001',
    contactPhone: '13800138001',
    deptDesc: '负责核心区域运维工作',
    status: '正常',
    createTime: '2025-01-01 09:00:00',
    updateTime: '2025-01-01 09:00:00',
    remark: '核心运维部门',
  },
  {
    deptId: 'D002',
    deptName: '运维二部',
    deptCode: 'OP-002',
    parentId: 'ROOT',
    deptType: '运维部门',
    leaderId: 'U002',
    contactPhone: '13800138002',
    deptDesc: '负责次要区域运维工作',
    status: '正常',
    createTime: '2025-01-01 09:00:00',
    updateTime: '2025-01-01 09:00:00',
    remark: '辅助运维部门',
  },
  {
    deptId: 'D003',
    deptName: '运维三部',
    deptCode: 'OP-003',
    parentId: 'ROOT',
    deptType: '运维部门',
    leaderId: 'U003',
    contactPhone: '13800138003',
    deptDesc: '负责外围区域运维工作',
    status: '正常',
    createTime: '2025-01-01 09:00:00',
    updateTime: '2025-01-01 09:00:00',
    remark: '外围运维部门',
  },
];

export const getScheduleStatsData = () => {
  const scheduleData = dataList();

  // 获取当前月份的第一天
  const now = new Date();
  const currentMonth = now.toISOString().slice(0, 7);

  // 筛选本月排班数据
  const monthlyData = scheduleData.filter((item) =>
    item.scheduleDate.startsWith(currentMonth),
  );

  // 计算卡片数据
  const monthlyTotalCount = monthlyData.length;
  const normalCount = monthlyData.filter(
    (item) => item.status === '正常',
  ).length;
  const shiftCount = monthlyData.filter(
    (item) => item.status === '调班',
  ).length;

  // 计算班次类型占比数据
  const shiftTypeStats = {};
  monthlyData.forEach((schedule) => {
    shiftTypeStats[schedule.shiftType] = 
      (shiftTypeStats[schedule.shiftType] || 0) + 1;
  });

  // 计算排班状态占比数据
  const statusStats = {};
  monthlyData.forEach((schedule) => {
    statusStats[schedule.status] = (statusStats[schedule.status] || 0) + 1;
  });

  // 计算各部门排班数量对比数据
  const deptStats = {};
  monthlyData.forEach((schedule) => {
    deptStats[schedule.deptName] = (deptStats[schedule.deptName] || 0) + 1;
  });

  // 转换为echarts所需的数据格式
  const shiftTypeChartData = Object.entries(shiftTypeStats).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const statusChartData = Object.entries(statusStats).map(([name, value]) => ({
    name,
    value,
  }));

  const deptChartData = {
    xAxis: Object.keys(deptStats),
    series: Object.values(deptStats),
  };

  return {
    cards: [
      {
        title: '本月排班总数',
        value: monthlyTotalCount,
        desc: `本月共${monthlyTotalCount}次排班`,
        color: '#4A90E2',
      },
      {
        title: '正常排班数',
        value: normalCount,
        desc: `正常排班${normalCount}次`,
        color: '#13ce66',
      },
      {
        title: '调班数',
        value: shiftCount,
        desc: `调班${shiftCount}次`,
        color: '#FF9F43',
      },
    ],
    charts: [
      {
        type: 'pie',
        title: '班次类型占比',
        data: shiftTypeChartData,
      },
      {
        type: 'pie',
        title: '排班状态占比',
        data: statusChartData,
      },
      {
        type: 'bar',
        title: '各部门排班数量对比',
        xAxis: deptChartData.xAxis,
        series: deptChartData.series,
      },
    ],
  };
};
