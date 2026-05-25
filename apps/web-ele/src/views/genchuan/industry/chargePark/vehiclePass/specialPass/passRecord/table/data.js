import { requestClient } from '#/api/request';
import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

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
      fieldName: 'passReason',
      label: '放行原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择放行原因',
        options: [
          { label: '人工开闸', value: '人工开闸' },
          { label: '特殊车辆', value: '特殊车辆' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'passTime',
      label: '放行时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: ['开始时间', '结束时间'],
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
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
      fieldName: 'operatorId',
      label: '操作人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入操作人',
      },
    },
    // {
    //   fieldName: 'remark',
    //   label: '备注',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入备注',
    //   },
    // },
  ];
}

/** 核查表单配置 */
export function useCheckFormSchema() {
  return [
    {
      fieldName: 'checkResult',
      label: '核查结果',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入核查结果',
        rows: 4,
      },
      rules: 'required',
    },
    {
      fieldName: 'checkRemark',
      label: '核查备注',
      component: 'Input',
      componentProps: {
        type: 'textarea',
        placeholder: '请输入核查备注（选填）',
        rows: 4,
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      fixed: 'left',
      sortable: true,
    },
    {
      field: 'plateNo',
      title: '车牌',
      minWidth: 120,
      fixed: 'left',
      sortable: true,
      slots: { default: 'plateNo' },
    },
    {
      field: 'passReason',
      title: '放行原因',
      minWidth: 120,
      sortable: true,
      slots: { default: 'passReason' },
    },
    {
      field: 'passTime',
      title: '放行时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'imageUrl',
      title: '抓拍图片',
      minWidth: 120,
      sortable: true,
      slots: { default: 'imageUrl' },
    },
    {
      field: 'status',
      title: '状态',
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
      field: 'operatorName',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'operatorName' },
    },
    {
      field: 'operatorTime',
      title: '操作时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  excelName: '放行记录',
  excelAllName: '放行记录导出.xlsx',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: 'ID' },
  { key: 'plateNo', label: '车牌' },
  { key: 'passReason', label: '放行原因' },
  { key: 'passTime', label: '放行时间', formatter: formatTime },
  { key: 'imageUrl', label: '抓拍图片', type: 'image' },
  { key: 'status', label: '状态' },
  { key: 'stationName', label: '场站' },
  { key: 'operatorName', label: '操作人' },
  { key: 'operatorTime', label: '操作时间', formatter: formatTime },
  { key: 'remark', label: '备注' },
];

/** 模拟详情数据 */
export const mockDetailData = {
  id: 1,
  plateNo: '闽C12345',
  passReason: '人工开闸',
  passTime: 1745011815000,
  imageUrl:
    '/genchuan/chargePark/vehiclePass/specialPass/passRecord/2025/04/13/123456.jpg',
  status: '正常记录',
  stationId: 1,
  stationName: '1号场站',
  operatorId: 1,
  operatorName: '张三',
  operatorTime: 1745011815000,
  checkResult: '',
  remark: '',
  creator: 'admin',
  createTime: 1745011815000,
  updater: null,
  updateTime: null,
  isCorrected: false,
};

/** 状态类型映射 */
export const statusTypeMap = {
  正常记录: 'success',
  异常记录: 'warning',
};
