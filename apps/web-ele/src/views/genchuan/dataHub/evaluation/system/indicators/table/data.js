/** 指标体系管理 - 模拟数据及配置 */

// 模拟对象类型（适用对象类型）
export const objectTypeList = [
  { id: '1', name: '网格' },
  { id: '2', name: '部门' },
  { id: '3', name: '社区' },
  { id: '4', name: '街道' }
];

// 模拟指标类型
export const indexTypeList = [
  { id: 'it1', name: '数量' },
  { id: 'it2', name: '比率' },
  { id: 'it3', name: '时长' },
  { id: 'it4', name: '分数' }
];

// 模拟计算方式
export const calcWayList = [
  { id: 'cw1', name: '平均值' },
  { id: 'cw2', name: '总和' },
  { id: 'cw3', name: '百分比' },
  { id: 'cw4', name: '最大值' }
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

// 模拟版本号
const versions = ['V1.0', 'V1.1', 'V2.0', 'V2.1', 'V3.0'];

/** 指标体系列表数据 - 静态固定数据（共15条，启用9条，停用6条） */
export const dataList = () => {
  const list = [];
  for (let i = 1; i <= 15; i++) {
    const statusId = i <= 9 ? 's1' : 's2';
    const statusName = i <= 9 ? '启用' : '停用';
    const version = versions[(i - 1) % versions.length];
    const objectType = objectTypeList[(i - 1) % objectTypeList.length];
    const createUser = userList[(i - 1) % userList.length];
    const updateUser = userList[(i + 2) % userList.length];
    const now = new Date();
    const createTime = new Date(now.getTime() - i * 86400000).toLocaleString();
    const updateTime = new Date(now.getTime() - (i - 3) * 86400000).toLocaleString();

    // 模拟分类数量（1~3个）
    const categoryCount = Math.floor(Math.random() * 3) + 1;
    // 模拟指标项总数（分类内指标项数量随机）
    let itemCount = 0;
    const categories = [];
    for (let j = 1; j <= categoryCount; j++) {
      const itemsInCat = Math.floor(Math.random() * 4) + 1; // 每类1~4个指标
      itemCount += itemsInCat;
      const items = [];
      for (let k = 1; k <= itemsInCat; k++) {
        items.push({
          itemId: `item_${i}_${j}_${k}`,
          name: `指标项${i}-${j}-${k}`,
          indexTypeId: indexTypeList[(k - 1) % indexTypeList.length].id,
          indexTypeName: indexTypeList[(k - 1) % indexTypeList.length].name,
          calcWayId: calcWayList[(k - 1) % calcWayList.length].id,
          calcWayName: calcWayList[(k - 1) % calcWayList.length].name,
          threshold: (Math.random() * 100).toFixed(1),
          weight: (Math.random() * 30 + 10).toFixed(1)
        });
      }
      categories.push({
        categoryId: `cat_${i}_${j}`,
        name: `分类${i}-${j}`,
        weight: (Math.random() * 40 + 20).toFixed(1),
        sortNo: j,
        items: items
      });
    }

    list.push({
      systemId: `sys_${i}`,
      name: `指标体系${i}`,
      code: `INDEX-${String(i).padStart(4, '0')}`,
      objectTypeId: objectType.id,
      objectTypeName: objectType.name,
      version: version,
      desc: `这是指标体系${i}的描述信息，用于评价${objectType.name}。`,
      categoryCount: categoryCount,
      itemCount: itemCount,
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
      changeLog: statusId === 's2' ? '因版本迭代停用' : '初始化创建；权重调整；',
      categories: categories
    });
  }
  return list;
};

/** 表单配置（新增/编辑/版本复制） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '体系名称',
      component: 'Input',
      componentProps: { placeholder: '请输入体系名称' },
      rules: 'required'
    },
    {
      fieldName: 'code',
      label: '体系编码',
      component: 'Input',
      componentProps: { placeholder: '请输入体系编码' },
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
      fieldName: 'version',
      label: '版本号',
      component: 'Input',
      componentProps: { placeholder: '请输入版本号，如V1.0' },
      rules: 'required'
    },
    {
      fieldName: 'desc',
      label: '描述信息',
      component: 'Input',
      componentProps: { type: 'textarea', placeholder: '请输入描述信息' },
      rules: ''
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

/** 根据标签页获取表格列配置 */
export function getGridColumnsByTab(tab) {
  const baseColumns = [
    { type: 'checkbox', width: 40, visible: tab === '全部' } // 仅在全部tab显示复选框
  ];

  const commonColumns = [
    {
      field: 'name',
      title: '体系名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '体系编码',
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
    },
    {
      field: 'version',
      title: '版本号',
      minWidth: 100,
      sortable: true
    }
  ];

  // 全部tab额外列
  const allExtraColumns = [
    {
      field: 'desc',
      title: '描述信息',
      minWidth: 200,
      sortable: false
    },
    {
      field: 'categoryCount',
      title: '分类总数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'itemCount',
      title: '指标项总数',
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
    }
  ];

  // 启用tab额外列
  const enableExtraColumns = [
    {
      field: 'categoryCount',
      title: '分类总数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'itemCount',
      title: '指标项总数',
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
  editText: '编辑指标体系',
  addText: '新增指标体系',
  versionText: '新增版本',
  excelName: '指标体系列表',
  excelAllName: '指标体系数据.xlsx',
  total: '总计：体系总数15；启用体系9；停用体系6',
};
