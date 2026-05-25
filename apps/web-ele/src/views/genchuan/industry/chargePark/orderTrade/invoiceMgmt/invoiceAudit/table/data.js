/** 发票申请审核记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '审核编号',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'invoiceNo',
      title: '关联申请',
      minWidth: 160,
      sortable: true,
      slots: { default: 'invoiceNo' },
    },
    {
      field: 'applicantName',
      title: '申请人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'applicantName' },
    },
    {
      field: 'status',
      title: '审核状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'auditorName' },
    },
    {
      field: 'auditResult',
      title: '审核结果',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'applyTime',
      title: '申请时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'creator',
      title: '创建者',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}