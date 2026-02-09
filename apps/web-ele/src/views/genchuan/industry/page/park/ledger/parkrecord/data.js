/** 停车场入场记录的搜索表单（适配最新表格字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'targetBerthNo', // 对应表格targetBerthNo字段
      label: '泊位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位编号',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'carNumber', // 对应表格carNumber字段
      label: '车牌号',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入车牌号',
      },
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        valueFormat: 'x', // 输出时间戳（毫秒级）
        style: { width: '100%' },
      },
      fieldName: 'entryTime', // 入场时间范围（后缀加Range区分单值）
      label: '入场时间',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        valueFormat: 'x', // 输出时间戳（毫秒级）
        style: { width: '100%' },
      },
      fieldName: 'exitTime', // 出场时间范围（后缀加Range区分单值）
      label: '出场时间',
    },
  ];
}
/** 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'targetBerthNo',
      title: '泊位编号',
      minWidth: 200,
      sortable: true,
      slots: { default: 'targetBerthNo' },
    },
    {
      field: 'carNumber',
      title: '车牌',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'entryTime',
      title: '入场时间',
      minWidth: 150,
      sortable: true,
      slots: { default: 'entryTime' },
    },
    {
      field: 'exitTime',
      title: '出场时间',
      minWidth: 150,
      sortable: true,
      slots: { default: 'exitTime' },
    },

    {
      title: '操作',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '',
  addText: '',
  excelName: '',
  excelAllName: '全市停车场数据.xlsx',
  total: '停车场数量10;车位总数:1211;车场车位7',
};
