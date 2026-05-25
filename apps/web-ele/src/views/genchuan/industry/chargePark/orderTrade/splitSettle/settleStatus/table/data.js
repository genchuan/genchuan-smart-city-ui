/** 分账结算核查记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '状态编号',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'billId',
      title: '关联单据',
      minWidth: 160,
      sortable: true,
      slots: { default: 'billId' },
    },
    {
      field: 'status',
      title: '结算状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'errorReason',
      title: '异常原因',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'checkerName',
      title: '核查人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'checkerName' },
    },
    {
      field: 'checkTime',
      title: '核查时间',
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