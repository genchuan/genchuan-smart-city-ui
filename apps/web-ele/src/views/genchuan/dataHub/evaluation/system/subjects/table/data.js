/** 评价主体管理 - 模拟数据及配置 */

// 模拟用户（负责人/创建人/更新人）
export const userList = [
  { id: 'u1', name: '张三', phone: '13800138001' },
  { id: 'u2', name: '李四', phone: '13800138002' },
  { id: 'u3', name: '王五', phone: '13800138003' },
  { id: 'u4', name: '赵六', phone: '13800138004' },
  { id: 'u5', name: '孙七', phone: '13800138005' },
  { id: 'u6', name: '周八', phone: '13800138006' },
  { id: 'u7', name: '吴九', phone: '13800138007' },
];

// 模拟主体类型
export const subjectTypeList = [
  { id: '1', name: '人工主体' },
  { id: '2', name: '系统主体' },
];

// 模拟状态字典（启用/停用）
export const statusList = [
  { id: 's1', name: '启用' },
  { id: 's2', name: '停用' },
];

// 模拟成员关系数据（主体-用户）
const subjectMembers = [
  { subjectId: '1', userId: 'u1', joinTime: '2025-01-01', status: 's1' },
  { subjectId: '1', userId: 'u2', joinTime: '2025-01-01', status: 's1' },
  { subjectId: '1', userId: 'u3', joinTime: '2025-01-01', status: 's1' },
  { subjectId: '2', userId: 'u4', joinTime: '2025-01-02', status: 's1' },
  { subjectId: '2', userId: 'u5', joinTime: '2025-01-02', status: 's1' },
  { subjectId: '3', userId: 'u6', joinTime: '2025-01-03', status: 's1' },
  { subjectId: '4', userId: 'u7', joinTime: '2025-01-04', status: 's1' },
  { subjectId: '4', userId: 'u1', joinTime: '2025-01-04', status: 's1' },
  { subjectId: '5', userId: 'u2', joinTime: '2025-01-05', status: 's1' },
  { subjectId: '5', userId: 'u3', joinTime: '2025-01-05', status: 's1' },
  { subjectId: '5', userId: 'u4', joinTime: '2025-01-05', status: 's1' },
  { subjectId: '6', userId: 'u5', joinTime: '2025-01-06', status: 's1' },
  { subjectId: '7', userId: 'u6', joinTime: '2025-01-07', status: 's1' },
  { subjectId: '8', userId: 'u7', joinTime: '2025-01-08', status: 's1' },
  { subjectId: '9', userId: 'u1', joinTime: '2025-01-09', status: 's1' },
  { subjectId: '10', userId: 'u2', joinTime: '2025-01-10', status: 's1' },
  { subjectId: '11', userId: 'u3', joinTime: '2025-01-11', status: 's1' },
  { subjectId: '12', userId: 'u4', joinTime: '2025-01-12', status: 's1' },
  { subjectId: '13', userId: 'u5', joinTime: '2025-01-13', status: 's1' },
  { subjectId: '14', userId: 'u6', joinTime: '2025-01-14', status: 's1' },
  { subjectId: '15', userId: 'u7', joinTime: '2025-01-15', status: 's1' },
];

// 辅助函数：获取主体的成员名字列表
function getMemberNames(subjectId) {
  const memberUserIds = subjectMembers.filter(m => m.subjectId === subjectId).map(m => m.userId);
  return memberUserIds.map(id => userList.find(u => u.id === id)?.name).filter(Boolean).join('、');
}
function getMemberCount(subjectId) {
  return subjectMembers.filter(m => m.subjectId === subjectId).length;
}

/** 评价主体列表数据 - 静态固定数据（共15条，启用9条，停用6条） */
export const subjectList = () => [
  {
    id: '1',
    name: '专家评审组A',
    code: 'SUBJ-0001',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u1',
    contactName: '张三',
    contactPhone: '13800138001',
    memberCount: getMemberCount('1'),
    memberNames: getMemberNames('1'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u1',
    createByName: '张三',
    createTime: '2025-01-05 09:12:34',
    updateBy: 'u2',
    updateByName: '李四',
    updateTime: '2025-02-10 14:23:45',
    changeLog: '初始化创建；负责人变更；',
    useCount: 5,
  },
  {
    id: '2',
    name: '街道评价工作组',
    code: 'SUBJ-0002',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u2',
    contactName: '李四',
    contactPhone: '13800138002',
    memberCount: getMemberCount('2'),
    memberNames: getMemberNames('2'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-01-08 10:05:21',
    updateBy: 'u3',
    updateByName: '王五',
    updateTime: '2025-02-12 09:30:12',
    changeLog: '初始化创建；',
    useCount: 3,
  },
  {
    id: '3',
    name: '第三方测评机构B',
    code: 'SUBJ-0003',
    subjectTypeId: '2',
    subjectTypeName: '系统主体',
    contactId: 'u3',
    contactName: '王五',
    contactPhone: '13800138003',
    memberCount: getMemberCount('3'),
    memberNames: getMemberNames('3'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u4',
    createByName: '赵六',
    createTime: '2025-01-12 11:30:47',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-02-15 16:42:58',
    changeLog: '初始化创建；区域调整；',
    useCount: 8,
  },
  {
    id: '4',
    name: '网格员考核组',
    code: 'SUBJ-0004',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u4',
    contactName: '赵六',
    contactPhone: '13800138004',
    memberCount: getMemberCount('4'),
    memberNames: getMemberNames('4'),
    statusId: 's2',
    statusName: '停用',
    createBy: 'u5',
    createByName: '孙七',
    createTime: '2025-01-15 08:45:13',
    updateBy: 'u1',
    updateByName: '张三',
    updateTime: '2025-02-18 10:15:39',
    changeLog: '初始化创建；停用操作；',
    useCount: 2,
  },
  {
    id: '5',
    name: '数据采集系统',
    code: 'SUBJ-0005',
    subjectTypeId: '2',
    subjectTypeName: '系统主体',
    contactId: 'u5',
    contactName: '孙七',
    contactPhone: '13800138005',
    memberCount: getMemberCount('5'),
    memberNames: getMemberNames('5'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u2',
    createByName: '李四',
    createTime: '2025-01-18 13:22:56',
    updateBy: 'u2',
    updateByName: '李四',
    updateTime: '2025-02-20 11:38:24',
    changeLog: '初始化创建；',
    useCount: 12,
  },
  {
    id: '6',
    name: '社区评议小组',
    code: 'SUBJ-0006',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u1',
    contactName: '张三',
    contactPhone: '13800138001',
    memberCount: getMemberCount('6'),
    memberNames: getMemberNames('6'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-01-20 09:05:17',
    updateBy: 'u4',
    updateByName: '赵六',
    updateTime: '2025-02-22 15:50:33',
    changeLog: '初始化创建；负责人变更；',
    useCount: 4,
  },
  {
    id: '7',
    name: '部门绩效评审',
    code: 'SUBJ-0007',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u2',
    contactName: '李四',
    contactPhone: '13800138002',
    memberCount: getMemberCount('7'),
    memberNames: getMemberNames('7'),
    statusId: 's2',
    statusName: '停用',
    createBy: 'u4',
    createByName: '赵六',
    createTime: '2025-01-22 14:38:42',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-02-24 09:12:07',
    changeLog: '初始化创建；停用操作；',
    useCount: 1,
  },
  {
    id: '8',
    name: '自动化评分引擎',
    code: 'SUBJ-0008',
    subjectTypeId: '2',
    subjectTypeName: '系统主体',
    contactId: 'u3',
    contactName: '王五',
    contactPhone: '13800138003',
    memberCount: getMemberCount('8'),
    memberNames: getMemberNames('8'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u1',
    createByName: '张三',
    createTime: '2025-01-25 10:44:29',
    updateBy: 'u1',
    updateByName: '张三',
    updateTime: '2025-02-25 13:27:51',
    changeLog: '初始化创建；',
    useCount: 9,
  },
  {
    id: '9',
    name: '物业考评组',
    code: 'SUBJ-0009',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u4',
    contactName: '赵六',
    contactPhone: '13800138004',
    memberCount: getMemberCount('9'),
    memberNames: getMemberNames('9'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u2',
    createByName: '李四',
    createTime: '2025-01-28 16:19:38',
    updateBy: 'u3',
    updateByName: '王五',
    updateTime: '2025-02-26 10:43:12',
    changeLog: '初始化创建；',
    useCount: 6,
  },
  {
    id: '10',
    name: '区级评审委员会',
    code: 'SUBJ-0010',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u5',
    contactName: '孙七',
    contactPhone: '13800138005',
    memberCount: getMemberCount('10'),
    memberNames: getMemberNames('10'),
    statusId: 's2',
    statusName: '停用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-02-01 09:58:44',
    updateBy: 'u4',
    updateByName: '赵六',
    updateTime: '2025-02-27 15:36:20',
    changeLog: '初始化创建；停用操作；',
    useCount: 3,
  },
  {
    id: '11',
    name: '数据质检系统',
    code: 'SUBJ-0011',
    subjectTypeId: '2',
    subjectTypeName: '系统主体',
    contactId: 'u1',
    contactName: '张三',
    contactPhone: '13800138001',
    memberCount: getMemberCount('11'),
    memberNames: getMemberNames('11'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u5',
    createByName: '孙七',
    createTime: '2025-02-03 11:27:51',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-02-28 14:58:33',
    changeLog: '初始化创建；',
    useCount: 7,
  },
  {
    id: '12',
    name: '街道联合督查组',
    code: 'SUBJ-0012',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u2',
    contactName: '李四',
    contactPhone: '13800138002',
    memberCount: getMemberCount('12'),
    memberNames: getMemberNames('12'),
    statusId: 's2',
    statusName: '停用',
    createBy: 'u1',
    createByName: '张三',
    createTime: '2025-02-05 13:49:22',
    updateBy: 'u2',
    updateByName: '李四',
    updateTime: '2025-03-01 09:47:15',
    changeLog: '初始化创建；区域调整；停用操作；',
    useCount: 2,
  },
  {
    id: '13',
    name: '网格事件研判组',
    code: 'SUBJ-0013',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u3',
    contactName: '王五',
    contactPhone: '13800138003',
    memberCount: getMemberCount('13'),
    memberNames: getMemberNames('13'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u2',
    createByName: '李四',
    createTime: '2025-02-07 15:12:36',
    updateBy: 'u3',
    updateByName: '王五',
    updateTime: '2025-03-02 11:23:48',
    changeLog: '初始化创建；',
    useCount: 4,
  },
  {
    id: '14',
    name: '自动报告生成器',
    code: 'SUBJ-0014',
    subjectTypeId: '2',
    subjectTypeName: '系统主体',
    contactId: 'u4',
    contactName: '赵六',
    contactPhone: '13800138004',
    memberCount: getMemberCount('14'),
    memberNames: getMemberNames('14'),
    statusId: 's1',
    statusName: '启用',
    createBy: 'u3',
    createByName: '王五',
    createTime: '2025-02-09 08:30:11',
    updateBy: 'u4',
    updateByName: '赵六',
    updateTime: '2025-03-03 16:42:59',
    changeLog: '初始化创建；负责人变更；',
    useCount: 11,
  },
  {
    id: '15',
    name: '临时评议组',
    code: 'SUBJ-0015',
    subjectTypeId: '1',
    subjectTypeName: '人工主体',
    contactId: 'u5',
    contactName: '孙七',
    contactPhone: '13800138005',
    memberCount: getMemberCount('15'),
    memberNames: getMemberNames('15'),
    statusId: 's2',
    statusName: '停用',
    createBy: 'u4',
    createByName: '赵六',
    createTime: '2025-02-12 17:05:48',
    updateBy: 'u5',
    updateByName: '孙七',
    updateTime: '2025-03-04 10:31:27',
    changeLog: '初始化创建；停用操作；',
    useCount: 0,
  }
];

/** 表单配置（新增/编辑） */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '主体名称',
      component: 'Input',
      componentProps: { placeholder: '请输入主体名称' },
      rules: 'required'
    },
    {
      fieldName: 'code',
      label: '主体编码',
      component: 'Input',
      componentProps: { placeholder: '请输入主体编码' },
      rules: 'required'
    },
    {
      fieldName: 'subjectTypeId',
      label: '主体类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择主体类型',
        options: subjectTypeList.map(t => ({ label: t.name, value: t.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'contactId',
      label: '联系人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择联系人',
        options: userList.map(u => ({ label: u.name, value: u.id }))
      },
      rules: 'required'
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '由联系人自动带出',
        disabled: true,
        readonly: true
      },
      rules: 'required|phone'
    },
    {
      fieldName: 'memberIds',
      label: '成员列表',
      component: 'Select',
      componentProps: {
        placeholder: '请选择成员（仅人工主体可选）',
        options: userList.map(u => ({ label: u.name, value: u.id })),
        multiple: true,
        filterable: true,
        clearable: true
      },
      // 规则通过动态控制，见index.vue中的onOpenChange
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
      field: 'name',
      title: '主体名称',
      minWidth: 150,
      sortable: true,
      slots: { default: 'name' }
    },
    {
      field: 'code',
      title: '主体编码',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'subjectTypeName',
      title: '主体类型',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'contactName',
      title: '联系人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'memberNames',
      title: '成员列表',
      minWidth: 200,
      sortable: false,
      formatter: (row) => row.memberNames || '-'
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
      field: 'memberCount',
      title: '成员数量',
      minWidth: 100,
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
      field: 'useCount',
      title: '使用次数',
      minWidth: 100,
      sortable: true
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
  editText: '编辑评价主体',
  addText: '新增评价主体',
  excelName: '评价主体列表',
  excelAllName: '评价主体数据.xlsx',
  total: '总计：主体数量15；启用9；停用6',
};
