import { DICT_TYPE } from '@vben/constants';
import { getDictObj, getDictOptions } from '@vben/hooks';

import { formatDate } from '#/utils/genchuan/formatTime';
import { getDictTagTypeFromDict } from '#/utils/genchuan/dictColor';

/** 获取报表类型Tag类型 - 使用封装的字典颜色工具 */
export const getMarketOpReportTypeTagType = (type) => {
  const dict = getDictObj(DICT_TYPE.MARKET_OP_REPORT_TYPE, String(type));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取报表状态Tag类型 - 使用封装的字典颜色工具 */
export const getMarketOpReportStatusTagType = (status) => {
  const dict = getDictObj(DICT_TYPE.MARKET_OP_REPORT_STATUS, String(status));
  return getDictTagTypeFromDict(dict, 'primary');
};

/** 获取报表类型标签 */
export const getMarketOpReportTypeLabel = (type) => {
  const dict = getDictObj(DICT_TYPE.MARKET_OP_REPORT_TYPE, String(type));
  return dict ? dict.label : type;
};

/** 获取报表状态标签 */
export const getMarketOpReportStatusLabel = (status) => {
  const dict = getDictObj(DICT_TYPE.MARKET_OP_REPORT_STATUS, String(status));
  return dict ? dict.label : status;
};

/** 营销运营报表表格初始数据 - 按接口文档格式生成，字典值与系统字典一致 */
export const dataList = () => {
  return [
    {
      id: 1,
      name: '2025年4月营销运营月报',
      type: '2',
      typeName: '月报',
      timeScale: 'month',
      timeScaleName: '月度',
      period: '2025-04-01 至 2025-04-30',
      createTime: 1745104800000,
      filterConditions: '时间范围：2025-04-01 至 2025-04-30；报表类型：月报',
      statisticianId: 1,
      statisticianName: '张三',
      yoyData: '12.5%',
      momData: '8.3%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1745101200000,
    },
    {
      id: 2,
      name: '2025年第1季度营销运营季报',
      type: '3',
      typeName: '季报',
      timeScale: 'quarter',
      timeScaleName: '季度',
      period: '2025-01-01 至 2025-03-31',
      createTime: 1743472800000,
      filterConditions: '时间范围：2025-01-01 至 2025-03-31；报表类型：季报',
      statisticianId: 2,
      statisticianName: '李四',
      yoyData: '15.2%',
      momData: '-2.1%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1743469200000,
    },
    {
      id: 3,
      name: '2025年4月15日营销运营日报',
      type: '0',
      typeName: '日报',
      timeScale: 'day',
      timeScaleName: '日度',
      period: '2025-04-15',
      createTime: 1744701600000,
      filterConditions: '时间范围：2025-04-15；报表类型：日报',
      statisticianId: 3,
      statisticianName: '王五',
      yoyData: '5.8%',
      momData: '3.2%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1744698000000,
    },
    {
      id: 4,
      name: '2025年4月第3周营销运营周报',
      type: '1',
      typeName: '周报',
      timeScale: 'week',
      timeScaleName: '周度',
      period: '2025-04-14 至 2025-04-20',
      createTime: 1745306400000,
      filterConditions: '时间范围：2025-04-14 至 2025-04-20；报表类型：周报',
      statisticianId: 1,
      statisticianName: '张三',
      yoyData: '10.1%',
      momData: '6.7%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1745302800000,
    },
    {
      id: 5,
      name: '2025年上半年营销运营半年报',
      type: '4',
      typeName: '半年报',
      timeScale: 'halfYear',
      timeScaleName: '半年度',
      period: '2025-01-01 至 2025-06-30',
      createTime: 1751296800000,
      filterConditions: '时间范围：2025-01-01 至 2025-06-30；报表类型：半年报',
      statisticianId: 2,
      statisticianName: '李四',
      yoyData: '18.9%',
      momData: '11.5%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1751293200000,
    },
    {
      id: 6,
      name: '2025年营销运营年报',
      type: '5',
      typeName: '年报',
      timeScale: 'year',
      timeScaleName: '年度',
      period: '2025-01-01 至 2025-12-31',
      createTime: 1767223200000,
      filterConditions: '时间范围：2025-01-01 至 2025-12-31；报表类型：年报',
      statisticianId: 1,
      statisticianName: '张三',
      yoyData: '22.3%',
      momData: '15.8%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1767219600000,
    },
    {
      id: 7,
      name: '2025年4月10日-4月20日自定义报表',
      type: '6',
      typeName: '自定义报表',
      timeScale: 'custom',
      timeScaleName: '自定义',
      period: '2025-04-10 至 2025-04-20',
      createTime: 1745306400000,
      filterConditions: '时间范围：2025-04-10 至 2025-04-20；报表类型：自定义报表；筛选条件：订单状态=已完成',
      statisticianId: 3,
      statisticianName: '王五',
      yoyData: '8.7%',
      momData: '4.5%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1745302800000,
    },
    {
      id: 8,
      name: '2025年3月营销运营月报',
      type: '2',
      typeName: '月报',
      timeScale: 'month',
      timeScaleName: '月度',
      period: '2025-03-01 至 2025-03-31',
      createTime: 1742788000000,
      filterConditions: '时间范围：2025-03-01 至 2025-03-31；报表类型：月报',
      statisticianId: 2,
      statisticianName: '李四',
      yoyData: '9.4%',
      momData: '-1.2%',
      reserve1: null,
      reserve2: null,
      creator: 'admin',
      updater: 'admin',
      updateTime: 1742784400000,
    },
  ];
};

/** 营销运营报表表单配置 */
export function useFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '报表名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入报表名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'type',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表类型',
        options: getDictOptions(DICT_TYPE.MARKET_OP_REPORT_TYPE, 'string'),
      },
      rules: 'required',
    },
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择时间尺度',
        options: [
          { label: '日度', value: 'day' },
          { label: '周度', value: 'week' },
          { label: '月度', value: 'month' },
          { label: '季度', value: 'quarter' },
          { label: '半年度', value: 'halfYear' },
          { label: '年度', value: 'year' },
          { label: '自定义', value: 'custom' },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'period',
      label: '统计周期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计周期',
      },
      rules: 'required',
    },
    {
      fieldName: 'filterConditions',
      label: '筛选条件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入筛选条件',
        type: 'textarea',
        rows: 3,
      },
    },
    {
      fieldName: 'statisticianId',
      label: '统计人ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入统计人ID',
      },
    },
  ];
}

/** 营销运营报表搜索表单配置 - 仅包含表格展示字段 */
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'name',
      label: '报表名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入报表名称',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '报表类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择报表类型',
        options: getDictOptions(DICT_TYPE.MARKET_OP_REPORT_TYPE, 'string'),
        clearable: true,
      },
    },
    {
      fieldName: 'timeScale',
      label: '时间尺度',
      component: 'Select',
      componentProps: {
        placeholder: '请选择时间尺度',
        options: [
          { label: '日度', value: 'day' },
          { label: '周度', value: 'week' },
          { label: '月度', value: 'month' },
          { label: '季度', value: 'quarter' },
          { label: '半年度', value: 'halfYear' },
          { label: '年度', value: 'year' },
          { label: '自定义', value: 'custom' },
        ],
        clearable: true,
      },
    },
    {
      fieldName: 'period',
      label: '统计周期',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计周期',
        clearable: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '生成时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生成时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'timestamp',
        type: 'datetimerange',
        clearable: true,
      },
    },
    {
      fieldName: 'filterConditions',
      label: '筛选条件',
      component: 'Input',
      componentProps: {
        placeholder: '请输入筛选条件',
        clearable: true,
      },
    },
    {
      fieldName: 'statisticianName',
      label: '统计人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入统计人',
        clearable: true,
      },
    },
  ];
}

/** 营销运营报表表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'name',
      title: '报表名称',
      minWidth: 250,
      sortable: true,
      slots: { default: 'name' },
    },
    {
      field: 'typeName',
      title: '报表类型',
      minWidth: 120,
      sortable: true,
      slots: { default: 'typeName' },
    },
    {
      field: 'period',
      title: '统计周期',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '生成时间',
      minWidth: 180,
      sortable: true,
      slots: { default: 'createTime' },
    },
    {
      field: 'filterConditions',
      title: '筛选条件',
      minWidth: 300,
      sortable: true,
      slots: { default: 'filterConditions' },
    },
    {
      field: 'statisticianName',
      title: '统计人',
      minWidth: 120,
      sortable: true,
      slots: { default: 'statisticianName' },
    },
    {
      field: 'yoyData',
      title: '同比数据',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'momData',
      title: '环比数据',
      minWidth: 120,
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
  editText: '编辑报表',
  addText: '新增报表',
  excelName: '营销运营报表列表',
  excelAllName: '营销运营报表数据.xlsx',
  total: ' 总计: 报表数量8;日报:1;周报:1;月报:2;季报:1;半年报:1;年报:1;自定义报表:1',
};

/** 详情抽屉字段配置 - 使用与表格相同的字典颜色逻辑 */
export const detailFields = [
  { key: 'name', label: '报表名称' },
  {
    key: 'type',
    label: '报表类型',
    type: 'tag',
    formatter: (value) => getMarketOpReportTypeLabel(value),
    tagType: (value) => getMarketOpReportTypeTagType(value),
  },
  { key: 'timeScaleName', label: '时间尺度' },
  { key: 'period', label: '统计周期' },
  { key: 'createTime', label: '生成时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
  { key: 'filterConditions', label: '筛选条件', formatter: (value) => value || '-' },
  {
    key: 'statisticianName',
    label: '统计人',
    formatter: (value) => value || '-',
  },
  { key: 'yoyData', label: '同比数据' },
  { key: 'momData', label: '环比数据' },
  { key: 'creator', label: '创建者' },
  { key: 'updater', label: '更新者' },
  { key: 'updateTime', label: '更新时间', formatter: (value) => value ? formatDate(new Date(Number(value)), 'YYYY-MM-DD HH:mm:ss') : '' },
];
