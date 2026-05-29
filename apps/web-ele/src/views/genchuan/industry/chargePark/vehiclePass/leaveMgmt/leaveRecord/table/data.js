import { createTimeFormatter, createDateFormatter, formatTime } from '../../../utils/timeFormatter';
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

/** 记录状态类型映射 */
export const statusTypeMap = {
  正常记录: 'success',
  异常记录: 'danger',
};

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      plateNo: '闽E12345',
      enterTime: 1745011815000,
      leaveTime: 1745019015000,
      parkDuration: 120,
      status: '正常记录',
      stationName: '芗城区XX社区停车场',
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745019015000,
      updater: '张三',
      updateTime: 1745019015000,
    },
    {
      id: '002',
      plateNo: '闽E67890',
      enterTime: 1745015730000,
      leaveTime: 1745022930000,
      parkDuration: 120,
      status: '正常记录',
      stationName: '龙文区碧湖公园停车场',
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745022930000,
      updater: '李四',
      updateTime: 1745022930000,
    },
    {
      id: '003',
      plateNo: '闽E11111',
      enterTime: 1745020845000,
      leaveTime: 1745028045000,
      parkDuration: 120,
      status: '异常记录',
      stationName: '龙海区石码镇停车场',
      remark: '需要修正',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745028045000,
      updater: '王五',
      updateTime: 1745028045000,
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
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        type: 'datetimerange',
      },
    },
    {
      fieldName: 'leaveTime',
      label: '离场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择离场时间',
        type: 'datetimerange',
      },
    },
    {
      fieldName: 'leaveTimeHour',
      label: '离场小时',
      component: 'TimePicker',
      componentProps: {
        placeholder: '请选择离场小时',
        format: 'HH:mm',
        valueFormat: 'HH:mm',
      },
    },
    {
      fieldName: 'parkDuration',
      label: '停车时长',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入停车时长（分钟）',
        min: 0,
        style: { width: '100%' },
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
      fieldName: 'isCorrected',
      label: '修正日志',
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
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        type: 'datetime',
      },
      rules: 'required',
    },
    {
      fieldName: 'leaveTime',
      label: '离场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择离场时间',
        type: 'datetime',
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

/** 编辑表单配置（仅编辑备注） */
export function useUpdateFormSchema() {
  return [
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 5,
      },
    },
  ];
}

/** 修正表单配置 */
export function useCorrectFormSchema() {
  return [
    {
      fieldName: 'plateNo',
      label: '车牌',
      component: 'Input',
      componentProps: {
        placeholder: '请输入正确的车牌',
      },
      rules: 'required',
    },
    {
      fieldName: 'enterTime',
      label: '入场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择入场时间',
        type: 'datetime',
      },
      rules: 'required',
    },
    {
      fieldName: 'leaveTime',
      label: '离场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择离场时间',
        type: 'datetime',
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
        placeholder: '请输入佐证图片地址（多张图片用逗号分隔）',
      },
    },
    {
      fieldName: 'remark',
      label: '修正原因',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入修正原因（至少10字）',
        rows: 3,
      },
      rules: [
        { required: true, message: '请输入修正原因' },
        { min: 10, message: '修正原因至少10字' },
      ],
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '记录ID',
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
      field: 'enterTime',
      title: '入场时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'leaveTime',
      title: '离场时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'parkDuration',
      title: '停车时长',
      minWidth: 120,
      sortable: true,
      slots: { default: 'parkDuration' },
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
      minWidth: 180,
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
      minWidth: 160,
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
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 180,
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
  editText: '编辑离场记录',
  addText: '补录离场记录',
  correctText: '修正离场记录',
  excelName: '离场记录列表',
  excelAllName: '离场记录导出.xlsx',
  total: '总计: 记录3条; 正常记录2条; 异常记录1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '记录ID' },
  { key: 'plateNo', label: '车牌' },
  { key: 'enterTime', label: '入场时间', formatter: formatTime },
  { key: 'leaveTime', label: '离场时间', formatter: formatTime },
  { key: 'parkDuration', label: '停车时长（分钟）' },
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
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
  { key: 'remark', label: '备注' },
  { key: 'modifyLogs', label: '修改日志', type: 'logs' },
];
