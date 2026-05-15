import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 处置状态类型映射 */
export const statusTypeMap = {
  未处理: 'danger',
  处理中: 'warning',
  已关闭: 'success',
};

/** 异常类型映射 */
export const abnormalTypeMap = {
  逃费离场: 'danger',
  道闸故障离场: 'warning',
  无牌车离场: 'info',
  其他: 'default',
};

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      plateNo: '闽E12345',
      abnormalType: '逃费离场',
      identifyTime: 1745011815000,
      status: '未处理',
      stationName: '芗城区XX社区停车场',
      stationId: 1,
      handleUserName: null,
      handleUserId: null,
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
      id: '002',
      plateNo: '闽E67890',
      abnormalType: '道闸故障离场',
      identifyTime: 1745015730000,
      status: '处理中',
      stationName: '龙文区碧湖公园停车场',
      stationId: 2,
      handleUserName: '张三',
      handleUserId: 1,
      handleTime: 1745015730000,
      handleProgress: '已联系车主，等待补缴',
      ignoreReason: null,
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745015730000,
      updater: '李四',
      updateTime: 1745015730000,
    },
    {
      id: '003',
      plateNo: '闽E11111',
      abnormalType: '无牌车离场',
      identifyTime: 1745020845000,
      status: '已关闭',
      stationName: '龙海区石码镇停车场',
      stationId: 3,
      handleUserName: '李四',
      handleUserId: 2,
      handleTime: 1745020845000,
      handleProgress: '已完成处置',
      ignoreReason: null,
      remark: '已处理完成',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745020845000,
      updater: '王五',
      updateTime: 1745020845000,
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌',
      },
    },
    {
      fieldName: 'abnormalType',
      label: '异常类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择异常类型',
        options: [
          { label: '逃费离场', value: '逃费离场' },
          { label: '道闸故障离场', value: '道闸故障离场' },
          { label: '无牌车离场', value: '无牌车离场' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'identifyTime',
      label: '识别时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择识别时间',
        type: 'datetimerange',
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
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
    },
    {
      fieldName: 'handleUserId',
      label: '处置人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置人',
        options: [],
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 核查表单配置 */
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入核查结果',
        rows: 4,
      },
      rules: [{ required: true, message: '请输入核查结果' }],
    },
    {
      fieldName: 'checkRemark',
      label: '核查备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入核查备注',
        rows: 3,
      },
    },
  ];
}

/** 更新进度表单配置 */
export function useUpdateProgressFormSchema() {
  return [
    {
      fieldName: 'handleProgress',
      label: '处置进度',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入处置进度',
        rows: 4,
      },
      rules: [{ required: true, message: '请输入处置进度' }],
    },
    {
      fieldName: 'progressRemark',
      label: '进度备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入进度备注',
        rows: 3,
      },
    },
  ];
}

/** 批量处置表单配置 */
export function useBatchHandleFormSchema() {
  return [
    {
      fieldName: 'handleType',
      label: '处置类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置类型',
        options: [
          { label: '核查', value: '核查' },
          { label: '忽略', value: '忽略' },
        ],
      },
      rules: [{ required: true, message: '请选择处置类型' }],
    },
    {
      fieldName: 'handleRemark',
      label: '处置备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入处置备注',
        rows: 4,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '离场ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'abnormalType',
      title: '异常类型',
      minWidth: 130,
      sortable: true,
      slots: { default: 'abnormalType' },
    },
    {
      field: 'identifyTime',
      title: '识别时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'status',
      title: '处置状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 180,
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
      field: 'isCorrected',
      title: '修正记录标记',
      minWidth: 120,
      sortable: true,
      slots: { default: 'correctionMark' },
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
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  checkText: '核查异常',
  updateProgressText: '更新进度',
  batchHandleText: '批量处置',
  excelName: '异常离场列表',
  excelAllName: '异常离场导出.xlsx',
  total: '总计: 异常记录3条; 未处理1条; 处理中1条; 已关闭1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '离场ID' },
  { key: 'plateNo', label: '车牌' },
  { key: 'abnormalType', label: '异常类型' },
  { key: 'identifyTime', label: '识别时间', formatter: formatTime },
  { key: 'status', label: '处置状态' },
  { key: 'stationName', label: '场站' },
  { key: 'handleUserName', label: '处置人' },
  { key: 'handleTime', label: '处置时间', formatter: formatTime },
  { key: 'handleProgress', label: '处置进度' },
  { key: 'ignoreReason', label: '忽略理由' },
  { key: 'remark', label: '备注' },
  {
    key: 'isCorrected',
    label: '修正记录标记',
    formatter: (val) => (val ? '已修正' : '未修正'),
  },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
];
