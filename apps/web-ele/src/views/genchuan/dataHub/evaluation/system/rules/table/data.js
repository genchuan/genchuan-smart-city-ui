/** 评价规则管理 - 模拟数据及配置 */

// 模拟对象类型（适用对象类型）
export const objectTypeList = [
  { id: '1', name: '网格' },
  { id: '2', name: '部门' },
  { id: '3', name: '社区' },
  { id: '4', name: '街道' }
];

// 模拟规则类型
export const ruleTypeList = [
  { id: 'rt1', name: '加分' },
  { id: 'rt2', name: '扣分' }
];

// 模拟指标体系
export const indexSystemList = [
  { id: 'is1', name: '网格管理评价体系V1.0' },
  { id: 'is2', name: '部门绩效评价体系V1.0' },
  { id: 'is3', name: '社区服务评价体系V1.0' },
  { id: 'is4', name: '街道综合评价体系V1.0' }
];

// 模拟指标项
export const indexItemList = [
  { id: 'ii1', name: '平均处置时长' },
  { id: 'ii2', name: '任务完成率' },
  { id: 'ii3', name: '满意度评分' },
  { id: 'ii4', name: '投诉数量' },
  { id: 'ii5', name: '安全事故数' }
];

// 模拟用户（创建人/更新人）
export const userList = [
  { id: 'u1', name: '张三' },
  { id: 'u2', name: '李四' },
  { id: 'u3', name: '王五' },
  { id: 'u4', name: '赵六' },
  { id: 'u5', name: '孙七' }
];

// 模拟状态字典
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' }
];

/** 评价规则列表数据 - 静态固定数据 */
export const dataList = () => {
  const list = [];
  for (let i = 1; i <= 15; i++) {
    const statusId = i <= 9 ? 's1' : 's2';
    const statusName = i <= 9 ? '启用' : '停用';
    const indexSystem = indexSystemList[(i - 1) % indexSystemList.length];
    const objectType = objectTypeList[(i - 1) % objectTypeList.length];
    const createUser = userList[(i - 1) % userList.length];
    const updateUser = userList[(i + 2) % userList.length];
    const now = new Date();
    const createTime = new Date(now.getTime() - i * 86400000).toLocaleString();
    const updateTime = new Date(now.getTime() - (i - 3) * 86400000).toLocaleString();

    // 模拟规则项数量（1~5个）
    const itemCount = Math.floor(Math.random() * 5) + 1;
    // 模拟否决项数量（0~2个）
    const vetoCount = Math.floor(Math.random() * 3);

    const ruleItems = [];
    for (let j = 1; j <= itemCount; j++) {
      const ruleType = ruleTypeList[(j - 1) % ruleTypeList.length];
      const indexItem = indexItemList[(j - 1) % indexItemList.length];
      ruleItems.push({
        ruleItemId: `ri_${i}_${j}`,
        name: `规则项${i}-${j}`,
        indexId: indexItem.id,
        indexName: indexItem.name,
        scoreLogic: `≤24小时得100分，每超1小时扣5分`,
        fullScore: (Math.random() * 50 + 50).toFixed(1),
        ruleTypeId: ruleType.id,
        ruleTypeName: ruleType.name
      });
    }

    const vetoItems = [];
    for (let k = 1; k <= vetoCount; k++) {
      vetoItems.push({
        vetoItemId: `vi_${i}_${k}`,
        name: `否决项${i}-${k}`,
        objectTypeId: objectType.id,
        objectTypeName: objectType.name,
        condition: '发生1起及以上重大安全事故',
        validCycle: '2025年度'
      });
    }

    list.push({
      ruleCategoryId: `rc_${i}`,
      name: `规则分类${i}`,
      systemId: indexSystem.id,
      systemName: indexSystem.name,
      itemCount: itemCount,
      vetoCount: vetoCount,
      statusId: statusId,
      statusName: statusName,
      createBy: createUser.id,
      createByName: createUser.name,
      createTime: createTime,
      updateBy: updateUser.id,
      updateByName: updateUser.name,
      updateTime: updateTime,
      lastUseTime: statusId === 's1' ? updateTime : '',
      useCount: Math.floor(Math.random() * 50),
      changeLog: statusId === 's2' ? '因政策调整停用' : '初始化创建；规则调整；',
      ruleItems: ruleItems,
      vetoItems: vetoItems
    });
  }
  return list;
};

/** 表单配置（新增/编辑规则分类） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则分类名称' },
      rules: 'required'
    },
    {
      fieldName: 'systemId',
      label: '适用指标体系',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用指标体系',
        options: indexSystemList.map(s => ({ label: s.name, value: s.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'statusId',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: statusList.map(s => ({ label: s.name, value: s.id }))
      },
      rules: '',
      defaultValue: 's1',
      hidden: true // 新增时隐藏，编辑时显示
    }
  ];
}

/** 规则项表单配置 */
export function useRuleItemFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '规则项名称',
      component: 'Input',
      componentProps: { placeholder: '请输入规则项名称' },
      rules: 'required'
    },
    {
      fieldName: 'indexId',
      label: '关联指标项',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联指标项',
        options: indexItemList.map(i => ({ label: i.name, value: i.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'scoreLogic',
      label: '评分逻辑',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入评分逻辑' },
      rules: 'required'
    },
    {
      fieldName: 'fullScore',
      label: '满分值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入满分值', min: 0, step: 0.1 },
      rules: 'required'
    },
    {
      fieldName: 'ruleTypeId',
      label: '规则类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则类型',
        options: ruleTypeList.map(r => ({ label: r.name, value: r.id }))
      },
      rules: 'required'
    }
  ];
}

/** 否决项表单配置 */
export function useVetoItemFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '否决项名称',
      component: 'Input',
      componentProps: { placeholder: '请输入否决项名称' },
      rules: 'required'
    },
    {
      fieldName: 'objectTypeId',
      label: '适用对象类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择适用对象类型',
        options: objectTypeList.map(t => ({ label: t.name, value: t.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'condition',
      label: '否决条件',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入否决条件' },
      rules: 'required'
    },
    {
      fieldName: 'validCycle',
      label: '生效周期',
      component: 'Input',
      componentProps: { placeholder: '请输入生效周期，如2025年度' },
      rules: 'required'
    },
    {
      fieldName: 'indexId',
      label: '关联指标项',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联指标项（指标型否决项必填）',
        options: indexItemList.map(i => ({ label: i.name, value: i.id }))
      },
      rules: ''
    },
    {
      fieldName: 'threshold',
      label: '阈值',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入阈值（指标型否决项必填）', min: 0, step: 0.1 },
      rules: ''
    }
  ];
}

/** 根据标签页获取表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: tab === '全部' } // 仅在全部tab显示复选框
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '规则分类名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'systemName',
      title: '适用指标体系',
      minWidth: 180,
      sortable: true,
      slots: { default: 'systemName' }
    }
  ];

  // 全部tab额外列
  const allExtraColumns = [
    {
      field: 'itemCount',
      title: '规则项数量',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'vetoCount',
      title: '否决项数量',
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
      field: 'changeLog',
      title: '变更日志',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    }
  ];

  // 启用tab额外列
  const enableExtraColumns = [
    {
      field: 'itemCount',
      title: '规则项数量',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'vetoCount',
      title: '否决项数量',
      minWidth: 120,
      sortable: true
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
      field: 'changeLog',
      title: '停用原因',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    },
    {
      field: 'itemCount',
      title: '规则项数量',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'vetoCount',
      title: '否决项数量',
      minWidth: 120,
      sortable: true
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
    ...(tab === '全部' ? baseColumns : []), // 仅全部tab显示复选框
    ...commonColumns,
    ...dynamicColumns,
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];

  return columns;
}

export const textObj = {
  editText: '编辑规则分类',
  addText: '新增规则分类',
  addRuleItemText: '新增规则项',
  addVetoItemText: '新增否决项',
  excelName: '评价规则列表',
  excelAllName: '评价规则数据.xlsx',
  total: '总计：规则分类总数15；启用规则分类9；停用规则分类6',
};
