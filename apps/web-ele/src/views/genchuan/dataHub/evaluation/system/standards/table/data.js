/** 评价标准管理 - 模拟数据及配置 */

// 模拟指标体系（用于关联适用体系）
export const indexSystemList = [
  { id: 'sys1', name: '网格管理评价体系V1.0' },
  { id: 'sys2', name: '部门绩效评价体系V2.0' },
  { id: 'sys3', name: '社区服务评价体系V1.5' },
  { id: 'sys4', name: '街道治理评价体系V3.0' }
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

/** 标准分类列表数据 - 静态固定数据（共12条，启用8条，停用4条） */
export const dataList = () => {
  const list = [];
  for (let i = 1; i <= 12; i++) {
    const statusId = i <= 8 ? 's1' : 's2';
    const statusName = i <= 8 ? '启用' : '停用';
    const system = indexSystemList[(i - 1) % indexSystemList.length];
    const createUser = userList[(i - 1) % userList.length];
    const updateUser = userList[(i + 2) % userList.length];
    const now = new Date();
    const createTime = new Date(now.getTime() - i * 86400000).toLocaleString();
    const updateTime = new Date(now.getTime() - (i - 3) * 86400000).toLocaleString();
    const lastUseTime = statusId === 's1' ? updateTime : '';
    const useCount = Math.floor(Math.random() * 50);

    // 标准项数量（1~5个）
    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items = [];
    for (let j = 1; j <= itemCount; j++) {
      // 生成不重叠的分数范围（简单模拟：按排序递增）
      const min = (j - 1) * 20;
      const max = j * 20 - 1;
      const scoreRange = j === 1 ? `<${max + 1}` : j === itemCount ? `≥${min}` : `${min}-${max}`;
      items.push({
        standardItemId: `item_${i}_${j}`,
        grade: ['优秀', '良好', '合格', '不合格', '待改进'][j - 1] || `等级${j}`,
        scoreRange: scoreRange,
        sortNo: j,
        createBy: createUser.id,
        createTime: createTime,
        updateBy: updateUser.id,
        updateTime: updateTime
      });
    }

    list.push({
      standardCategoryId: `sc_${i}`,
      name: `标准分类${i}`,
      systemId: system.id,
      systemName: system.name,
      itemCount: itemCount,
      statusId: statusId,
      statusName: statusName,
      createBy: createUser.id,
      createByName: createUser.name,
      createTime: createTime,
      updateBy: updateUser.id,
      updateByName: updateUser.name,
      updateTime: updateTime,
      lastUseTime: lastUseTime,
      useCount: useCount,
      changeLog: statusId === 's2' ? '因版本迭代停用' : '初始化创建；等级调整；',
      items: items
    });
  }
  return list;
};

/** 标准分类表单配置（新增/编辑） */
export function useCategoryFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '标准分类名称',
      component: 'Input',
      componentProps: { placeholder: '请输入标准分类名称' },
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

/** 标准项表单配置（新增/编辑） */
export function useItemFormSchema() {
  return [
    {
      fieldName: 'grade',
      label: '标准项等级',
      component: 'Input',
      componentProps: { placeholder: '如：优秀、合格' },
      rules: 'required'
    },
    {
      fieldName: 'scoreRange',
      label: '分数范围',
      component: 'Input',
      componentProps: { placeholder: '例如：≥90, 70-89, <70' },
      rules: 'required'
    },
    {
      fieldName: 'sortNo',
      label: '排序序号',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入整数', min: 1, precision: 0 },
      rules: 'required'
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
      title: '标准分类名称',
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
      field: 'itemCount',
      title: '标准项数量',
      minWidth: 120,
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
      title: '标准项数量',
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
    ...(tab === '全部' ? baseColumns : []),
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
  editText: '编辑标准分类',
  addText: '新增标准分类',
  versionText: '新增版本', // 可能不需要，但保留占位
  excelName: '评价标准列表',
  excelAllName: '评价标准数据.xlsx',
  total: '总计：分类总数12；启用8；停用4',
  addItemText: '新增标准项',
  editItemText: '编辑标准项'
};
