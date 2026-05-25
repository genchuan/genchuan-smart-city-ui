/** 商户对账管理表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '单据编号',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'billNo',
      title: '对账单号',
      minWidth: 160,
      sortable: true,
      slots: { default: 'billNo' },
    },
    {
      field: 'merchantName',
      title: '所属商户',
      minWidth: 160,
      sortable: true,
      slots: { default: 'merchantName' },
    },
    {
      field: 'billDate',
      title: '对账周期',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'sysAmount',
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
      field: 'diffAmount',
      title: '差异金额',
      minWidth: 120,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'status',
      title: '单据状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    /** 备注 */
    {
      field: 'remark',
      title: '差异说明',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'operatorName',
      title: '对账人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'operatorName' },
    },
    {
      field: 'confirmTime',
      title: '对账时间',
      minWidth: 200,
      sortable: true,
      customRender: ({ text }) => text || '-',
    },
    {
      field: 'createTime',
      title: '生成时间',
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