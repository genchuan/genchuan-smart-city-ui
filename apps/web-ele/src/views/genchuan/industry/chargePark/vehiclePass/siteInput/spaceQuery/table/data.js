import { requestClient } from '#/api/request';
import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 获取片区列表（模拟数据） */
let stationOptionsCache = null;
export async function getStationOptions() {
  if (stationOptionsCache) {
    return stationOptionsCache;
  }
  // TODO: 替换为真实接口
  stationOptionsCache = [
    { label: '芗城区', value: 1 },
    { label: '龙文区', value: 2 },
    { label: '龙海区', value: 3 },
    { label: '长泰区', value: 4 },
    { label: '漳浦县', value: 5 },
  ];
  return stationOptionsCache;
}

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      spaceNo: 'A001',
      queryTime: 1745011815000,
      queryUserId: 2,
      queryUserName: '张三',
      areaId: 1,
      areaName: '芗城区',
      spaceStatus: '空闲',
      remark: '',
      creator: 'admin',
      createTime: 1745011815000,
      updater: null,
      updateTime: null,
      isCorrected: false,
    },
    {
      id: '002',
      spaceNo: 'A002',
      queryTime: 1745015730000,
      queryUserId: 2,
      queryUserName: '张三',
      areaId: 1,
      areaName: '龙文区',
      spaceStatus: '占用',
      remark: '',
      creator: 'admin',
      createTime: 1745015730000,
      updater: null,
      updateTime: null,
      isCorrected: false,
    },
    {
      id: '003',
      spaceNo: 'B001',
      queryTime: 1745019645000,
      queryUserId: 3,
      queryUserName: '李四',
      areaId: 2,
      areaName: '龙海区',
      spaceStatus: '空闲',
      remark: '',
      creator: 'admin',
      createTime: 1745019645000,
      updater: null,
      updateTime: null,
      isCorrected: false,
    },
  ];
};

/** 查询表单配置 */
export function useSearchFormSchema() {
  return [
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
      fieldName: 'queryTime',
      label: '查询时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择查询时间范围',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];
}

/** 表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
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
  { key: 'spaceNo', label: '泊位编号' },
  { key: 'queryTime', label: '查询时间', formatter: formatTime },
  { key: 'queryUserName', label: '查询人' },
  { key: 'areaName', label: '片区' },
  { key: 'spaceStatus', label: '泊位状态' },
];
