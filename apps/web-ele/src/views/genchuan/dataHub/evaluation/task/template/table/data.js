/** 任务模板管理 - 模拟数据及配置 */

// 模拟指标体系（用于关联适用体系）
export const indexSystemList = [
  { id: 'sys1', name: '网格管理评价体系V1.0' },
  { id: 'sys2', name: '部门绩效评价体系V2.0' },
  { id: 'sys3', name: '社区服务评价体系V1.5' },
  { id: 'sys4', name: '街道治理评价体系V3.0' }
];

// 模拟评价主体
export const subjectList = [
  { id: 'sub1', name: '专家评审组A' },
  { id: 'sub2', name: '部门自评组' },
  { id: 'sub3', name: '社区居民代表' },
  { id: 'sub4', name: '街道考核组' }
];

// 模拟适用对象类型
export const objectTypeList = [
  { id: 'obj1', name: '网格' },
  { id: 'obj2', name: '部门' },
  { id: 'obj3', name: '社区' },
  { id: 'obj4', name: '街道' }
];

// 模拟任务周期类型
export const cycleTypeList = [
  { id: 'cyc1', name: '月度' },
  { id: 'cyc2', name: '季度' },
  { id: 'cyc3', name: '年度' },
  { id: 'cyc4', name: '专项' }
];

// 模拟状态字典
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' }
];

/** 任务模板列表数据 - 静态固定数据（共12条，启用8条，停用4条） */
export const dataList = () => {
  const list = [];
  for (let i = 1; i <= 12; i++) {
    const statusId = i <= 8 ? 's1' : 's2';
    const statusName = i <= 8 ? '启用' : '停用';
    const objectType = objectTypeList[(i - 1) % objectTypeList.length];
    const system = indexSystemList[(i - 1) % indexSystemList.length];
    const subject = subjectList[(i - 1) % subjectList.length];
    const cycleType = cycleTypeList[(i - 1) % cycleTypeList.length];
    const now = new Date();
    const createTime = new Date(now.getTime() - i * 86400000).toLocaleString();
    const updateTime = new Date(now.getTime() - (i - 3) * 86400000).toLocaleString();
    const lastUseTime = statusId === 's1' ? updateTime : '';
    const useCount = Math.floor(Math.random() * 50);

    list.push({
      templateId: `temp_${i}`,
      name: `任务模板${i}`,
      code: `TMP${String(i).padStart(3, '0')}`,
      objectTypeId: objectType.id,
      objectTypeName: objectType.name,
      systemId: system.id,
      systemName: system.name,
      subjectId: subject.id,
      subjectName: subject.name,
      cycleTypeId: cycleType.id,
      cycleTypeName: cycleType.name,
      desc: `这是任务模板${i}的描述信息，用于测试任务模板管理功能。`,
      statusId: statusId,
      statusName: statusName,
      createBy: 'u1',
      createByName: '张三',
      createTime: createTime,
      updateBy: 'u2',
      updateByName: '李四',
      updateTime: updateTime,
      useCount: useCount,
      lastUseTime: lastUseTime,
      changeLog: statusId === 's2' ? '因版本迭代停用' : '初始化创建；配置调整；'
    });
  }
  return list;
};

/** 任务模板表单配置（新增/编辑/复制） */
export function useTemplateFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '模板名称',
      component: 'Input',
      componentProps: { placeholder: '请输入模板名称' },
      rules: 'required'
    },
    {
      fieldName: 'code',
      label: '模板编码',
      component: 'Input',
      componentProps: { placeholder: '请输入模板编码' },
      rules: 'required'
    },
    {
      fieldName: 'objectTypeId',
      label: '适用对象类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用对象类型',
        options: objectTypeList.map(o => ({ label: o.name, value: o.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'systemId',
      label: '关联指标体系',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联指标体系',
        options: indexSystemList.map(s => ({ label: s.name, value: s.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'subjectId',
      label: '评价主体',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评价主体',
        options: subjectList.map(s => ({ label: s.name, value: s.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'cycleTypeId',
      label: '任务周期',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务周期',
        options: cycleTypeList.map(c => ({ label: c.name, value: c.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'desc',
      label: '描述信息',
      component: 'Input',
      componentProps: {
        placeholder: '请输入描述信息',
        type: 'textarea',
        rows: 3
      },
      rules: ''
    }
  ];
}

/** 根据标签页获取表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible:true } // 仅在全部tab显示复选框
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '模板名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '模板编码',
      minWidth: 120,
      sortable: true,
      slots: { default: 'code' }
    },
    {
      field: 'objectTypeName',
      title: '适用对象类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'objectTypeName' }
    }
  ];

  // 全部tab额外列
  const allExtraColumns = [
    {
      field: 'systemName',
      title: '关联指标体系',
      minWidth: 180,
      sortable: true,
      slots: { default: 'systemName' }
    },
    {
      field: 'subjectName',
      title: '评价主体',
      minWidth: 120,
      sortable: true,
      slots: { default: 'subjectName' }
    },
    {
      field: 'cycleTypeName',
      title: '任务周期',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cycleTypeName' }
    },
    {
      field: 'desc',
      title: '描述信息',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.desc?.substring(0, 50) + (row.desc?.length > 50 ? '...' : '')
    },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'statusName' }
    },
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
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'lastUseTime',
      title: '最近使用时间',
      minWidth: 160,
      sortable: true
    }
  ];

  // 启用tab额外列
  const enableExtraColumns = [
    {
      field: 'systemName',
      title: '关联指标体系',
      minWidth: 180,
      sortable: true,
      slots: { default: 'systemName' }
    },
    {
      field: 'subjectName',
      title: '评价主体',
      minWidth: 120,
      sortable: true,
      slots: { default: 'subjectName' }
    },
    {
      field: 'cycleTypeName',
      title: '任务周期',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cycleTypeName' }
    },
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
      field: 'lastUseTime',
      title: '最近使用时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
      sortable: true
    }
  ];

  // 停用tab额外列
  const disableExtraColumns = [
    {
      field: 'systemName',
      title: '关联指标体系',
      minWidth: 180,
      sortable: true,
      slots: { default: 'systemName' }
    },
    {
      field: 'subjectName',
      title: '评价主体',
      minWidth: 120,
      sortable: true,
      slots: { default: 'subjectName' }
    },
    {
      field: 'cycleTypeName',
      title: '任务周期',
      minWidth: 100,
      sortable: true,
      slots: { default: 'cycleTypeName' }
    },
    {
      field: 'changeLog',
      title: '停用原因',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    },
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
      field: 'updateTime',
      title: '停用时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'updateByName',
      title: '停用操作人',
      minWidth: 120,
      sortable: true
    }
  ];

  let dynamicColumns = [];
  if (tab === '全部') {
    dynamicColumns = allExtraColumns;
  } else if (tab === '启用') {
    dynamicColumns = enableExtraColumns;
  } else if (tab === '停用') {
    dynamicColumns = disableExtraColumns;
  }

  const columns = [
    ...baseColumns,
    ...commonColumns,
    ...dynamicColumns,
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];

  return columns;
}

export const textObj = {
  editText: '编辑任务模板',
  addText: '新增任务模板',
  copyText: '复制任务模板',
  excelName: '任务模板列表',
  excelAllName: '任务模板数据.xlsx',
  total: '总计：模板总数12；启用8；停用4'
};
