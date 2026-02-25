/** 评价对象管理 - 模拟数据及配置 */

// 模拟区域数据
export const areaList = [
  { code: '350602', name: '芗城区' },
  { code: '350603', name: '龙文区' },
  { code: '350681', name: '龙海区' },
  { code: '350625', name: '长泰区' },
  { code: '350623', name: '漳浦县' }
];

// 模拟对象类型
export const objectTypeList = [
  { id: '1', name: '网格' },
  { id: '2', name: '部门' },
  { id: '3', name: '社区' },
  { id: '4', name: '街道' }
];

// 模拟用户（负责人/创建人/更新人）
export const userList = [
  { id: 'u1', name: '张三', phone: '13800138001' },
  { id: 'u2', name: '李四', phone: '13800138002' },
  { id: 'u3', name: '王五', phone: '13800138003' },
  { id: 'u4', name: '赵六', phone: '13800138004' },
  { id: 'u5', name: '孙七', phone: '13800138005' }
];

// 模拟关联对象（网格/部门）
export const relatedObjectList = [
  { id: 'r1', name: '芗城区XX街道第一网格' },
  { id: 'r2', name: '龙文区城市管理局' },
  { id: 'r3', name: '龙海区石码镇便民服务中心' },
  { id: 'r4', name: '长泰区武安镇综治办' }
];

// 模拟状态字典（仅启用和停用）
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' }
];

/** 评价对象列表数据 - 静态固定数据（共15条，启用9条，停用6条） */
export const dataList = () => [
  {
    id: '1',
    objectName: '芗城区网格单元1',
    objectCode: 'OBJ-0001',
    areaCode: '350602',
    areaName: '芗城区',
    objectTypeId: '1',
    objectTypeName: '网格',
    managerId: 'u1',
    managerName: '张三',
    managerPhone: '13800138001',
    relatedId: 'r1',
    relatedName: '芗城区XX街道第一网格',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u1',
    createByName: '张三',
    createTime: '2025-01-05 09:12:34',
    updateBy: 'u2',
    updateByName: '李四',
    updateTime: '2025-02-10 14:23:45',
    changeLog: '初始化创建；负责人变更；'
  },
  {
    id: '2',
    objectName: '龙文区部门单元2',
    objectCode: 'OBJ-0002',
    areaCode: '350603',
    areaName: '龙文区',
    objectTypeId: '2',
    objectTypeName: '部门',
    managerId: 'u2',
    managerName: '李四',
    managerPhone: '13800138002',
    relatedId: 'r2',
    relatedName: '龙文区城市管理局',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-01-08 10:05:21',
    updateBy: 'u3',
    updateByName: '王五',
    updateTime: '2025-02-12 09:30:12',
    changeLog: '初始化创建；'
  },
  {
    id: '3',
    objectName: '龙海区社区单元3',
    objectCode: 'OBJ-0003',
    areaCode: '350681',
    areaName: '龙海区',
    objectTypeId: '3',
    objectTypeName: '社区',
    managerId: 'u3',
    managerName: '王五',
    managerPhone: '13800138003',
    relatedId: 'r3',
    relatedName: '龙海区石码镇便民服务中心',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u4',
    createByName: '赵六',
    createTime: '2025-01-12 11:30:47',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-02-15 16:42:58',
    changeLog: '初始化创建；区域调整；'
  },
  {
    id: '4',
    objectName: '长泰区街道单元4',
    objectCode: 'OBJ-0004',
    areaCode: '350625',
    areaName: '长泰区',
    objectTypeId: '4',
    objectTypeName: '街道',
    managerId: 'u4',
    managerName: '赵六',
    managerPhone: '13800138004',
    relatedId: 'r4',
    relatedName: '长泰区武安镇综治办',
    statusId: 's2',
    statusName: '停用',
    createBy: 'u5',
    createByName: '孙七',
    createTime: '2025-01-15 08:45:13',
    updateBy: 'u1',
    updateByName: '张三',
    updateTime: '2025-02-18 10:15:39',
    changeLog: '初始化创建；停用操作；'
  },
  {
    id: '5',
    objectName: '漳浦县网格单元5',
    objectCode: 'OBJ-0005',
    areaCode: '350623',
    areaName: '漳浦县',
    objectTypeId: '1',
    objectTypeName: '网格',
    managerId: 'u5',
    managerName: '孙七',
    managerPhone: '13800138005',
    relatedId: 'r1',
    relatedName: '芗城区XX街道第一网格',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u2',
    createByName: '李四',
    createTime: '2025-01-18 13:22:56',
    updateBy: 'u2',
    updateByName: '李四',
    updateTime: '2025-02-20 11:38:24',
    changeLog: '初始化创建；'
  },
  {
    id: '6',
    objectName: '芗城区部门单元6',
    objectCode: 'OBJ-0006',
    areaCode: '350602',
    areaName: '芗城区',
    objectTypeId: '2',
    objectTypeName: '部门',
    managerId: 'u1',
    managerName: '张三',
    managerPhone: '13800138001',
    relatedId: 'r2',
    relatedName: '龙文区城市管理局',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-01-20 09:05:17',
    updateBy: 'u4',
    updateByName: '赵六',
    updateTime: '2025-02-22 15:50:33',
    changeLog: '初始化创建；负责人变更；'
  },
  {
    id: '7',
    objectName: '龙文区社区单元7',
    objectCode: 'OBJ-0007',
    areaCode: '350603',
    areaName: '龙文区',
    objectTypeId: '3',
    objectTypeName: '社区',
    managerId: 'u2',
    managerName: '李四',
    managerPhone: '13800138002',
    relatedId: 'r3',
    relatedName: '龙海区石码镇便民服务中心',
    statusId: 's2',
    statusName: '停用',
    createBy: 'u4',
    createByName: '赵六',
    createTime: '2025-01-22 14:38:42',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-02-24 09:12:07',
    changeLog: '初始化创建；停用操作；'
  },
  {
    id: '8',
    objectName: '龙海区街道单元8',
    objectCode: 'OBJ-0008',
    areaCode: '350681',
    areaName: '龙海区',
    objectTypeId: '4',
    objectTypeName: '街道',
    managerId: 'u3',
    managerName: '王五',
    managerPhone: '13800138003',
    relatedId: 'r4',
    relatedName: '长泰区武安镇综治办',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u1',
    createByName: '张三',
    createTime: '2025-01-25 10:44:29',
    updateBy: 'u1',
    updateByName: '张三',
    updateTime: '2025-02-25 13:27:51',
    changeLog: '初始化创建；'
  },
  {
    id: '9',
    objectName: '长泰区网格单元9',
    objectCode: 'OBJ-0009',
    areaCode: '350625',
    areaName: '长泰区',
    objectTypeId: '1',
    objectTypeName: '网格',
    managerId: 'u4',
    managerName: '赵六',
    managerPhone: '13800138004',
    relatedId: 'r1',
    relatedName: '芗城区XX街道第一网格',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u2',
    createByName: '李四',
    createTime: '2025-01-28 16:19:38',
    updateBy: 'u3',
    updateByName: '王五',
    updateTime: '2025-02-26 10:43:12',
    changeLog: '初始化创建；'
  },
  {
    id: '10',
    objectName: '漳浦县部门单元10',
    objectCode: 'OBJ-0010',
    areaCode: '350623',
    areaName: '漳浦县',
    objectTypeId: '2',
    objectTypeName: '部门',
    managerId: 'u5',
    managerName: '孙七',
    managerPhone: '13800138005',
    relatedId: 'r2',
    relatedName: '龙文区城市管理局',
    statusId: 's2',
    statusName: '停用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-02-01 09:58:44',
    updateBy: 'u4',
    updateByName: '赵六',
    updateTime: '2025-02-27 15:36:20',
    changeLog: '初始化创建；停用操作；'
  },
  {
    id: '11',
    objectName: '芗城区社区单元11',
    objectCode: 'OBJ-0011',
    areaCode: '350602',
    areaName: '芗城区',
    objectTypeId: '3',
    objectTypeName: '社区',
    managerId: 'u1',
    managerName: '张三',
    managerPhone: '13800138001',
    relatedId: 'r3',
    relatedName: '龙海区石码镇便民服务中心',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u5',
    createByName: '孙七',
    createTime: '2025-02-03 11:27:51',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-02-28 14:58:33',
    changeLog: '初始化创建；'
  },
  {
    id: '12',
    objectName: '龙文区街道单元12',
    objectCode: 'OBJ-0012',
    areaCode: '350603',
    areaName: '龙文区',
    objectTypeId: '4',
    objectTypeName: '街道',
    managerId: 'u2',
    managerName: '李四',
    managerPhone: '13800138002',
    relatedId: 'r4',
    relatedName: '长泰区武安镇综治办',
    statusId: 's2',
    statusName: '停用',
    createBy: 'u1',
    createByName: '张三',
    createTime: '2025-02-05 13:49:22',
    updateBy: 'u2',
    updateByName: '李四',
    updateTime: '2025-03-01 09:47:15',
    changeLog: '初始化创建；区域调整；停用操作；'
  },
  {
    id: '13',
    objectName: '龙海区网格单元13',
    objectCode: 'OBJ-0013',
    areaCode: '350681',
    areaName: '龙海区',
    objectTypeId: '1',
    objectTypeName: '网格',
    managerId: 'u3',
    managerName: '王五',
    managerPhone: '13800138003',
    relatedId: 'r1',
    relatedName: '芗城区XX街道第一网格',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u2',
    createByName: '李四',
    createTime: '2025-02-07 15:12:36',
    updateBy: 'u3',
    updateByName: '王五',
    updateTime: '2025-03-02 11:23:48',
    changeLog: '初始化创建；'
  },
  {
    id: '14',
    objectName: '长泰区部门单元14',
    objectCode: 'OBJ-0014',
    areaCode: '350625',
    areaName: '长泰区',
    objectTypeId: '2',
    objectTypeName: '部门',
    managerId: 'u4',
    managerName: '赵六',
    managerPhone: '13800138004',
    relatedId: 'r2',
    relatedName: '龙文区城市管理局',
    statusId: 's1',
    statusName: '启用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-02-09 08:30:11',
    updateBy: 'u4',
    updateByName: '赵六',
    updateTime: '2025-03-03 16:42:59',
    changeLog: '初始化创建；负责人变更；'
  },
  {
    id: '15',
    objectName: '漳浦县社区单元15',
    objectCode: 'OBJ-0015',
    areaCode: '350623',
    areaName: '漳浦县',
    objectTypeId: '3',
    objectTypeName: '社区',
    managerId: 'u5',
    managerName: '孙七',
    managerPhone: '13800138005',
    relatedId: 'r3',
    relatedName: '龙海区石码镇便民服务中心',
    statusId: 's2',
    statusName: '停用',
    createBy: 'u4',
    createByName: '赵六',
    createTime: '2025-02-12 17:05:48',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-03-04 10:31:27',
    changeLog: '初始化创建；停用操作；'
  }
];

/** 表单配置（新增/编辑） */
export function useFormSchema() {
  return [
    {
      fieldName: 'objectName',
      label: '对象名称',
      component: 'Input',
      componentProps: { placeholder: '请输入对象名称' },
      rules: 'required'
    },
    {
      fieldName: 'objectCode',
      label: '对象编码',
      component: 'Input',
      componentProps: { placeholder: '请输入对象编码' },
      rules: 'required'
    },
    {
      fieldName: 'areaCode',
      label: '所属区域',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属区域',
        options: areaList.map(a => ({ label: a.name, value: a.code }))
      },
      rules: 'required'
    },
    {
      fieldName: 'objectTypeId',
      label: '对象类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择对象类型',
        options: objectTypeList.map(t => ({ label: t.name, value: t.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'managerId',
      label: '负责人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择负责人',
        options: userList.map(u => ({ label: u.name, value: u.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'managerPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: { placeholder: '请输入联系电话' },
      rules: 'required|phone'
    },
    {
      fieldName: 'relatedId',
      label: '关联网格/部门',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联网格/部门',
        options: relatedObjectList.map(r => ({ label: r.name, value: r.id }))
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
      rules: 'required',
      defaultValue: 's1' // 默认启用
    }
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'objectName',
      title: '对象名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'objectName' }
    },
    {
      field: 'objectCode',
      title: '对象编码',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'areaName',
      title: '所属区域',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'objectTypeName',
      title: '对象类型',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'managerName',
      title: '负责人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'managerPhone',
      title: '联系电话',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'relatedName',
      title: '关联网格/部门',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'statusName',
      title: '状态',
      minWidth: 100,
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
      field: 'updateByName',
      title: '更新人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 160,
      sortable: true
    },
    {
      field: 'changeLog',
      title: '变更日志',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.changeLog?.substring(0, 50) + (row.changeLog?.length > 50 ? '...' : '')
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

export const textObj = {
  editText: '编辑评价对象',
  addText: '新增评价对象',
  excelName: '评价对象列表',
  excelAllName: '评价对象数据.xlsx',
  total: '总计：对象数量15；启用对象9；停用对象6',
};
