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

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      carType: '小型车',
      carColor: '白色',
      phone: '138****1234',
      registerTime: 1745011815000,
      status: '待审核',
      stationId: 1,
      auditUserId: null,
      auditTime: null,
      auditComment: null,
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745011815000,
      updater: '张三',
      updateTime: 1745011815000,
    },
    {
      id: 2,
      carType: '中型车',
      carColor: '黑色',
      phone: '139****5678',
      registerTime: 1745015730000,
      status: '已通过',
      stationId: 2,
      auditUserId: 1,
      auditTime: 1745015730000,
      auditComment: '信息无误，允许入场',
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745015730000,
      updater: '李四',
      updateTime: 1745015730000,
    },
    {
      id: 3,
      carType: '小型车',
      carColor: '红色',
      phone: '137****9012',
      registerTime: 1745020845000,
      status: '已驳回',
      stationId: 3,
      auditUserId: 1,
      auditTime: 1745020845000,
      auditComment: '信息不完整',
      remark: '需要补充信息',
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
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车辆类型',
        options: [
          { label: '小型车', value: '小型车' },
          { label: '中型车', value: '中型车' },
          { label: '大型车', value: '大型车' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'carColor',
      label: '车辆颜色',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆颜色',
      },
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
      },
    },
    {
      fieldName: 'status',
      label: '审核状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核状态',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
        ],
      },
    },
    // {
    //   fieldName: 'stationId',
    //   label: '场站',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入场站ID',
    //   },
    // },
    // {
    //   fieldName: 'auditUserId',
    //   label: '审核人ID',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入审核人ID',
    //   },
    // },
    {
      fieldName: 'registerTime',
      label: '登记时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择登记时间',
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
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车辆类型',
        options: [
          { label: '小型车', value: '小型车' },
          { label: '中型车', value: '中型车' },
          { label: '大型车', value: '大型车' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'carColor',
      label: '车辆颜色',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆颜色',
      },
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
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
      fieldName: 'auditResult',
      label: '审核结果',
      component: 'Select',
      componentProps: {
        placeholder: '请选择审核结果',
        options: [
          { label: '通过', value: '通过' },
          { label: '驳回', value: '驳回' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'auditComment',
      label: '审核意见',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入审核意见',
        rows: 3,
      },
    },
  ];
}

/** 修正表单配置 */
export function useCorrectFormSchema() {
  return [
    {
      fieldName: 'carType',
      label: '车辆类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车辆类型',
        options: [
          { label: '小型车', value: '小型车' },
          { label: '中型车', value: '中型车' },
          { label: '大型车', value: '大型车' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'carColor',
      label: '车辆颜色',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车辆颜色',
      },
    },
    {
      fieldName: 'phone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话',
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

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'carType',
      title: '车辆类型',
      minWidth: 100,
      sortable: true,
      slots: { default: 'carType' },
    },
    {
      field: 'carColor',
      title: '车辆颜色',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'phone',
      title: '联系电话',
      minWidth: 120,
      sortable: true,
      slots: { default: 'phone' },
    },
    {
      field: 'registerTime',
      title: '登记时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'status',
      title: '审核状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 150,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'auditUser',
      title: '审核人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'auditUser' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'auditComment',
      title: '审核意见',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑无牌入场',
  addText: '新增无牌入场',
  excelName: '无牌入场列表',
  excelAllName: '无牌入场数据.xlsx',
  total: '总计: 无牌入场3条; 待审核1条; 已通过1条; 已驳回1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '编号' },
  { key: 'carType', label: '车辆类型' },
  { key: 'carColor', label: '车辆颜色' },
  { key: 'phone', label: '联系电话' },
  { key: 'registerTime', label: '登记时间', formatter: formatTime },
  { key: 'status', label: '审核状态' },
  { key: 'auditTime', label: '审核时间', formatter: formatTime },
  { key: 'auditComment', label: '审核意见' },
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
