/** 分账规则管理表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 100,
      sortable: true,
    },
    // {
    //   field: 'partnerId',
    //   title: '合作方ID',
    //   minWidth: 120,
    //   sortable: true,
    // },
    {
      field: 'partnerName',
      title: '合作方名称',
      minWidth: 160,
      sortable: true,
    },
    {
      field: 'splitMode',
      title: '分账模式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'splitMode' },
    },
    {
      field: 'rateValue',
      title: '比例值(%)',
      minWidth: 120,
      sortable: true,
      customRender: ({ text }) => `${text || 0}%`,
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'auditorName',
      title: '审核人',
      minWidth: 120,
      sortable: true,
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