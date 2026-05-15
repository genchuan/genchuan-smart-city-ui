/** 对账明细管理表格列配置 */
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
      field: 'orderNo',
      title: '订单编号',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'sysAmount',
      title: '系统金额',
      minWidth: 140,
      sortable: true,
      customRender: ({ text }) => text ? `¥${text.toFixed(2)}` : '¥0.00',
    },
    {
      field: 'merchantAmount',
      title: '商户上报金额',
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
      field: 'matchResult',
      title: '对账结果',
      minWidth: 120,
      sortable: true,
      slots: { default: 'matchResult' },
    },
    {
      field: 'diffReason',
      title: '异常原因',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'handleTime',
      title: '处理时间',
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