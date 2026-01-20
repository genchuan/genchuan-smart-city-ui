/** 表格初始数据*/
export const dataList = () => {
  return [
    {
      "plateNumber": "闽EJ5689",
      "parkName": "龙文区碧湖公园停车场",
      "parkingSpace": "86号车位",
      "entryTime": "2026-01-20 09:15:32",
      "parkingDuration": "2小时10分钟",
      "parkingStatus": "正常在停",
      "sensorStatus": "正常",
      "overtimeReminderThreshold": "8小时",
      "exceptionFlag": "无",
      "processingStatus": "无需处理",
      "lastUpdateTime": "2026-01-20 11:25:48"
    },
    {
      "plateNumber": "闽EK3210",
      "parkName": "龙文区万达商圈停车场",
      "parkingSpace": "156号车位",
      "entryTime": "2026-01-20 06:30:18",
      "parkingDuration": "5小时0分钟",
      "parkingStatus": "即将超时",
      "sensorStatus": "信号弱",
      "overtimeReminderThreshold": "6小时",
      "exceptionFlag": "无",
      "processingStatus": "未处理",
      "lastUpdateTime": "2026-01-20 11:30:25"
    },
    {
      "plateNumber": "闽EL8976",
      "parkName": "芗城区江滨路生态停车场",
      "parkingSpace": "98号车位",
      "entryTime": "2026-01-19 22:45:06",
      "parkingDuration": "12小时45分钟",
      "parkingStatus": "已超时",
      "sensorStatus": "正常",
      "overtimeReminderThreshold": "10小时",
      "exceptionFlag": "超时",
      "processingStatus": "处理中",
      "lastUpdateTime": "2026-01-20 11:30:40"
    },
    {
      "plateNumber": "闽EM2345",
      "parkName": "龙文区步文街道停车场",
      "parkingSpace": "67号车位",
      "entryTime": "2026-01-20 10:05:20",
      "parkingDuration": "1小时25分钟",
      "parkingStatus": "正常在停",
      "sensorStatus": "正常",
      "overtimeReminderThreshold": "4小时",
      "exceptionFlag": "无",
      "processingStatus": "无需处理",
      "lastUpdateTime": "2026-01-20 11:31:10"
    },
    {
      "plateNumber": "闽EN7890",
      "parkName": "长泰区武安镇公共停车场",
      "parkingSpace": "42号车位",
      "entryTime": "2026-01-19 18:30:45",
      "parkingDuration": "17小时0分钟",
      "parkingStatus": "异常停留",
      "sensorStatus": "故障",
      "overtimeReminderThreshold": "12小时",
      "exceptionFlag": "传感器异常",
      "processingStatus": "处理中",
      "lastUpdateTime": "2026-01-20 11:31:35"
    },
    {
      "plateNumber": "闽EO1234",
      "parkName": "龙海区闽齐社区停车场",
      "parkingSpace": "18号车位",
      "entryTime": "2026-01-20 08:10:12",
      "parkingDuration": "3小时20分钟",
      "parkingStatus": "正常在停",
      "sensorStatus": "离线",
      "overtimeReminderThreshold": "5小时",
      "exceptionFlag": "传感器异常",
      "processingStatus": "未处理",
      "lastUpdateTime": "2026-01-20 11:32:00"
    },
    {
      "plateNumber": "闽EP6789",
      "parkName": "漳浦县绥安镇停车场",
      "parkingSpace": "89号车位",
      "entryTime": "2026-01-20 07:45:30",
      "parkingDuration": "3小时45分钟",
      "parkingStatus": "即将超时",
      "sensorStatus": "正常",
      "overtimeReminderThreshold": "4小时",
      "exceptionFlag": "无",
      "processingStatus": "无需处理",
      "lastUpdateTime": "2026-01-20 11:32:25"
    },
    {
      "plateNumber": "闽EQ5432",
      "parkName": "芗城区东铺头街道停车场",
      "parkingSpace": "56号车位",
      "entryTime": "2026-01-19 20:15:00",
      "parkingDuration": "15小时20分钟",
      "parkingStatus": "已超时",
      "sensorStatus": "信号弱",
      "overtimeReminderThreshold": "8小时",
      "exceptionFlag": "超时+传感器异常",
      "processingStatus": "处理中",
      "lastUpdateTime": "2026-01-20 11:32:50"
    },
    {
      "plateNumber": "闽ER9876",
      "parkName": "云霄县云陵镇停车场",
      "parkingSpace": "33号车位",
      "entryTime": "2026-01-20 09:40:15",
      "parkingDuration": "1小时50分钟",
      "parkingStatus": "正常在停",
      "sensorStatus": "正常",
      "overtimeReminderThreshold": "6小时",
      "exceptionFlag": "无",
      "processingStatus": "无需处理",
      "lastUpdateTime": "2026-01-20 11:33:15"
    },
    {
      "plateNumber": "闽ES8765",
      "parkName": "平和县小溪镇停车场",
      "parkingSpace": "102号车位",
      "entryTime": "2026-01-19 23:30:22",
      "parkingDuration": "12小时5分钟",
      "parkingStatus": "异常停留",
      "sensorStatus": "故障",
      "overtimeReminderThreshold": "10小时",
      "exceptionFlag": "车位占用异常",
      "processingStatus": "已处理",
      "lastUpdateTime": "2026-01-20 11:33:40"
    }
  ];
};

/** 新增/修改的表单/列表的搜索表单 */
/** 车辆在停数据 - 新增/修改的表单/列表的搜索表单 */
export function useFormSchema() {
  return [
    {
      fieldName: 'plateNumber',
      label: '车牌号码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入车牌号码（如：闽E12345）',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'parkName',
      label: '所属车场',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入所属车场名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'parkingSpace',
      label: '所属车位',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入所属车位（如：86号车位）',
      },
      rules: 'required',
    },
    {
      fieldName: 'entryTime',
      label: '入场时间',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入入场时间（格式：YYYY-MM-DD HH:mm:ss）',
      },
      rules: 'required',
    },
    {
      fieldName: 'parkingDuration',
      label: '在停时长',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入在停时长（如：2小时10分钟）',
        disabled: true, // 时长一般自动计算，设为禁用
      },
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '正常在停', value: '正常在停' },
          { label: '即将超时', value: '即将超时' },
          { label: '已超时', value: '已超时' },
          { label: '异常停留', value: '异常停留' },
        ],
        placeholder: '请选择在停状态',
        showSearch: true,
      },
      defaultValue: '正常在停',
      fieldName: 'parkingStatus',
      label: '在停状态',
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '正常', value: '正常' },
          { label: '离线', value: '离线' },
          { label: '故障', value: '故障' },
          { label: '信号弱', value: '信号弱' },
        ],
        placeholder: '请选择传感器状态',
        showSearch: true,
      },
      defaultValue: '正常',
      fieldName: 'sensorStatus',
      label: '传感器状态',
      rules: 'required',
    },
    {
      fieldName: 'overtimeReminderThreshold',
      label: '超时长提醒阈值',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入超时长提醒阈值（如：8小时）',
      },
      rules: 'required',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '无', value: '无' },
          { label: '超时', value: '超时' },
          { label: '传感器异常', value: '传感器异常' },
          { label: '车位占用异常', value: '车位占用异常' },
        ],
        placeholder: '请选择异常标识',
        showSearch: true,
      },
      defaultValue: '无',
      fieldName: 'exceptionFlag',
      label: '异常标识',
    },
    {
      component: 'Select',
      labelWidth: '100',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未处理', value: '未处理' },
          { label: '处理中', value: '处理中' },
          { label: '已处理', value: '已处理' },
          { label: '无需处理', value: '无需处理' },
        ],
        placeholder: '请选择处理状态',
        showSearch: true,
      },
      defaultValue: '无需处理',
      fieldName: 'processingStatus',
      label: '处理状态',
    },
    {
      fieldName: 'lastUpdateTime',
      label: '最后更新时间',
      component: 'Input',
      labelWidth: '100',
      componentProps: {
        placeholder: '请输入最后更新时间（格式：YYYY-MM-DD HH:mm:ss）',
        disabled: true, // 更新时间自动生成，设为禁用
      },
    },
  ];
}

/** 表格字段 */
/** 车辆在停数据 - 表格字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'plateNumber',
      title: '车牌号码',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'parkName',
      title: '所属车场',
      minWidth: 200,
      sortable: true,
      slots: { default: 'parkName' },
    },
    {
      field: 'parkingSpace',
      title: '所属车位',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'entryTime',
      title: '入场时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'parkingDuration',
      title: '在停时长',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'parkingStatus',
      title: '在停状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'sensorStatus',
      title: '传感器状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'overtimeReminderThreshold',
      title: '超时长提醒阈值',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'exceptionFlag',
      title: '异常标识',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'processingStatus',
      title: '处理状态',
      minWidth: 120,
      sortable: true, 
    },
    {
      field: 'lastUpdateTime',
      title: '最后更新时间',
      minWidth: 180,
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
/** 车辆在停数据 - 文字描述对象 */
export const textObj = {
  editText: '编辑车辆在停信息',
  addText: '新增车辆在停信息',
  excelName: '车辆在停列表',
  excelAllName: '全市车辆在停数据.xlsx',
  total: '在停车辆数量10;涉及车场8;异常车辆2',
};