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
  待审批: 'warning',
  已通过: 'success',
  已驳回: 'danger',
  已执行: 'info',
};

/** 开闸原因映射 */
export const openReasonMap = {
  紧急通行: 'danger',
  故障处理: 'warning',
  其他: 'info',
};

/** 任务进度映射 */
export const taskProgressMap = {
  '未开始': 'info',
  '进行中': 'warning',
  '已完成': 'success',
};

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      stationId: 1,
      stationName: '芗城区XX社区停车场',
      openReason: '紧急通行',
      applyUserId: 1,
      applyUserName: '张三',
      applyTime: 1745011815000,
      status: '待审批',
      auditUserId: null,
      auditUserName: null,
      auditTime: null,
      executeTime: null,
      rejectReason: null,
      remark: '救护车紧急通行',
      creator: 'admin',
      createTime: 1745011815000,
      updater: null,
      updateTime: null,
      isCorrected: false,
      executorId: 1,
      executorName: '执行员A',
      completeTime: null,
      taskProgress: '未开始',
    },
    {
      id: '002',
      stationId: 2,
      stationName: '龙文区碧湖公园停车场',
      openReason: '故障处理',
      applyUserId: 2,
      applyUserName: '李四',
      applyTime: 1745015730000,
      status: '已通过',
      auditUserId: 1,
      auditUserName: '管理员',
      auditTime: 1745016600000,
      executeTime: null,
      rejectReason: null,
      remark: '道闸故障需要手动开闸',
      creator: 'admin',
      createTime: 1745015730000,
      updater: null,
      updateTime: null,
      isCorrected: false,
      executorId: 2,
      executorName: '执行员B',
      completeTime: null,
      taskProgress: '进行中',
    },
    {
      id: '003',
      stationId: 3,
      stationName: '龙海区石码镇停车场',
      openReason: '其他',
      applyUserId: 3,
      applyUserName: '王五',
      applyTime: 1745019645000,
      status: '已执行',
      auditUserId: 1,
      auditUserName: '管理员',
      auditTime: 1745020200000,
      executeTime: 1745020500000,
      rejectReason: null,
      remark: '特殊车辆通行',
      creator: 'admin',
      createTime: 1745019645000,
      updater: null,
      updateTime: null,
      isCorrected: false,
      executorId: 1,
      executorName: '执行员A',
      completeTime: 1745021000000,
      taskProgress: '已完成',
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'stationName',
      label: '片区',
      component: 'Select',
      componentProps: {
        placeholder: '请选择片区',
        options: [],
      },
    },
    {
      fieldName: 'openReason',
      label: '任务类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择任务类型',
        options: [
          { label: '紧急通行', value: '紧急通行' },
          { label: '故障处理', value: '故障处理' },
          { label: '其他', value: '其他' },
        ],
      },
    },
    {
      fieldName: 'applyUserId',
      label: '申请人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请人',
        options: [],
      },
    },
    {
      fieldName: 'applyTime',
      label: '派发时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择派发时间',
        type: 'datetimerange',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        options: [
          { label: '待审批', value: '待审批' },
          { label: '已通过', value: '已通过' },
          { label: '已驳回', value: '已驳回' },
          { label: '已执行', value: '已执行' },
        ],
      },
    },
    {
      fieldName: 'executorId',
      label: '执行人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择执行人',
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

/** 新增申请表单配置 */
export function useCreateFormSchema() {
  return [
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
      fieldName: 'applyUserId',
      label: '申请人',
      component: 'Select',
      componentProps: {
        placeholder: '请选择申请人',
        options: [],
      },
      rules: 'required',
    },
    {
      fieldName: 'openReason',
      label: '开闸原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开闸原因',
        options: [
          { label: '紧急通行', value: '紧急通行' },
          { label: '故障处理', value: '故障处理' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
      },
    },
  ];
}

/** 重新申请表单配置 */
export function useReapplyFormSchema() {
  return [
    {
      fieldName: 'openReason',
      label: '开闸原因',
      component: 'Select',
      componentProps: {
        placeholder: '请选择开闸原因',
        options: [
          { label: '紧急通行', value: '紧急通行' },
          { label: '故障处理', value: '故障处理' },
          { label: '其他', value: '其他' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
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
      title: '申请ID',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'stationName',
      title: '片区',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'openReason',
      title: '任务类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'openReason' },
    },
    {
      field: 'applyUserName',
      title: '申请人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'applyUserName' },
    },
    {
      field: 'applyTime',
      title: '派发时间',
      minWidth: 180,
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
      field: 'executorName',
      title: '执行人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'executorName' },
    },
    {
      field: 'completeTime',
      title: '完成时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'taskProgress',
      title: '任务进度',
      minWidth: 100,
      sortable: true,
      slots: { default: 'taskProgress' },
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
  createText: '新增申请',
  reapplyText: '重新申请',
  excelName: '开闸管理列表',
  excelAllName: '开闸管理导出.xlsx',
  total: '总计: 申请3条; 待审批1条; 已通过1条; 已执行1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '申请ID' },
  { key: 'stationName', label: '片区' },
  { key: 'openReason', label: '任务类型' },
  { key: 'applyUserName', label: '申请人' },
  { key: 'applyTime', label: '派发时间', formatter: formatTime },
  { key: 'status', label: '状态' },
  { key: 'executorName', label: '执行人' },
  { key: 'completeTime', label: '完成时间', formatter: formatTime },
  { key: 'taskProgress', label: '任务进度' },
  { key: 'rejectReason', label: '驳回理由' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'isCorrected', label: '修正记录标记' },
];
