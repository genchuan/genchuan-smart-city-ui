/** 状态类型映射 */
export const statusTypeMap = {
  待审批: 'warning',
  已通过: 'success',
  已驳回: 'danger',
  已执行: 'info',
};

/** 开闸原因映射 */
export const openReasonMap = {
  紧急通行: 'danger',
  故障处理: 'warning',
  其他: 'info',
};

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      stationId: 1,
      stationName: '芗城区XX社区停车场',
      openReason: '紧急通行',
      applyUserId: 1,
      applyUserName: '张三',
      applyTime: '2025-04-18 08:30:15',
      status: '待审批',
      auditUserId: null,
      auditUserName: null,
      auditTime: null,
      executeTime: null,
      rejectReason: null,
      remark: '救护车紧急通行',
      createTime: '2025-04-18 08:30:15',
    },
    {
      id: '002',
      stationId: 2,
      stationName: '龙文区碧湖公园停车场',
      openReason: '故障处理',
      applyUserId: 2,
      applyUserName: '李四',
      applyTime: '2025-04-18 09:15:30',
      status: '已通过',
      auditUserId: 1,
      auditUserName: '管理员',
      auditTime: '2025-04-18 09:30:00',
      executeTime: null,
      rejectReason: null,
      remark: '道闸故障需要手动开闸',
      createTime: '2025-04-18 09:15:30',
    },
    {
      id: '003',
      stationId: 3,
      stationName: '龙海区石码镇停车场',
      openReason: '其他',
      applyUserId: 3,
      applyUserName: '王五',
      applyTime: '2025-04-18 10:20:45',
      status: '已执行',
      auditUserId: 1,
      auditUserName: '管理员',
      auditTime: '2025-04-18 10:30:00',
      executeTime: '2025-04-18 10:35:00',
      rejectReason: null,
      remark: '特殊车辆通行',
      createTime: '2025-04-18 10:20:45',
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
    },
    {
      fieldName: 'openReason',
      label: '开闸原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开闸原因',
        options: [
          { label: '紧急通行', value: '紧急通行' },
          { label: '故障处理', value: '故障处理' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'applyUserId',
      label: '申请人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请人',
        options: [],
      },
    },
    {
      fieldName: 'applyTime',
      label: '申请时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择申请时间',
        type: 'datetimerange',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待审批', value: '待审批' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
          { label: '已执行', value: '已执行' },
        ],
      },
    },
    {
      fieldName: 'auditUserId',
      label: '审批人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审批人',
        options: [],
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 新增申请表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
      rules: [{ required: true, message: '请选择场站' }],
    },
    {
      fieldName: 'openReason',
      label: '开闸原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开闸原因',
        options: [
          { label: '紧急通行', value: '紧急通行' },
          { label: '故障处理', value: '故障处理' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: [{ required: true, message: '请选择开闸原因' }],
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
      },
    },
  ];
}

/** 重新申请表单配置 */
export function useReapplyFormSchema() {
  return [
    {
      fieldName: 'openReason',
      label: '开闸原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开闸原因',
        options: [
          { label: '紧急通行', value: '紧急通行' },
          { label: '故障处理', value: '故障处理' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: [{ required: true, message: '请选择开闸原因' }],
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '申请ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'openReason',
      title: '开闸原因',
      minWidth: 120,
      sortable: true,
      slots: { default: 'openReason' },
    },
    {
      field: 'applyUserName',
      title: '申请人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applyUserName' },
    },
    {
      field: 'applyTime',
      title: '申请时间',
      minWidth: 180,
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
      field: 'auditUserName',
      title: '审批人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'auditUserName' },
    },
    {
      field: 'auditTime',
      title: '审批时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'executeTime',
      title: '执行时间',
      minWidth: 180,
      sortable: true,
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  createText: '新增申请',
  reapplyText: '重新申请',
  excelName: '开闸管理列表',
  excelAllName: '开闸管理导出.xlsx',
  total: '总计: 申请3条; 待审批1条; 已通过1条; 已执行1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '申请ID' },
  { key: 'stationName', label: '场站' },
  { key: 'openReason', label: '开闸原因' },
  { key: 'applyUserName', label: '申请人' },
  { key: 'applyTime', label: '申请时间' },
  { key: 'status', label: '状态' },
  { key: 'auditUserName', label: '审批人' },
  { key: 'auditTime', label: '审批时间' },
  { key: 'executeTime', label: '执行时间' },
  { key: 'rejectReason', label: '驳回理由' },
  { key: 'remark', label: '备注' },
  { key: 'createTime', label: '创建时间' },
  { key: 'updateTime', label: '更新时间' },
];
