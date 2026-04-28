// charging-pile/data.js

/** 新增/编辑表单配置（不含 pileStatus，状态由后端流程控制） */
export function useFormSchema() {
  return [
    {
      fieldName: 'pileCode',
      label: '设备编号',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入设备编号' },
    },
    {
      fieldName: 'model',
      label: '型号',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入型号' },
    },
    {
      fieldName: 'power',
      label: '功率(kW)',
      component: 'InputNumber',
      rules: 'required',
      componentProps: { placeholder: '请输入功率', min: 0, precision: 2 },
    },
    {
      fieldName: 'manufacturer',
      label: '生产厂家',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入生产厂家' },
    },
    {
      fieldName: 'stationId',
      label: '所属场站',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择所属场站',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'lotId',
      label: '绑定车位',
      component: 'Select',
      componentProps: {
        placeholder: '请选择绑定车位',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'chargeMode',
      label: '充电模式',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择充电模式',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入备注', type: 'textarea', rows: 3 },
    },
  ];
}

/** 查询表单配置 */
export function useQuerySchema() {
  return [
    {
      fieldName: 'pileCode',
      label: '设备编号',
      component: 'Input',
      componentProps: { placeholder: '请输入设备编号' },
    },
    {
      fieldName: 'model',
      label: '型号',
      component: 'Input',
      componentProps: { placeholder: '请输入型号' },
    },
    {
      fieldName: 'manufacturer',
      label: '生产厂家',
      component: 'Input',
      componentProps: { placeholder: '请输入生产厂家' },
    },
    {
      fieldName: 'stationId',
      label: '所属场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属场站',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'chargeMode',
      label: '充电模式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择充电模式',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'pileStatus',
      label: '设备状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择设备状态',
        options: [],
        valueField: 'value',
        labelField: 'label',
      },
    },
    {
      fieldName: 'faultFlag',
      label: '故障标记',
      component: 'Select',
      componentProps: {
        placeholder: '请选择故障标记',
        options: [{ label: '有故障', value: true }, { label: '无故障', value: false }],
      },
    },
    {
      fieldName: 'runTime',
      label: '运行时长(小时)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入运行时长',
        min: 0,
        precision: 2,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    { field: 'pileCode', title: '设备编号', minWidth: 150, sortable: true, slots: { default: 'pileCode' } },
    { field: 'model', title: '型号', minWidth: 120, sortable: true, slots: { default: 'model' } },
    { field: 'power', title: '功率(kW)', minWidth: 100, sortable: true },
    { field: 'manufacturer', title: '生产厂家', minWidth: 150, sortable: true, slots: { default: 'manufacturer' } },
    { field: 'stationName', title: '所属场站', minWidth: 150, sortable: true, slots: { default: 'stationName' } },
    { field: 'lotName', title: '绑定车位', minWidth: 120, sortable: true, slots: { default: 'lotName' } },
    { field: 'chargeModeName', title: '充电模式', minWidth: 100, sortable: true, slots: { default: 'chargeMode' } },
    { field: 'pileStatusName', title: '设备状态', minWidth: 100, sortable: true, slots: { default: 'pileStatus' } },
    { field: 'faultFlag', title: '故障标记', minWidth: 100, sortable: true, slots: { default: 'faultFlag' } },
    { field: 'runTime', title: '运行时长(小时)', minWidth: 120, align: 'center', sortable: true },
    { field: 'qrcode', title: '充电枪二维码', minWidth: 120, slots: { default: 'qrcode' } },
    { field: 'remark', title: '备注', minWidth: 150, showOverflow: true },
    { field: 'creator', title: '创建人', minWidth: 100, sortable: true },
    { field: 'createTime', title: '创建时间', minWidth: 160, sortable: true },
    { field: 'updater', title: '更新人', minWidth: 100, sortable: true },
    { field: 'updateTime', title: '更新时间', minWidth: 160, sortable: true },
    { title: '操作', width: 220, fixed: 'right', align: 'center', slots: { default: 'actions' } },
  ];
}

/** 页面文案配置 */
export const textObj = {
  editText: '编辑充电桩',
  addText: '新增充电桩',
  excelName: '充电桩列表',
  excelAllName: '充电桩数据.xlsx',
  total: '总计：充电桩数量{total}；运行中{running}；故障{fault}；停用{disabled}',
};
