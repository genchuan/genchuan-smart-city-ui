import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 缴费状态类型映射 */
export const statusTypeMap = {
  已缴清: 'success',
  欠费: 'danger',
};

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      plateNo: '闽E12345',
      parkFee: 25,
      status: '已缴清',
      checkTime: 1_745_020_845_000,
      stationName: '芗城区XX社区停车场',
      stationId: 1,
      checkUserName: '张三',
      checkUserId: 1,
      checkResult: '核验通过，允许放行',
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1_745_020_845_000,
      updater: '张三',
      updateTime: 1_745_020_845_000,
    },
    {
      id: '002',
      plateNo: '闽E67890',
      parkFee: 15,
      status: '已缴清',
      checkTime: 1_745_022_930_000,
      stationName: '龙文区碧湖公园停车场',
      stationId: 2,
      checkUserName: '李四',
      checkUserId: 2,
      checkResult: '核验通过，允许放行',
      remark: '',
      isCorrected: false,
      creator: 'admin',
      createTime: 1_745_022_930_000,
      updater: '李四',
      updateTime: 1_745_022_930_000,
    },
    {
      id: '003',
      plateNo: '闽E11111',
      parkFee: 50,
      status: '欠费',
      checkTime: 1_745_028_045_000,
      stationName: '龙海区石码镇停车场',
      stationId: 3,
      checkUserName: '王五',
      checkUserId: 3,
      checkResult: '欠费未缴清',
      remark: '需要催缴',
      isCorrected: false,
      creator: 'admin',
      createTime: 1_745_028_045_000,
      updater: '王五',
      updateTime: 1_745_028_045_000,
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
      fieldName: 'status',
      label: '缴费状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择缴费状态',
        options: [
          { label: '已缴清', value: '已缴清' },
          { label: '欠费', value: '欠费' },
        ],
      },
    },
    {
      fieldName: 'stationName',
      label: '场站',
      component: 'Select',
      componentProps: {
        placeholder: '请选择场站',
        options: [],
      },
    },
    {
      fieldName: 'checkTime',
      label: '时间范围',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择时间范围',
        type: 'datetimerange',
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
      title: '核验ID',
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
      field: 'parkFee',
      title: '停车费用(元)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'status',
      title: '缴费状态',
      minWidth: 100,
      sortable: true,
      slots: { default: 'status' },
    },
    {
      field: 'checkTime',
      title: '核验时间',
      minWidth: 180,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'stationName',
      title: '场站',
      minWidth: 180,
      sortable: true,
      slots: { default: 'stationName' },
    },
    {
      field: 'checkUserName',
      title: '核验人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'checkUserName' },
    },
    {
      field: 'checkResult',
      title: '核验结果',
      minWidth: 150,
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
  editText: '编辑缴费核验',
  addText: '新增缴费核验',
  excelName: '缴费核验列表',
  excelAllName: '缴费核验导出.xlsx',
  total: '总计: 核验记录3条; 已缴清2条; 欠费1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '核验ID' },
  { key: 'plateNo', label: '车牌' },
  { key: 'parkFee', label: '停车费用(元)' },
  { key: 'status', label: '缴费状态' },
  { key: 'checkTime', label: '核验时间', formatter: formatTime },
  { key: 'stationName', label: '场站' },
  { key: 'checkUserName', label: '核验人' },
  { key: 'checkResult', label: '核验结果' },
  { key: 'remark', label: '备注' },
  {
    key: 'isCorrected',
    label: '修正记录标记',
    formatter: (val) => (val ? '已修正' : '未修正'),
  },
  { key: 'updater', label: '操作人' },
  { key: 'updateTime', label: '操作时间', formatter: formatTime },
  { key: 'creator', label: '创建人' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
];
