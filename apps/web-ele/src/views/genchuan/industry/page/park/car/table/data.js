/** 车位表格初始数据 - 按指定字段生成 */
export const dataList = () => {
  return [
    {
      parkingSpaceNo: 'C00101',      // 车位编号
      parkingSpaceType: '小型车',    // 车位类型
      belongParkGarage: '芗城区XX社区公共停车场-地下一层', // 所属车场/车库
      locationDesc: '地下一层A区01号', // 位置描述
      bookable: '是',                // 是否可预约
      bindPlateLimit: '1',           // 绑定车牌数量上限
      enableStatus: '启用',          // 启用状态
      contactPerson: '张三',         // 联系人
      contactPhone: '13800138001',   // 联系电话
      bindPlateCount: '1',           // 绑定车牌数
      ledgerUpdateTime: '2025-01-10 09:20:30', // 台账更新时间
      availableStatus: '可用'        // 可用状态
    },
    {
      parkingSpaceNo: 'C00201',
      parkingSpaceType: '小型车',
      belongParkGarage: '龙文区碧湖公园停车场-地面层',
      locationDesc: '地面层B区01号',
      bookable: '否',
      bindPlateLimit: '1',
      enableStatus: '禁用',
      contactPerson: '李四',
      contactPhone: '13800138002',
      bindPlateCount: '0',
      ledgerUpdateTime: '2025-01-12 14:15:20',
      availableStatus: '不可用'
    },
    {
      parkingSpaceNo: 'C00301',
      parkingSpaceType: '小型车',
      belongParkGarage: '龙海区石码镇便民停车场-地面层',
      locationDesc: '地面层C区01号',
      bookable: '否',
      bindPlateLimit: '1',
      enableStatus: '禁用',
      contactPerson: '王五',
      contactPhone: '13800138003',
      bindPlateCount: '0',
      ledgerUpdateTime: '2025-01-15 10:05:10',
      availableStatus: '不可用'
    },
    {
      parkingSpaceNo: 'C00401',
      parkingSpaceType: '小型车',
      belongParkGarage: '龙海区闽齐社区停车场-地面层',
      locationDesc: '地面层D区01号',
      bookable: '是',
      bindPlateLimit: '1',
      enableStatus: '启用',
      contactPerson: '赵六',
      contactPhone: '13800138004',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-01-18 08:30:45',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C00501',
      parkingSpaceType: '中型车',
      belongParkGarage: '芗城区江滨路生态停车场-地面+地下一层',
      locationDesc: '地下一层E区01号',
      bookable: '是',
      bindPlateLimit: '2',
      enableStatus: '启用',
      contactPerson: '孙七',
      contactPhone: '13800138005',
      bindPlateCount: '2',
      ledgerUpdateTime: '2025-01-20 16:40:15',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C00601',
      parkingSpaceType: '小型车',
      belongParkGarage: '龙文区万达商圈停车场-地下一/二层',
      locationDesc: '地下一层F区01号',
      bookable: '是',
      bindPlateLimit: '1',
      enableStatus: '启用',
      contactPerson: '周八',
      contactPhone: '13800138006',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-01-22 11:10:30',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C00701',
      parkingSpaceType: '小型车',
      belongParkGarage: '长泰区武安镇公共停车场-地面层',
      locationDesc: '地面层G区01号',
      bookable: '是',
      bindPlateLimit: '1',
      enableStatus: '启用',
      contactPerson: '吴九',
      contactPhone: '13800138007',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-01-25 13:25:40',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C00801',
      parkingSpaceType: '小型车',
      belongParkGarage: '漳浦县绥安镇便民停车场-地面层',
      locationDesc: '地面层H区01号',
      bookable: '否',
      bindPlateLimit: '1',
      enableStatus: '禁用',
      contactPerson: '郑十',
      contactPhone: '13800138008',
      bindPlateCount: '0',
      ledgerUpdateTime: '2025-01-28 09:50:25',
      availableStatus: '不可用'
    },
    {
      parkingSpaceNo: 'C00901',
      parkingSpaceType: '小型车',
      belongParkGarage: '芗城区巷口街道停车场-地面层',
      locationDesc: '地面层I区01号',
      bookable: '是',
      bindPlateLimit: '1',
      enableStatus: '启用',
      contactPerson: '张三',
      contactPhone: '13800138009',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-02-01 15:15:10',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C01001',
      parkingSpaceType: '中型车',
      belongParkGarage: '龙文区蓝田街道停车场-地下一层',
      locationDesc: '地下一层J区01号',
      bookable: '是',
      bindPlateLimit: '2',
      enableStatus: '启用',
      contactPerson: '李四',
      contactPhone: '13800138010',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-02-05 10:30:50',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C01101',
      parkingSpaceType: '小型车',
      belongParkGarage: '龙文区步文街道停车场-地下一/二层',
      locationDesc: '地下二层K区01号',
      bookable: '是',
      bindPlateLimit: '1',
      enableStatus: '启用',
      contactPerson: '王五',
      contactPhone: '13800138011',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-02-08 14:20:15',
      availableStatus: '可用'
    },
    {
      parkingSpaceNo: 'C01201',
      parkingSpaceType: '小型车',
      belongParkGarage: '芗城区东铺头街道停车场-地面层',
      locationDesc: '地面层L区01号',
      bookable: '是',
      bindPlateLimit: '1',
      enableStatus: '启用',
      contactPerson: '赵六',
      contactPhone: '13800138012',
      bindPlateCount: '1',
      ledgerUpdateTime: '2025-02-10 09:40:30',
      availableStatus: '可用'
    }
  ];
};

/** 车位表单配置（包含所有指定字段） */
export function useFormSchema() {
  return [
    {
      fieldName: 'parkingSpaceNo',
      label: '车位编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车位编号',
      },
      rules: 'required'
    },
    {
      fieldName: 'parkingSpaceType',
      label: '车位类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择车位类型',
        options: [
          { label: '小型车', value: '小型车' },
          { label: '中型车', value: '中型车' },
          { label: '大型车', value: '大型车' },
          { label: '新能源专用', value: '新能源专用' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'belongParkGarage',
      label: '所属车场/车库',
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属车场/车库',
        options: [
          { label: '芗城区XX社区公共停车场-地下一层', value: '芗城区XX社区公共停车场-地下一层' },
          { label: '龙文区碧湖公园停车场-地面层', value: '龙文区碧湖公园停车场-地面层' },
          { label: '龙海区石码镇便民停车场-地面层', value: '龙海区石码镇便民停车场-地面层' },
          { label: '龙海区闽齐社区停车场-地面层', value: '龙海区闽齐社区停车场-地面层' },
          { label: '芗城区江滨路生态停车场-地面+地下一层', value: '芗城区江滨路生态停车场-地面+地下一层' },
          { label: '龙文区万达商圈停车场-地下一/二层', value: '龙文区万达商圈停车场-地下一/二层' },
          { label: '长泰区武安镇公共停车场-地面层', value: '长泰区武安镇公共停车场-地面层' },
          { label: '漳浦县绥安镇便民停车场-地面层', value: '漳浦县绥安镇便民停车场-地面层' },
          { label: '芗城区巷口街道停车场-地面层', value: '芗城区巷口街道停车场-地面层' },
          { label: '龙文区蓝田街道停车场-地下一层', value: '龙文区蓝田街道停车场-地下一层' },
          { label: '龙文区步文街道停车场-地下一/二层', value: '龙文区步文街道停车场-地下一/二层' },
          { label: '芗城区东铺头街道停车场-地面层', value: '芗城区东铺头街道停车场-地面层' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'locationDesc',
      label: '位置描述',
      component: 'Input',
      componentProps: {
        placeholder: '请输入位置描述（例：地下一层A区01号）'
      },
      rules: 'required'
    },
    {
      fieldName: 'bookable',
      label: '是否可预约',
      component: 'Select',
      componentProps: {
        placeholder: '请选择是否可预约',
        options: [
          { label: '是', value: '是' },
          { label: '否', value: '否' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'bindPlateLimit',
      label: '绑定车牌数量上限',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入绑定车牌数量上限',
        min: 1,
        max: 5
      },
      rules: 'required'
    },
    {
      fieldName: 'enableStatus',
      label: '启用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择启用状态',
        options: [
          { label: '启用', value: '启用' },
          { label: '禁用', value: '禁用' },
          { label: '暂停运营', value: '暂停运营' },
          { label: '维修中', value: '维修中' }
        ]
      },
      rules: 'required'
    },
    {
      fieldName: 'contactPerson',
      label: '联系人',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系人'
      },
      rules: 'required'
    },
    {
      fieldName: 'contactPhone',
      label: '联系电话',
      component: 'Input',
      componentProps: {
        placeholder: '请输入联系电话'
      },
      rules: 'required|phone'
    },
    {
      fieldName: 'bindPlateCount',
      label: '绑定车牌数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入绑定车牌数',
        min: 0,
        max: 5
      },
      rules: 'required'
    },
    {
      fieldName: 'ledgerUpdateTime',
      label: '台账更新时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择台账更新时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      },
      rules: 'required'
    },
    {
      fieldName: 'availableStatus',
      label: '可用状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择可用状态',
        options: [
          { label: '可用', value: '可用' },
          { label: '不可用', value: '不可用' },
          { label: '维护中', value: '维护中' }
        ]
      },
      rules: 'required'
    }
  ];
}

/** 车位表格列配置 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'parkingSpaceNo',
      title: '车位编号',
      minWidth: 100,
      sortable: true,
      slots: { default: 'parkingSpaceNo' }
    },
    {
      field: 'parkingSpaceType',
      title: '车位类型',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'belongParkGarage',
      title: '所属车场/车库',
      minWidth: 220,
      sortable: true
    },
    {
      field: 'locationDesc',
      title: '位置描述',
      minWidth: 150,
      sortable: true
    },
    {
      field: 'bookable',
      title: '是否可预约',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'bindPlateLimit',
      title: '绑定车牌数量上限',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'enableStatus',
      title: '启用状态',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'contactPerson',
      title: '联系人',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'contactPhone',
      title: '联系电话',
      minWidth: 120,
      sortable: true
    },
    {
      field: 'bindPlateCount',
      title: '绑定车牌数',
      minWidth: 100,
      sortable: true
    },
    {
      field: 'ledgerUpdateTime',
      title: '台账更新时间',
      minWidth: 180,
      sortable: true
    },
    {
      field: 'availableStatus',
      title: '可用状态',
      minWidth: 100,
      sortable: true
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      slots: { default: 'actions' }
    }
  ];
}

export const textObj = {
  // 操作类文本（对应编辑/新增）
  editText: '编辑车位',
  addText: '新增车位',
  // 导出Excel相关文本
  excelName: '车位列表',
  excelAllName: '全市车位数据.xlsx',
  // 统计总计文本（结合车位数据统计）
  total: ' 总计: 车位数量12;可预约车位8;可用车位9',
};