import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';
import { requestClient } from '#/api/request';

/** 获取场站列表 */
let stationOptionsCache = null;
export async function getStationOptions() {
  if (stationOptionsCache) {
    return stationOptionsCache;
  }
  try {
    const response = await requestClient.get('/vehiclepass/in-park-status/simple-list');
    if (response && Array.isArray(response)) {
      stationOptionsCache = response.map(item => ({
        label: item.stationName,
        value: item.stationId,
      }));
      return stationOptionsCache;
    }
    return [];
  } catch (error) {
    console.error('获取场站列表失败:', error);
    return [];
  }
}

/** 入场记录表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      plateNo: '闽E12345',
      plateColor: '蓝牌',
      spaceNo: 'A-101',
      enterTime: 1745011815000,
      recordType: '自动识别',
      status: '正常记录',
      stationId: 1,
      stationName: '充电站1',
      remark: '',
      proofImage: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745011815000,
      updater: '张三',
      updateTime: 1745011815000,
    },
    {
      id: 2,
      plateNo: '闽E67890',
      plateColor: '黄牌',
      spaceNo: 'B-205',
      enterTime: 1745015730000,
      recordType: '自动识别',
      status: '正常记录',
      stationId: 2,
      stationName: '充电站2',
      remark: '',
      proofImage: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745015730000,
      updater: '李四',
      updateTime: 1745015730000,
    },
    {
      id: 3,
      plateNo: '闽E11111',
      plateColor: '蓝牌',
      spaceNo: 'C-308',
      enterTime: 1745020845000,
      recordType: '人工补录',
      status: '异常记录',
      stationId: 3,
      stationName: '充电站3',
      remark: '车牌识别失败，人工放行',
      proofImage: '',
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
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
        ],
      },
    },
    {
      fieldName: 'stationId',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        type: 'datetimerange',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 新增表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'recordType',
      label: '记录类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录类型',
        options: [{ label: '人工补录', value: '人工补录' }],
      },
      rules: 'required',
      defaultValue: '人工补录',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
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
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'proofImage',
      label: '佐证图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入佐证图片地址',
      },
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

/** 编辑表单配置 */
export function useUpdateFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'recordType',
      label: '记录类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录类型',
        options: [
          { label: '自动识别', value: '自动识别' },
          { label: '人工补录', value: '人工补录' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
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
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'proofImage',
      label: '佐证图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入佐证图片地址',
      },
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

/** 修正表单配置 */
export function useCorrectFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入正确的车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'plateColor',
      label: '车牌颜色',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车牌颜色',
        options: [
          { label: '蓝牌', value: '蓝牌' },
          { label: '黄牌', value: '黄牌' },
          { label: '绿牌', value: '绿牌' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      label: '记录状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择记录状态',
        options: [
          { label: '正常记录', value: '正常记录' },
          { label: '异常记录', value: '异常记录' },
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
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'proofImage',
      label: '佐证图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入佐证图片地址',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入修正备注',
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
      label: '记录ID',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'plateNo',
      label: '车牌号码',
      component: 'Input',
      componentProps: { disabled: true },
    },
    {
      fieldName: 'spaceNo',
      label: '车位编号',
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

/** 入场记录表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'plateColor',
      title: '车牌颜色',
      minWidth: 100,
      sortable: true,
      slots: { default: 'plateColor' },
    },
    {
      field: 'spaceNo',
      title: '车位编号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'spaceNo' },
    },
    {
      field: 'enterTime',
      title: '入场时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'recordType',
      title: '记录类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'recordType' },
    },
    {
      field: 'status',
      title: '记录状态',
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
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑入场记录',
  addText: '补录入场记录',
  excelName: '入场记录列表',
  excelAllName: '入场记录数据.xlsx',
  total: '总计: 入场记录3条; 正常2条; 异常1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  正常记录: 'success',
  异常记录: 'danger',
};

/** 记录类型映射 */
export const recordTypeMap = {
  自动识别: 'success',
  人工补录: 'warning',
};

/** 车牌颜色类型映射 */
export const plateColorTypeMap = {
  蓝牌: 'primary',
  黄牌: 'warning',
  绿牌: 'success',
  其他: 'info',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'plateNo', label: '车牌号' },
  { key: 'plateColor', label: '车牌颜色' },
  { key: 'spaceNo', label: '车位编号' },
  { key: 'enterTime', label: '入场时间', formatter: formatTime },
  { key: 'recordType', label: '记录类型' },
  { key: 'status', label: '记录状态' },
  { key: 'stationName', label: '场站' },
  { key: 'proofImage', label: '佐证图片', type: 'image' },
  {
    key: 'isCorrected',
    label: '修正记录标记',
    formatter: (val) => (val ? '已修正' : '未修正'),
  },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
];
