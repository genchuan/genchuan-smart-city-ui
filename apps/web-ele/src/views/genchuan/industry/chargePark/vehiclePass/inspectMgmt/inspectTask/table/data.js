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
    if (response && response.data && Array.isArray(response.data)) {
      stationOptionsCache = response.data.map(item => ({
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

/** 状态类型映射 */
export const statusTypeMap = {
  待派发: 'info',
  待认领: 'warning',
  处理中: 'primary',
  已完成: 'success',
  已归档: 'info',
};

/** 任务类型映射 */
export const taskTypeMap = {
  '违规通行稽查': 'danger',
  '欠费逃费稽查': 'warning',
  '其他': 'info',
};

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: 1,
      taskType: '违规通行稽查',
      dispatchTime: 1745011815000,
      deadlineTime: 1745184000000,
      status: '待派发',
      areaName: '芗城区',
      executeUserName: '',
      finishTime: null,
      taskProgress: '',
      remark: '稽查违规通行车辆',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745011815000,
      updater: '张三',
      updateTime: 1745011815000,
      logs: [
        { time: 1745011815000, operator: 'admin', action: '创建任务', remark: '新建稽查任务' },
      ],
    },
    {
      id: 2,
      taskType: '欠费逃费稽查',
      dispatchTime: 1745015730000,
      deadlineTime: 1745270400000,
      status: '待认领',
      areaName: '龙文区',
      executeUserName: '张三',
      finishTime: null,
      taskProgress: '',
      remark: '稽查欠费逃费车辆',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745015730000,
      updater: '李四',
      updateTime: 1745015730000,
      logs: [
        { time: 1745015730000, operator: 'admin', action: '创建任务', remark: '新建稽查任务' },
        { time: 1745015800000, operator: 'admin', action: '派发任务', remark: '派发给张三' },
      ],
    },
    {
      id: 3,
      taskType: '违规通行稽查',
      dispatchTime: 1745019645000,
      deadlineTime: 1745356800000,
      status: '处理中',
      areaName: '龙海区',
      executeUserName: '李四',
      finishTime: null,
      taskProgress: '已联系车主，等待处理',
      remark: '稽查违规通行车辆',
      isCorrected: false,
      creator: 'admin',
      createTime: 1745019645000,
      updater: '王五',
      updateTime: 1745019645000,
      logs: [
        {
          time: 1745019645000,
          operator: 'admin',
          action: '创建任务',
          remark: '新建稽查任务',
        },
        {
          time: 1745019700000,
          operator: 'admin',
          action: '派发任务',
          remark: '派发给李四',
        },
        {
          time: 1745019750000,
          operator: '李四',
          action: '认领任务',
          remark: '已认领',
        },
        {
          time: 1745019800000,
          operator: '李四',
          action: '更新进度',
          remark: '已联系车主，等待处理',
        },
      ],
    },
    {
      id: 4,
      taskType: '欠费逃费稽查',
      dispatchTime: 1744925400000,
      deadlineTime: 1745098800000,
      status: '已完成',
      areaName: '芗城区',
      executeUserName: '王五',
      finishTime: 1745091000000,
      taskProgress: '已完成处理',
      remark: '稽查欠费逃费车辆',
      isCorrected: false,
      creator: 'admin',
      createTime: 1744925400000,
      updater: '赵六',
      updateTime: 1745091000000,
      logs: [
        {
          time: 1744925400000,
          operator: 'admin',
          action: '创建任务',
          remark: '新建稽查任务',
        },
        {
          time: 1744925500000,
          operator: 'admin',
          action: '派发任务',
          remark: '派发给王五',
        },
        {
          time: 1744925600000,
          operator: '王五',
          action: '认领任务',
          remark: '已认领',
        },
        {
          time: 1745091000000,
          operator: '王五',
          action: '完成任务',
          remark: '已完成处理',
        },
      ],
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'taskType',
      label: '任务类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务类型',
        options: [
          { label: '违规通行稽查', value: '违规通行稽查' },
          { label: '欠费逃费稽查', value: '欠费逃费稽查' },
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
          { label: '待派发', value: '待派发' },
          { label: '待认领', value: '待认领' },
          { label: '处理中', value: '处理中' },
          { label: '已完成', value: '已完成' },
          { label: '已归档', value: '已归档' },
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
      fieldName: 'dispatchTime',
      label: '派发时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择派发时间',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  ];
}

/** 新增表单配置 */
export function useCreateFormSchema() {
  return [
    {
      fieldName: 'taskType',
      label: '任务类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务类型',
        options: [
          { label: '违规通行稽查', value: '违规通行稽查' },
          { label: '欠费逃费稽查', value: '欠费逃费稽查' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'areaId',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'deadlineTime',
      label: '截止时间',
      component: 'DatePicker',
      componentProps: {
        type: 'datetime',
        placeholder: '请选择截止时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
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

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'taskType',
      title: '任务类型',
      minWidth: 140,
      sortable: true,
      slots: { default: 'taskType' },
    },
    {
      field: 'dispatchTime',
      title: '派发时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'deadlineTime',
      title: '截止时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
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
      field: 'executeUserName',
      title: '执行人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'executeUserName' },
    },
    {
      field: 'finishTime',
      title: '完成时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'taskProgress',
      title: '任务进度',
      minWidth: 180,
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
  editText: '编辑稽查任务',
  addText: '新增稽查任务',
  excelName: '稽查任务列表',
  excelAllName: '稽查任务导出.xlsx',
  total: '总计: 任务4条; 待派发1条; 待认领1条; 处理中1条; 已完成1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'taskType', label: '任务类型' },
  { key: 'dispatchTime', label: '派发时间', formatter: formatTime },
  { key: 'deadlineTime', label: '截止时间', formatter: formatTime },
  { key: 'status', label: '状态' },
  { key: 'areaName', label: '片区' },
  { key: 'executeUserName', label: '执行人' },
  { key: 'finishTime', label: '完成时间', formatter: formatTime },
  { key: 'taskProgress', label: '任务进度' },
  { key: 'logs', label: '任务日志', isLogs: true },
];
