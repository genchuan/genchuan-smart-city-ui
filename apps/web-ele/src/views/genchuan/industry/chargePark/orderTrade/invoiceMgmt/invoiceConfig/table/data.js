/** 发票配置表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '配置名称',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'category',
      title: '开票类目',
      minWidth: 160,
      sortable: true,
      slots: { default: 'category' },
    },
    {
      field: 'taxRate',
      title: '税率(%)',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'taxBody',
      title: '开票主体',
      minWidth: 160,
      sortable: true,
      slots: { default: 'taxBody' },
    },
    {
      field: 'status',
      title: '配置状态',
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
      field: 'auditTime',
      title: '审核时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'totalInvoiceCount',
      title: '累计开票量',
      minWidth: 120,
      sortable: true,
      slots: { default: 'totalInvoiceCount' },
      customRender: ({ text }) => text || 0,
    },
    {
      field: 'creator',
      title: '申请人',
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
