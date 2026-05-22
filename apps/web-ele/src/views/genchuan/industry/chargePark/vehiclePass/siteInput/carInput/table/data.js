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

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      plateNo: '闽E12345',
      spaceId: 1,
      inputTime: 1_745_011_815_000,
      status: '待审核',
      areaId: 1,
      areaName: '芗城区',
      inputUserId: 2,
      inputUserName: '张三',
      auditUserId: null,
      auditUserName: null,
      auditTime: null,
      auditComment: null,
      remark: '现场录入车辆信息',
      isCorrected: false,
      creator: 'admin',
      createTime: 1_745_011_815_000,
      updater: '张三',
      updateTime: 1_745_011_815_000,
    },
    {
      id: '002',
      plateNo: '闽E67890',
      spaceId: 2,
      inputTime: 1_745_015_730_000,
      status: '已通过',
      areaId: 1,
      areaName: '龙文区',
      inputUserId: 2,
      inputUserName: '张三',
      auditUserId: 3,
      auditUserName: '李四',
      auditTime: 1_745_016_000_000,
      auditComment: '信息无误',
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1_745_015_730_000,
      updater: '李四',
      updateTime: 1_745_016_000_000,
    },
    {
      id: '003',
      plateNo: '闽E11111',
      spaceId: 3,
      inputTime: 1_745_019_645_000,
      status: '已驳回',
      areaId: 2,
      areaName: '龙海区',
      inputUserId: 2,
      inputUserName: '张三',
      auditUserId: 3,
      auditUserName: '李四',
      auditTime: 1_745_019_900_000,
      auditComment: '车牌信息有误',
      remark: '需要修正',
      isCorrected: false,
      creator: 'admin',
      createTime: 1_745_019_645_000,
      updater: '李四',
      updateTime: 1_745_019_900_000,
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
    {
      fieldName: 'areaName',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [
          { label: '芗城区', value: '芗城区' },
          { label: '龙文区', value: '龙文区' },
          { label: '龙海区', value: '龙海区' },
        ],
      },
    },
    {
      fieldName: 'inputTime',
      label: '时间范围',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        placeholder: '请选择时间范围',
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
      label: '车牌 *',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码',
      },
      rules: [
        { required: true, message: '请输入车牌号码' },
        {
          pattern:
            /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙吉青宁夏][A-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/,
          message: '车牌格式不正确',
        },
      ],
    },
    {
      fieldName: 'spaceId',
      label: '车位 *',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位号',
      },
      rules: [{ required: true, message: '请输入车位号' }],
    },
    {
      fieldName: 'areaId',
      label: '片区 *',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [
          { label: '芗城区', value: 1 },
          { label: '龙文区', value: 2 },
          { label: '龙海区', value: 3 },
        ],
      },
      rules: [{ required: true, message: '请选择片区' }],
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

/** 表格列配置 */
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
      field: 'spaceId',
      title: '车位',
      minWidth: 100,
      sortable: true,
      slots: { default: 'spaceId' },
    },
    {
      field: 'inputTime',
      title: '录入时间',
      minWidth: 160,
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
      field: 'areaName',
      title: '片区',
      minWidth: 120,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'inputUserName',
      title: '录入人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'inputUserName' },
    },
    {
      field: 'auditUserName',
      title: '审核人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'auditUserName' },
    },
    {
      field: 'auditTime',
      title: '审核时间',
      minWidth: 160,
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
  editText: '编辑车辆录入',
  addText: '新增车辆录入',
  excelName: '车辆录入列表',
  excelAllName: '车辆录入导出.xlsx',
  total: '总计: 录入3条; 待审核1条; 已通过1条; 已驳回1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '录入ID' },
  { key: 'plateNo', label: '车牌' },
  { key: 'spaceId', label: '车位ID' },
  { key: 'inputTime', label: '录入时间', formatter: formatTime },
  { key: 'status', label: '审核状态' },
  { key: 'areaName', label: '片区' },
  { key: 'inputUserName', label: '录入人' },
  { key: 'auditUserName', label: '审核人' },
  { key: 'auditTime', label: '审核时间', formatter: formatTime },
  { key: 'auditComment', label: '审核意见' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'isCorrected', label: '修正记录' },
];

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
        rows: 4,
      },
      rules: 'required',
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
        placeholder: '请输入车牌号码',
      },
      rules: 'required',
    },
    {
      fieldName: 'spaceId',
      label: '车位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'areaId',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [
          { label: '芗城区', value: 1 },
          { label: '龙文区', value: 2 },
          { label: '龙海区', value: 3 },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '修正备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入修正备注',
        rows: 3,
      },
    },
  ];
}
