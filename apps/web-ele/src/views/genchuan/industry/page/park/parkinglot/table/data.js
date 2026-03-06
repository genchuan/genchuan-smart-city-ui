/** 车场信息的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '主键ID',
      searchFilter: true,
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入主键ID',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'lotRemark',
      label: '车场名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场名称（如：漳州古城地面停车场）',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'lotId',
      label: '车场ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车场ID（如：lot_001_uuid_abcd1234）',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'assetExtendId',
      label: '关联资产扩展ID',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入关联资产扩展ID',
        min: 1,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'regionFullCode',
      label: '12位地区码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入12位地区码（如：350602001001）',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'totalSpace',
      label: '总车位数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入总车位数',
        min: 0,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      fieldName: 'availableSpace',
      label: '可用车位数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入可用车位数',
        min: 0,
        style: { width: '100%' },
      },
      labelWidth: '100',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        clearable: true,
        filterOption: true,
        options: [
          { label: '地面', value: '地面' },
          { label: '地下', value: '地下' },
          { label: '立体', value: '立体' },
          { label: '路侧', value: '路侧' },
        ],
        placeholder: '请选择车场类型',
        showSearch: true,
      },
      fieldName: 'parkType',
      label: '车场类型',
    },
    {
      fieldName: 'openTime',
      label: '开放时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入开放时间（如：00:00:00）',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'closeTime',
      label: '关闭时间',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关闭时间（如：22:00:00）',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'managementMerchantId',
      label: '运营商户ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入运营商户ID（如：merchant_001_uuid_1111）',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'feeStrategyId',
      label: '费率策略ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入费率策略ID（如：fee_001_uuid_aaaa）',
      },
      labelWidth: '100',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'lotCreateTime',
      label: '业务创建时间',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'lotUpdateTime',
      label: '业务更新时间',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'createTime',
      label: '创建时间',
    },
    {
      component: 'RangePicker',
      labelWidth: '100',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        showTime: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        style: { width: '100%' },
      },
      fieldName: 'updateTime',
      label: '更新时间',
    },
    {
      fieldName: 'creator',
      label: '创建人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入创建人',
      },
      labelWidth: '100',
    },
    {
      fieldName: 'updater',
      label: '更新人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入更新人',
      },
      labelWidth: '100',
    },
  ];
}
/** 车场信息表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '主键ID',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'lotRemark',
      title: '车场名称',
      minWidth: 150,
      sortable: false, // 备注无需排序
    },
    {
      field: 'lotId',
      title: '车场ID',
      minWidth: 200,
      sortable: true,
    },
    {
      field: 'assetExtendId',
      title: '关联资产扩展ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'regionFullCode',
      title: '12位地区码',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'totalSpace',
      title: '总车位数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'availableSpace',
      title: '可用车位数',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'parkType',
      title: '车场类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'openTime',
      title: '开放时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'closeTime',
      title: '关闭时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'managementMerchantId',
      title: '运营商户ID',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'feeStrategyId',
      title: '费率策略ID',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'lotCreateTime',
      title: '业务创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'lotUpdateTime',
      title: '业务更新时间',
      minWidth: 180,
      sortable: true,
    },

    {
      field: 'extCommon1',
      title: '扩展字段1',
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'extCommon2',
      title: '扩展字段2',
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'extCommon3',
      title: '扩展字段3',
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'extCommon4',
      title: '扩展字段4',
      minWidth: 100,
      sortable: false,
    },
    {
      field: 'tenantId',
      title: '租户ID',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'creator',
      title: '创建人',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'updater',
      title: '更新人',
      minWidth: 100,
      sortable: true,
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }, // 操作列（编辑/删除/详情）
    },
  ];
}

/** 文字描述对象 */
export const textObj = {
  editText: '',
  addText: '',
  excelName: '',
  excelAllName: '全市停车场数据.xlsx',
  total: '停车场数量10;车位总数:1211;车场车位7',
};
