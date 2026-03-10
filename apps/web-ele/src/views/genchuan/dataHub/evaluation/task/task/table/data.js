/** 评价任务管理 - 模拟数据及配置 */

// 模拟任务模板列表（用于关联）
export const templateList = [
  { id: 'temp1', name: '网格管理评价模板V1.0' },
  { id: 'temp2', name: '部门绩效评价模板V2.0' },
  { id: 'temp3', name: '社区服务评价模板V1.5' },
  { id: 'temp4', name: '街道治理评价模板V3.0' }
];

// 模拟数据采集方式字典
export const collectTypeList = [
  { id: 'ct1', name: '自动采集' },
  { id: 'ct2', name: '人工录入' },
  { id: 'ct3', name: '接口同步' }
];

// 模拟任务状态字典
export const taskStatusList = [
  { id: 'ts1', name: '未启动' },
  { id: 'ts2', name: '进行中' },
  { id: 'ts3', name: '暂停中' },
  { id: 'ts4', name: '已完成' },
  { id: 'ts5', name: '已取消' }
];

// 模拟任务周期类型
export const cycleTypeList = [
  { id: 'cyc1', name: '月度' },
  { id: 'cyc2', name: '季度' },
  { id: 'cyc3', name: '年度' },
  { id: 'cyc4', name: '专项' }
];

// 模拟指标体系（用于关联）
export const indexSystemList = [
  { id: 'sys1', name: '网格管理评价体系V1.0' },
  { id: 'sys2', name: '部门绩效评价体系V2.0' },
  { id: 'sys3', name: '社区服务评价体系V1.5' },
  { id: 'sys4', name: '街道治理评价体系V3.0' }
];

/** 评价任务列表数据 - 静态固定数据 */
export const dataList = () => {
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const statusId = i <= 5 ? 'ts1' : i <= 10 ? 'ts2' : i <= 13 ? 'ts3' : i <= 17 ? 'ts4' : 'ts5';
    const statusName = i <= 5 ? '未启动' : i <= 10 ? '进行中' : i <= 13 ? '暂停中' : i <= 17 ? '已完成' : '已取消';
    const template = templateList[(i - 1) % templateList.length];
    const collectType = collectTypeList[(i - 1) % collectTypeList.length];
    const cycleType = cycleTypeList[(i - 1) % cycleTypeList.length];
    const system = indexSystemList[(i - 1) % indexSystemList.length];
    
    const now = new Date();
    const createTime = new Date(now.getTime() - i * 86400000);
    const startTime = new Date(createTime.getTime() + 3 * 86400000);
    const endTime = new Date(startTime.getTime() + 30 * 86400000);
    const totalObject = 50 + Math.floor(Math.random() * 100);
    const completedObject = statusName === '已完成' ? totalObject : Math.floor(Math.random() * totalObject);
    const completeRate = totalObject > 0 ? Math.round((completedObject / totalObject) * 100) : 0;

    list.push({
      taskId: `task_${i}`,
      name: `评价任务${i}`,
      code: `EVL${String(i).padStart(4, '0')}`,
      templateId: template.id,
      templateName: template.name,
      objectScope: i % 2 === 0 ? '全部' : `自定义${Math.floor(Math.random() * 50) + 10}个`,
      cycle: cycleType.name,
      cycleId: cycleType.id,
      startTime: startTime.toLocaleString(),
      endTime: endTime.toLocaleString(),
      originalEndTime: endTime.toLocaleString(),
      collectTypeId: collectType.id,
      collectTypeName: collectType.name,
      statusId: statusId,
      statusName: statusName,
      completeRate: completeRate,
      totalObject: totalObject,
      completedObject: completedObject,
      uncompletedObject: totalObject - completedObject,
      createBy: 'u1',
      createByName: '张三',
      createTime: createTime.toLocaleString(),
      updateBy: 'u2',
      updateByName: '李四',
      updateTime: new Date(createTime.getTime() + 86400000).toLocaleString(),
      cancelReason: statusName === '已取消' ? '因业务调整取消该任务' : '',
      cancelTime: statusName === '已取消' ? new Date(createTime.getTime() + 5 * 86400000).toLocaleString() : '',
      cancelBy: statusName === '已取消' ? 'u3' : '',
      cancelByName: statusName === '已取消' ? '王五' : '',
      systemName: system.name,
      completeTime: statusName === '已完成' ? new Date(endTime.getTime()).toLocaleString() : '',
      changeLog: '初始化创建'
    });
  }
  return list;
};

/** 评价任务表单配置（新增/编辑） */
export function useTaskFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '任务名称',
      component: 'Input',
      componentProps: { placeholder: '请输入任务名称' },
      rules: 'required'
    },
    {
      fieldName: 'templateId',
      label: '关联模板',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联模板',
        options: templateList.map(t => ({ label: t.name, value: t.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'objectScope',
      label: '评价对象范围',
      component: 'Input',
      componentProps: { placeholder: '请输入评价对象范围' },
      rules: 'required'
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', placeholder: '请选择开始时间' },
      rules: 'required'
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: { type: 'datetime', placeholder: '请选择结束时间' },
      rules: 'required'
    },
    {
      fieldName: 'collectTypeId',
      label: '数据采集方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择数据采集方式',
        options: collectTypeList.map(c => ({ label: c.name, value: c.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'cycleId',
      label: '任务周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务周期',
        options: cycleTypeList.map(c => ({ label: c.name, value: c.id }))
      },
      rules: ''
    }
  ];
}

/** 根据标签页获取表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: tab === '全部' }
  ];

  const commonColumnsAll = [
    {
      field: 'name',
      title: '任务名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '任务编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'code' }
    },
    {
      field: 'templateName',
      title: '关联模板',
      minWidth: 180,
      sortable: true,
      slots: { default: 'templateName' }
    },
    {
      field: 'objectScope',
      title: '评价对象范围',
      minWidth: 140,
      sortable: true
    },
    {
      field: 'cycle',
      title: '任务周期',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'startTime',
      title: '开始时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'endTime',
      title: '结束时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'collectTypeName',
      title: '数据采集方式',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' }
    },
    {
      field: 'completeRate',
      title: '完成率',
      minWidth: 100,
      sortable: true,
      formatter: (row) => `${row.completeRate}%`
    }
  ];

  const allExtraColumns = [
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'totalObject',
      title: '总对象数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'completedObject',
      title: '已完成对象数',
      minWidth: 120,
      sortable: true
    }
  ];

  const notStartExtraColumns = [
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'totalObject',
      title: '总对象数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'systemName',
      title: '关联指标体系',
      minWidth: 180,
      sortable: true
    }
  ];

  const inProgressExtraColumns = [
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'startTime',
      title: '启动时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'updateTime',
      title: '最近更新时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'uncompletedObject',
      title: '未完成对象数',
      minWidth: 120,
      sortable: true
    }
  ];

  const completedExtraColumns = [
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'startTime',
      title: '启动时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'totalObject',
      title: '总对象数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'completedObject',
      title: '已完成对象数',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'relatedAudit',
      title: '关联结果审核',
      minWidth: 120,
      sortable: true,
      formatter: (row) => row.relatedAudit || '未关联'
    }
  ];

  const cancelledExtraColumns = [
    {
      field: 'createByName',
      title: '创建人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'cancelTime',
      title: '取消时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'cancelByName',
      title: '取消操作人',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'totalObject',
      title: '总对象数',
      minWidth: 100,
      sortable: true
    }
  ];

  let dynamicColumns = [];
  if (tab === '全部') {
    dynamicColumns = allExtraColumns;
  } else if (tab === '未启动') {
    dynamicColumns = notStartExtraColumns;
  } else if (tab === '进行中') {
    dynamicColumns = inProgressExtraColumns;
  } else if (tab === '已完成') {
    dynamicColumns = completedExtraColumns;
  } else if (tab === '已取消') {
    dynamicColumns = cancelledExtraColumns;
  }

  const columns = [
    ...(tab === '全部' ? baseColumns : []),
    ...commonColumnsAll,
    ...dynamicColumns,
    {
      title: '操作',
      width: 280,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];

  return columns;
}

export const textObj = {
  editText: '编辑评价任务',
  addText: '新增评价任务',
  excelName: '评价任务列表',
  excelAllName: '评价任务数据.xlsx',
  total: '总计：任务总数20；未启动5；进行中5；暂停中3；已完成4；已取消3'
};
