import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

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
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'taskId',
      label: '关联任务',
      component: 'Input',
      componentProps: {
        placeholder: '请输入任务ID',
      },
    },
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
      fieldName: 'handleMethod',
      label: '处置方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择处置方式',
        options: [
          { label: '补缴费用', value: '补缴费用' },
          { label: '限制入场', value: '限制入场' },
          { label: '警告', value: '警告' },
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
        valueFormat: 'YYYY-MM-DD',
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
      title: '处置ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
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
      field: 'isCorrected',
      title: '修正记录',
      minWidth: 100,
      sortable: true,
      slots: { default: 'correctionMark' },
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
  total: '总计: 处置3条; 待审核1条; 待处置1条; 已完成1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '处置ID' },
  { key: 'taskId', label: '关联任务' },
  { key: 'violationType', label: '违规类型' },
  { key: 'handleMethod', label: '处置方式' },
  { key: 'status', label: '状态' },
  { key: 'areaName', label: '片区' },
  { key: 'handleUserName', label: '处置人' },
  { key: 'handleTime', label: '处置时间', formatter: formatTime },
  { key: 'rectifyStatus', label: '整改状态' },
  { key: 'rejectReason', label: '驳回理由' },
  { key: 'remark', label: '备注' },
  { key: 'creator', label: '创建者' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'isCorrected', label: '修正记录' },
];
