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
      id: 1,
      taskId: 1,
      violationType: '欠费逃费',
      handleMethod: '补缴费用',
      status: '待审核',
      areaId: 1,
      areaName: '芗城区',
      handleUserId: 2,
      handleUserName: '张三',
      handleTime: 1745011815000,
      rectifyStatus: '未整改',
      rejectReason: '',
      remark: '车主已补缴欠费',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745011815000,
      updater: '李四',
      updateTime: 1745011815000,
    },
    {
      id: 2,
      taskId: 2,
      violationType: '违规通行',
      handleMethod: '限制入场',
      status: '待处置',
      areaId: 2,
      areaName: '龙文区',
      handleUserId: 3,
      handleUserName: '李四',
      handleTime: 1745015730000,
      rectifyStatus: '未整改',
      rejectReason: '',
      remark: '违规通行处理',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745015730000,
      updater: '王五',
      updateTime: 1745015730000,
    },
    {
      id: 3,
      taskId: 3,
      violationType: '其他',
      handleMethod: '警告',
      status: '已完成',
      areaId: 1,
      areaName: '芗城区',
      handleUserId: 2,
      handleUserName: '张三',
      handleTime: 1745019645000,
      rectifyStatus: '已整改',
      rejectReason: '',
      remark: '已完成处理',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745019645000,
      updater: '赵六',
      updateTime: 1745019645000,
    },
    {
      id: 4,
      taskId: 4,
      violationType: '欠费逃费',
      handleMethod: '补缴费用',
      status: '已驳回',
      areaId: 2,
      areaName: '龙文区',
      handleUserId: 3,
      handleUserName: '李四',
      handleTime: 1745023560000,
      rectifyStatus: '未整改',
      rejectReason: '处置方式不符合规范，请重新处置',
      remark: '驳回处理',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745023560000,
      updater: '孙七',
      updateTime: 1745023560000,
    },
  ];
};

// 时间戳格式化函数
function formatDateTime(value) {
  if (value === undefined || value === null || value === '') return '--';

  function padTime(v) {
    return String(v).padStart(2, '0');
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padTime(value.getMonth() + 1)}-${padTime(value.getDate())} ${padTime(value.getHours())}:${padTime(value.getMinutes())}:${padTime(value.getSeconds())}`;
  }

  if (typeof value === 'number' || /^\d+$/.test(String(value))) {
    const text = String(value);
    const timestamp = Number(text.length === 10 ? `${text}000` : text);
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) return formatDateTime(date);
  }

  const normalized = String(value)
    .replace('T', ' ')
    .replace(/\.\d+Z?$/, '');
  const parsed = new Date(String(value).replaceAll('-', '/'));
  if (!Number.isNaN(parsed.getTime())) return formatDateTime(parsed);
  return normalized.length >= 19 ? normalized.slice(0, 19) : normalized;
}

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'violationType',
      label: '违规类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择违规类型',
        options: [
          { label: '违规通行', value: '违规通行' },
          { label: '欠费逃费', value: '欠费逃费' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待审核', value: '待审核' },
          { label: '待处置', value: '待处置' },
          { label: '已完成', value: '已完成' },
          { label: '已驳回', value: '已驳回' },
        ],
      },
    },
    {
      fieldName: 'areaId',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [],
      },
    },
    {
      fieldName: 'handleTime',
      label: '处置时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择处置时间',
        valueFormat: 'timestamp',
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'taskId',
      title: '关联任务',
      minWidth: 100,
      sortable: true,
      slots: { default: 'taskId' },
    },
    {
      field: 'violationType',
      title: '违规类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'violationType' },
    },
    {
      field: 'handleMethod',
      title: '处置方式',
      minWidth: 120,
      sortable: true,
      slots: { default: 'handleMethod' },
    },
    {
      field: 'status',
      title: '状态',
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
      field: 'handleUserName',
      title: '处置人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'handleUserName' },
    },
    {
      field: 'handleTime',
      title: '处置时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'rectifyStatus',
      title: '整改状态',
      minWidth: 100,
      sortable: true,
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
  editText: '编辑结果处置',
  addText: '新增结果处置',
  excelName: '结果处置列表',
  excelAllName: '结果处置导出.xlsx',
  total: '总计: 处置4条; 待审核1条; 待处置1条; 已完成1条; 已驳回1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'taskId', label: '关联任务' },
  { key: 'violationType', label: '违规类型' },
  { key: 'handleMethod', label: '处置方式' },
  { key: 'status', label: '状态' },
  { key: 'areaName', label: '片区' },
  { key: 'handleUserName', label: '处置人' },
  { key: 'handleTime', label: '处置时间', formatter: formatDateTime },
  { key: 'rectifyStatus', label: '整改状态' },
  { key: 'remark', label: '处置备注' },
  { key: 'rejectReason', label: '驳回理由' },
  { key: 'createTime', label: '创建时间', formatter: formatDateTime },
  { key: 'updateTime', label: '更新时间', formatter: formatDateTime },
];
