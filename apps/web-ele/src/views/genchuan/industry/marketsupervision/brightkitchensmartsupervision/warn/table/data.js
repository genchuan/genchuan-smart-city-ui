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
 


/** 告警记录表表格列配置 */
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
      field: 'userIds',
      title: '设备关联用户ID列表',
      minWidth: 200,
      sortable: false,
      slots: { default: 'userIds' }, // JSON格式用户ID，预留格式化插槽
    },
    {
      field: 'sceneId',
      title: '场景实例ID',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'aiAbilityCode',
      title: '功能算法编码',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'alertType',
      title: '告警类型',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'alertCreateTime',
      title: '消息产生时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'deviceCode',
      title: '设备编码',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'featureId',
      title: '功能标识',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'alertSource',
      title: '消息来源',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'srcUrl',
      title: '图片地址',
      minWidth: 150,
      sortable: false, 
      slots: { default: 'srcUrl' }, // 预留格式化插槽，用于显示图片
    },
    {
      field: 'srcToken',
      title: '图片刷新token',
      minWidth: 200,
      sortable: false,
    },
    {
      field: 'deviceAccount',
      title: '设备手机号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'msgVersion',
      title: '消息版本',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'alertId',
      title: '平台告警ID',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'aiPlatformMsgId',
      title: 'AI平台消息ID',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'boxType',
      title: '检测框',
      minWidth: 120,
      sortable: false,
    },
    {
      field: 'repeatAlarm',
      title: '重复告警',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'leaveTime',
      title: '离岗时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'times10End',
      title: '结束时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'intervalTime',
      title: '间隔时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'alertParams',
      title: '完整告警参数JSON',
      minWidth: 200,
      sortable: false, 
    }, 
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: { default: 'actions' }, // 操作列（查看详情/处理告警/删除）
    },
  ];
}