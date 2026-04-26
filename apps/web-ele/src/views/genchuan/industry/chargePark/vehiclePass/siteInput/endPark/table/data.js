import { createTimeFormatter, formatTime } from '../../../utils/timeFormatter';

/** 模块表格初始数据 */
export const dataList = () => {
  return [
    {
      id: '001',
      plateNo: '闽E12345',
      spaceId: 1,
      endTime: '2025-04-18 08:30:15',
      status: '待支付',
      areaId: 1,
      areaName: '芗城区',
      operatorId: 2,
      operatorName: '张三',
      orderNo: 'PAY20250418001',
      remark: '现场结束停车',
      createTime: '2025-04-18 08:30:15',
    },
    {
      id: '002',
      plateNo: '闽E67890',
      spaceId: 2,
      endTime: '2025-04-18 09:15:30',
      status: '已支付',
      areaId: 1,
      areaName: '龙文区',
      operatorId: 2,
      operatorName: '张三',
      orderNo: 'PAY20250418002',
      remark: '',
      createTime: '2025-04-18 09:15:30',
    },
    {
      id: '003',
      plateNo: '闽E11111',
      spaceId: 3,
      endTime: '2025-04-18 10:20:45',
      status: '已取消',
      areaId: 2,
      areaName: '龙海区',
      operatorId: 3,
      operatorName: '李四',
      orderNo: '',
      remark: '用户取消',
      createTime: '2025-04-18 10:20:45',
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
      fieldName: 'spaceId',
      label: '车位ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位ID',
      },
    },
    {
      fieldName: 'status',
      label: '缴费状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择缴费状态',
        options: [
          { label: '待支付', value: '待支付' },
          { label: '已支付', value: '已支付' },
          { label: '已取消', value: '已取消' },
        ],
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
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        placeholder: '请选择结束时间范围',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  ];
}

/** 新增表单配置 */
export function useCreateFormSchema() {
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
      field: 'id',
      title: '结束ID',
      minWidth: 100,
      sortable: true,
      slots: { default: 'id' },
    },
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
      field: 'endTime',
      title: '结束时间',
      minWidth: 160,
      sortable: true,
      formatter: createTimeFormatter(),
    },
    {
      field: 'status',
      title: '缴费状态',
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
      field: 'operatorName',
      title: '操作人',
      minWidth: 100,
      sortable: true,
      slots: { default: 'operatorName' },
    },
    {
      field: 'orderNo',
      title: '订单编号',
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
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export const textObj = {
  editText: '编辑结束停车',
  addText: '新增结束停车',
  excelName: '结束停车列表',
  excelAllName: '结束停车导出.xlsx',
  total: '总计: 结束3条; 待支付1条; 已支付1条; 已取消1条',
};

/** 详情抽屉字段配置 */
export const detailFields = [
  { key: 'id', label: '结束ID' },
  { key: 'plateNo', label: '车牌' },
  { key: 'spaceId', label: '车位ID' },
  { key: 'endTime', label: '结束时间', formatter: formatTime },
  { key: 'status', label: '缴费状态' },
  { key: 'areaName', label: '片区' },
  { key: 'operatorName', label: '操作人' },
  { key: 'orderNo', label: '订单编号' },
  { key: 'remark', label: '备注' },
  { key: 'createTime', label: '创建时间', formatter: formatTime },
];

/** 支付表单配置 */
export function usePayFormSchema() {
  return [
    {
      fieldName: 'payMethod',
      label: '支付方式',
      component: 'Select',
      componentProps: {
        placeholder: '请选择支付方式',
        options: [
          { label: '现金', value: '现金' },
          { label: '微信', value: '微信' },
          { label: '支付宝', value: '支付宝' },
          { label: '银行卡', value: '银行卡' },
        ],
      },
      rules: 'required',
    },
  ];
}

/** 取消表单配置 */
export function useCancelFormSchema() {
  return [
    {
      fieldName: 'cancelReason',
      label: '取消理由',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入取消理由',
        rows: 4,
      },
      rules: 'required',
    },
  ];
}
