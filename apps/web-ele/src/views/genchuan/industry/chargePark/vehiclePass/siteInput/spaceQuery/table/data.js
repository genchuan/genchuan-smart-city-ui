import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      spaceNo: 'A001',
      queryTime: '2025-04-18 08:30:15',
      queryUserId: 2,
      queryUserName: '张三',
      areaId: 1,
      areaName: '芗城区',
      spaceStatus: '空闲',
      remark: '',
      createTime: '2025-04-18 08:30:15',
    },
    {
      id: '002',
      spaceNo: 'A002',
      queryTime: '2025-04-18 09:15:30',
      queryUserId: 2,
      queryUserName: '张三',
      areaId: 1,
      areaName: '龙文区',
      spaceStatus: '占用',
      remark: '',
      createTime: '2025-04-18 09:15:30',
    },
    {
      id: '003',
      spaceNo: 'B001',
      queryTime: '2025-04-18 10:20:45',
      queryUserId: 3,
      queryUserName: '李四',
      areaId: 2,
      areaName: '龙海区',
      spaceStatus: '空闲',
      remark: '',
      createTime: '2025-04-18 10:20:45',
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'spaceNo',
      label: '泊位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入泊位编号',
      },
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
    },
    {
      fieldName: 'spaceStatus',
      label: '泊位状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择泊位状态',
        options: [
          { label: '空闲', value: '空闲' },
          { label: '占用', value: '占用' },
        ],
      },
    },
    {
      fieldName: 'queryTime',
      label: '查询时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择查询时间范围',
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
      title: '查询ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
    {
      field: 'spaceNo',
      title: '泊位编号',
      minWidth: 120,
      sortable: true,
      slots: { default: 'spaceNo' },
    },
    {
      field: 'queryTime',
      title: '查询时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'queryUserName',
      title: '查询人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'queryUserName' },
    },
    {
      field: 'areaName',
      title: '片区',
      minWidth: 120,
      sortable: true,
      slots: { default: 'areaName' },
    },
    {
      field: 'spaceStatus',
      title: '泊位状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'spaceStatus' },
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
  editText: '编辑泊位查询',
  addText: '新增泊位查询',
  excelName: '泊位查询列表',
  excelAllName: '泊位查询导出.xlsx',
  total: '总计: 查询3条; 空闲2条; 占用1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '查询ID' },
  { key: 'spaceNo', label: '泊位编号' },
  { key: 'queryTime', label: '查询时间', formatter: formatTime },
  { key: 'queryUserName', label: '查询人' },
  { key: 'areaName', label: '片区' },
  { key: 'spaceStatus', label: '泊位状态' },
  { key: 'remark', label: '备注' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
];
