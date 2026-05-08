import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { getStationSimpleList } from '#/api/genchuan/industry/energyCharging/carCharging/stationEquipment/chargingLot';

/** 充电车位表单配置 */
export function useFormSchema(stationOptions = []) {
  return [
    {
      fieldName: 'lotCode',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
      rules: 'required',
    },
    {
      fieldName: 'stationId',
      label: '所属场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属场站',
        options: stationOptions,
      },
      rules: 'required',
    },
    {
      fieldName: 'lotType',
      label: '车位类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车位类型',
        options: getDictOptions(DICT_TYPE.CHARGE_LOT_LOT_TYPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'pileId',
      label: '关联充电桩',
      component: 'Select',
      componentProps: {
        placeholder: '请选择关联充电桩',
        options: [],
      },
    },
    {
      fieldName: 'occupyTimeout',
      label: '占用超时时间',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入占用超时时间（分钟）',
        min: 0,
      },
    },
    {
      fieldName: 'lotStatus',
      label: '车位状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车位状态',
        options: getDictOptions(DICT_TYPE.CHARGE_LOT_LOT_STATUS, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'maintainReason',
      label: '维护原因',
      component: 'Input',
      componentProps: {
        placeholder: '请输入维护原因',
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

/** 充电车位搜索表单配置 */
export function useSearchFormSchema(stationOptions = []) {
  return [
    {
      fieldName: 'lotCode',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
        clearable: true,
      },
    },
    {
      fieldName: 'stationName',
      label: '所属场站',
      component: 'Input',
      componentProps: {
        placeholder: '请输入所属场站',
        // options: stationOptions,
        clearable: true,
      },
    },
    {
      fieldName: 'lotType',
      label: '车位类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车位类型',
        options: getDictOptions(DICT_TYPE.CHARGE_LOT_LOT_TYPE, 'string'),
      },
    },
    {
      fieldName: 'lotStatus',
      label: '车位状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车位状态',
        options: getDictOptions(DICT_TYPE.CHARGE_LOT_LOT_STATUS, 'string'),
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择创建时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
      },
    },
  ];
}

/** 获取场站下拉选项 */
export async function fetchStationOptions() {
  try {
    return await getStationSimpleList();
  } catch (error) {
    console.error('获取场站列表失败', error);
    return [];
  }
}

/** 充电车位表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'lotCode',
      title: '车位编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'lotCode' },
    },
    {
      field: 'stationName',
      title: '所属场站',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'lotType',
      title: '车位类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'lotType' },
    },
    {
      field: 'pileName',
      title: '关联充电桩',
      minWidth: 180,
      sortable: true,
      slots: { default: 'pileName' },
    },
    {
      field: 'occupyTime',
      title: '占用时长',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'lotStatus',
      title: '车位状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'lotStatus' },
    },
    {
      field: 'maintainReason',
      title: '维护原因',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'occupyTimeout',
      title: '占用超时时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'createTime' },
    },
    {
      field: 'creator',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'creator' },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

/** 获取车位状态Tag类型 */
export const getLotStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.CHARGE_LOT_LOT_STATUS, String(status));
  const colorType = dict?.colorType || 'primary';

  const colorTypeMap = {
    danger: 'danger',
    error: 'danger',
    info: 'info',
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    blue: 'primary',
    green: 'success',
    orange: 'warning',
    cyan: 'info',
    purple: 'primary',
    pink: 'danger',
    red: 'danger',
    yellow: 'warning',
  };

  return colorTypeMap[colorType] || colorType || 'primary';
};

/** 获取车位类型Tag类型 */
export const getLotTypeTagType = (lotType) => {
  const dict = getDictObj(DICT_TYPE.CHARGE_LOT_LOT_TYPE, String(lotType));
  const colorType = dict?.colorType || 'primary';

  const colorTypeMap = {
    danger: 'danger',
    error: 'danger',
    info: 'info',
    primary: 'primary',
    success: 'success',
    warning: 'warning',
    blue: 'primary',
    green: 'success',
    orange: 'warning',
    cyan: 'info',
    purple: 'primary',
    pink: 'danger',
    red: 'danger',
    yellow: 'warning',
  };

  return colorTypeMap[colorType] || colorType || 'primary';
};

/** 格式化时间戳为 yyyy-MM-dd HH:mm:ss */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(Number(timestamp));
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const textObj = {
  editText: '编辑充电车位',
  addText: '新增充电车位',
  excelName: '充电车位列表',
  excelAllName: '充电车位数据.xlsx',
  total: ' 总计: 充电车位数量0',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'lotCode', label: '车位编号' },
  { key: 'stationName', label: '所属场站' },
  {
    key: 'lotType',
    label: '车位类型',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.CHARGE_LOT_LOT_TYPE, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getLotTypeTagType(value),
  },
  { key: 'pileName', label: '关联充电桩' },
  { key: 'occupyTime', label: '占用时长' },
  {
    key: 'lotStatus',
    label: '车位状态',
    type: 'tag',
    formatter: (value) => {
      const dict = getDictObj(DICT_TYPE.CHARGE_LOT_LOT_STATUS, String(value));
      return dict ? dict.label : value;
    },
    tagType: (value) => getLotStatusTagType(value),
  },
  { key: 'maintainReason', label: '维护原因' },
  { key: 'remark', label: '备注' },
  { key: 'occupyTimeout', label: '占用超时时间' },
  { key: 'createTime', label: '创建时间' },
  { key: 'creator', label: '操作人' },
];
