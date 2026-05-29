import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';
import { getStationInfoPage } from '#/api/genchuan/industry/chargePark/stationResource/stationMgmt/stationInfo';
import { requestClient } from '#/api/request';

/** 获取场站列表 */
let stationOptionsCache = null;
export async function getStationOptions() {
  console.log('【车牌识别】getStationOptions 被调用');
  if (stationOptionsCache) {
    console.log('【车牌识别】使用缓存数据:', stationOptionsCache);
    return stationOptionsCache;
  }
  try {
    console.log('【车牌识别】开始请求 API: /vehiclepass/in-park-status/simple-list');
    const response = await requestClient.get('/vehiclepass/in-park-status/simple-list');
    console.log('【车牌识别】API 响应:', response);
    if (response && Array.isArray(response)) {
      stationOptionsCache = response.map(item => ({
        label: item.stationName,
        value: item.stationId,
      }));
      console.log('【车牌识别】处理后的选项:', stationOptionsCache);
      return stationOptionsCache;
    }
    console.log('【车牌识别】响应不是数组，返回空数组');
    return [];
  } catch (error) {
    console.error('【车牌识别】获取场站列表失败:', error);
    return [];
  }
}

/** 车牌识别表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      plateNo: '闽E12345',
      plateColor: '蓝牌',
      confidence: 98.5,
      imageUrl: 'https://example.com/image1.jpg',
      status: '识别成功',
      stationId: 1,
      stationName: '充电站1',
      remark: '',
      isCorrected: false,
      creator: '系统',
      createTime: 1745011815000,
      updateTime: 1745011815000,
      updater: '张三',
      operator: '张三',
      operationTime: 1745012120000,
      correctionMark: '无',
    },
    {
      id: 2,
      plateNo: '闽E67890',
      plateColor: '黄牌',
      confidence: 96.2,
      imageUrl: 'https://example.com/image2.jpg',
      status: '识别成功',
      stationId: 2,
      stationName: '充电站2',
      remark: '',
      isCorrected: false,
      creator: '系统',
      createTime: 1745015730000,
      updateTime: 1745015730000,
      updater: '李四',
      operator: '李四',
      operationTime: 1745016015000,
      correctionMark: '无',
    },
    {
      id: 3,
      plateNo: '',
      plateColor: '',
      confidence: 45.3,
      imageUrl: 'https://example.com/image3.jpg',
      status: '识别失败',
      stationId: 3,
      stationName: '充电站3',
      remark: '需人工处理',
      isCorrected: false,
      creator: '系统',
      createTime: 1745020845000,
      updateTime: 1745020845000,
      updater: '王五',
      operator: '王五',
      operationTime: 1745021130000,
      correctionMark: '待修正',
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
    },
    {
      fieldName: 'status',
      label: '识别状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择识别状态',
        options: [
          { label: '识别成功', value: '识别成功' },
          { label: '识别失败', value: '识别失败' },
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
      fieldName: 'isCorrected',
      label: '修正状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择修正状态',
        options: [
          { label: '未修正', value: 0 },
          { label: '已修正', value: 1 },
          { label: '已确认', value: 2 },
        ],
      },
    },
    {
      fieldName: 'createTimeRange',
      label: '时间范围',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: '请选择时间范围',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        defaultTime: [
          new Date(2000, 0, 1, 0, 0, 0),
          new Date(2000, 0, 1, 23, 59, 59),
        ],
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
      fieldName: 'confidence',
      label: '置信度',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入置信度',
        min: 0,
        max: 100,
      },
    },
    {
      fieldName: 'imageUrl',
      label: '抓拍图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入图片地址',
      },
    },
    {
      fieldName: 'status',
      label: '识别状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择识别状态',
        options: [
          { label: '识别成功', value: '识别成功' },
          { label: '识别失败', value: '识别失败' },
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
        filterable: true,
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
      fieldName: 'confidence',
      label: '置信度',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入置信度',
        min: 0,
        max: 100,
        disabled: true,
      },
    },
    {
      fieldName: 'imageUrl',
      label: '抓拍图片',
      component: 'Input',
      componentProps: {
        placeholder: '请输入图片地址',
      },
    },
    {
      fieldName: 'status',
      label: '识别状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择识别状态',
        options: [
          { label: '识别成功', value: '识别成功' },
          { label: '识别失败', value: '识别失败' },
        ],
        disabled: true,
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
        filterable: true,
        disabled: true,
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

/** 车牌识别表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '识别ID',
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
      field: 'plateColor',
      title: '车牌颜色',
      minWidth: 100,
      sortable: true,
      slots: { default: 'plateColor' },
    },
    {
      field: 'confidence',
      title: '置信度(%)',
      minWidth: 100,
      sortable: true,
      slots: { default: 'confidence' },
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
      title: '识别状态',
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
      title: '修正记录标记',
      minWidth: 120,
      sortable: true,
      slots: { default: 'correctionMark' },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '识别时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
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
  editText: '修正车牌识别',
  addText: '手动录入',
  excelName: '车牌识别列表',
  excelAllName: '车牌识别数据.xlsx',
  total: '总计: 识别记录3条; 成功2条; 失败1条',
};

/** 状态类型映射 */
export const statusTypeMap = {
  识别成功: 'success',
  识别失败: 'danger',
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
  { key: 'id', label: '识别ID' },
  { key: 'plateNo', label: '车牌号' },
  { key: 'plateColor', label: '车牌颜色' },
  { key: 'confidence', label: '置信度(%)' },
  { key: 'imageUrl', label: '抓拍图片', type: 'image' },
  { key: 'status', label: '识别状态' },
  { key: 'stationName', label: '场站' },
  {
    key: 'isCorrected',
    label: '修正记录标记',
    formatter: (val) => (val ? '已修正' : '未修正'),
  },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '识别时间', formatter: formatTime },
];
