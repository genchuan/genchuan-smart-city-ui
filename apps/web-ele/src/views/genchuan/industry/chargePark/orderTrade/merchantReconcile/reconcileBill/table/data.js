/** 商户对账管理表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'billNo',
      title: '对账单号',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'merchantName',
      title: '商户名称',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'cycle',
      title: '对账周期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'platformAmount',
      title: '平台金额',
      minWidth: 160,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'merchantAmount',
      title: '商户上报总金额',
      minWidth: 160,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    }, 
    {
      field: 'status',
      title: '对账状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    /** 备注 */
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'operatorId',
      title: '对账人ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'confirmTime',
      title: '确认时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'createTime',
      title: '创建时间',
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