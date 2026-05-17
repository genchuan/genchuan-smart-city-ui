import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 套牌管控表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      plateNo: '闽C12345',
      identifyTime: 1745011815000,
      matchScene: '同牌多停',
      status: '未处理',
      stationId: 1,
      stationName: '充电站1',
      handleUserId: null,
      handleUserName: null,
      handleTime: null,
      handleProgress: null,
      ignoreReason: null,
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745011815000,
      updater: '张三',
      updateTime: 1745011815000,
    },
    {
      id: 2,
      plateNo: '闽C67890',
      identifyTime: 1744998615000,
      matchScene: '车牌车型不匹配',
      status: '处理中',
      stationId: 2,
      stationName: '充电站2',
      handleUserId: 1,
      handleUserName: '张三',
      handleTime: 1745015730000,
      handleProgress: '已联系车主，等待核实',
      ignoreReason: null,
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1744998615000,
      updater: '李四',
      updateTime: 1745015730000,
    },
    {
      id: 3,
      plateNo: '闽C11111',
      identifyTime: 1744925415000,
      matchScene: '同牌多停',
      status: '已关闭',
      stationId: 3,
      stationName: '充电站3',
      handleUserId: 2,
      handleUserName: '李四',
      handleTime: 1744968615000,
      handleProgress: '已核实，确认套牌',
      ignoreReason: null,
      remark: '已处理完成',
      isCorrected: false,
      creator: 'admin',
      createTime: 1744925415000,
      updater: '王五',
      updateTime: 1744968615000,
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'status',
      label: '处置状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置状态',
        options: [
          { label: '未处理', value: '未处理' },
          { label: '处理中', value: '处理中' },
          { label: '已关闭', value: '已关闭' },
        ],
      },
    },
    {
      fieldName: 'stationName',
      label: '场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入场站',
      },
    },
    {
      fieldName: 'identifyTime',
      label: '时间范围',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择时间范围',
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 忽略表单配置 */
export function useIgnoreFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'ignoreReason',
      label: '忽略理由',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入忽略理由（至少10个字）',
        minlength: 10,
      },
      rules: [
        { required: true, message: '请输入忽略理由' },
        { min: 10, message: '忽略理由至少10个字' },
      ],
    },
  ];
}

/** 更新进度表单配置 */
export function useUpdateProgressFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'handleProgress',
      label: '处置进度',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入处置进度',
      },
      rules: 'required',
    },
  ];
}

/** 补录表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
      },
      rules: 'required',
    },
    {
      fieldName: 'identifyTime',
      label: '识别时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择识别时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      rules: 'required',
    },
    {
      fieldName: 'matchScene',
      label: '匹配场景',
      component: 'Select',
      componentProps: {
        placeholder: '请选择匹配场景',
        options: [
          { label: '同牌多停', value: '同牌多停' },
          { label: '车牌车型不匹配', value: '车牌车型不匹配' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [
          { label: '充电站1', value: 1 },
          { label: '充电站2', value: 2 },
          { label: '充电站3', value: 3 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 3,
      },
    },
  ];
}

/** 审核表单配置 */
export function useAuditFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'auditResult',
      label: '审核结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核结果',
        options: [
          { label: '通过', value: 'pass' },
          { label: '驳回', value: 'reject' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'auditOpinion',
      label: '审核意见',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入审核意见（必填）',
      },
      rules: [
        { required: true, message: '审核意见必填' },
        { min: 1, message: '审核意见不能为空' },
      ],
    },
  ];
}

/** 修正表单配置 */
export function useCorrectFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'plateNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
      },
      rules: 'required',
    },
    {
      fieldName: 'parkingSpot',
      label: '车位',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位',
      },
      rules: 'required',
    },
    {
      fieldName: 'area',
      label: '片区',
      component: 'Input',
      componentProps: {
        placeholder: '请输入片区',
      },
      rules: 'required',
    },
  ];
}

/** 核查表单配置 */
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'id',
      label: 'ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择核查结果',
        options: [
          { label: '确认套牌', value: '确认套牌' },
          { label: '误判', value: '误判' },
          { label: '需进一步核实', value: '需进一步核实' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'checkRemark',
      label: '核查备注',
      component: 'Textarea',
      componentProps: {
        rows: 4,
        placeholder: '请输入核查备注',
      },
      rules: 'required',
    },
  ];
}

/** 套牌管控表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '管控ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'identifyTime',
      title: '识别时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'matchScene',
      title: '匹配场景',
      minWidth: 140,
      sortable: true,
      slots: { default: 'matchScene' },
    },
    {
      field: 'status',
      title: '处置状态',
      minWidth: 120,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 120,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'handleUserName',
      title: '处置人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'handleUserName' },
    },
    {
      field: 'handleTime',
      title: '处置时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'handleProgress',
      title: '处置进度',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'updater',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'updater' },
    },
    {
      field: 'updateTime',
      title: '操作时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'updateTime' },
    },
    {
      field: 'isCorrected',
      title: '修正记录',
      minWidth: 100,
      sortable: true,
      slots: { default: 'correctionMark' },
    },
    {
      title: '操作',
      width: 250,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑套牌管控',
  addText: '新增套牌管控',
  excelName: '套牌管控列表',
  excelAllName: '套牌管控数据.xlsx',
  total: '总计: 套牌记录3条; 未处理1条; 处理中1条; 已关闭1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  未处理: 'danger',
  处理中: 'warning',
  已关闭: 'success',
};

/** 匹配场景类型映射 */
export const matchSceneTypeMap = {
  同牌多停: 'warning',
  车牌车型不匹配: 'danger',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '管控ID' },
  { key: 'plateNo', label: '车牌号' },
  { key: 'identifyTime', label: '识别时间', formatter: formatTime },
  { key: 'matchScene', label: '匹配场景' },
  { key: 'status', label: '处置状态' },
  { key: 'stationName', label: '场站' },
  { key: 'handleUserName', label: '处置人' },
  { key: 'handleTime', label: '处置时间', formatter: formatTime },
  { key: 'handleProgress', label: '处置进度' },
  { key: 'ignoreReason', label: '忽略理由' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'isCorrected', label: '修正记录' },
];
