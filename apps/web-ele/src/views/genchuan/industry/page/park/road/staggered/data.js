/** 订单表格初始数据 */
export const dataList = () => {
    return [
        {
            "orderNo": "OD20260128001", // 订单编号
            "plateNo": "闽E88888",      // 车牌号码
            "berthNo": "B00201",        // 泊位编号
            "bookingPeriod": "08:00-18:00", // 预订时段
            "timeRule": "工作日错时，周末全天", // 错时规则
            "rentCycle": "1天",         // 出租周期
            "payAmount": 20.00,         // 支付金额
            "contactPerson": "张三",    // 联系人
            "contactPhone": "13800138000", // 联系电话
            "payStatus": "已支付",      // 支付状态
            "effectiveStatus": "生效中", // 生效状态
            "useStatus": "使用中",      // 使用状态
            "completeTime": "2026-01-29 18:00:00" // 完成时间
        },
        {
            "orderNo": "OD20260128002",
            "plateNo": "闽E99999",
            "berthNo": "B00202",
            "bookingPeriod": "09:00-20:00",
            "timeRule": "全天可用",
            "rentCycle": "3天",
            "payAmount": 55.50,
            "contactPerson": "李四",
            "contactPhone": "13900139000",
            "payStatus": "已支付",
            "effectiveStatus": "生效中",
            "useStatus": "空闲",
            "completeTime": "2026-01-31 20:00:00"
        },
        {
            "orderNo": "OD20260128003",
            "plateNo": "闽E77777",
            "berthNo": "B00203",
            "bookingPeriod": "10:00-22:00",
            "timeRule": "节假日错时",
            "rentCycle": "7天",
            "payAmount": 120.00,
            "contactPerson": "王五",
            "contactPhone": "13700137000",
            "payStatus": "未支付",
            "effectiveStatus": "未生效",
            "useStatus": "未使用",
            "completeTime": "2026-02-04 22:00:00"
        },
        {
            "orderNo": "OD20260128004",
            "plateNo": "闽E66666",
            "berthNo": "B00204",
            "bookingPeriod": "07:00-19:00",
            "timeRule": "工作日错时",
            "rentCycle": "1个月",
            "payAmount": 300.00,
            "contactPerson": "赵六",
            "contactPhone": "13600136000",
            "payStatus": "已退款",
            "effectiveStatus": "已失效",
            "useStatus": "已取消",
            "completeTime": "2026-02-28 19:00:00"
        },
        {
            "orderNo": "OD20260128005",
            "plateNo": "闽E55555",
            "berthNo": "B00205",
            "bookingPeriod": "12:00-24:00",
            "timeRule": "全天可用",
            "rentCycle": "2天",
            "payAmount": 38.00,
            "contactPerson": "孙七",
            "contactPhone": "13500135000",
            "payStatus": "已支付",
            "effectiveStatus": "生效中",
            "useStatus": "使用中",
            "completeTime": "2026-01-30 24:00:00"
        }
    ];
};

/** 订单新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
        {
            fieldName: 'orderNo',
            label: '订单编号',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入订单编号',
                disabled: true // 订单编号通常自动生成，设置为禁用
            },
            rules: 'required',
        },
        {
            fieldName: 'plateNo',
            label: '车牌号码',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入车牌号码（如：闽E88888）',
            },
            rules: 'required',
        },
        {
            fieldName: 'berthNo',
            label: '泊位编号',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择泊位编号',
                options: [
                    { label: 'B00201', value: 'B00201' },
                    { label: 'B00202', value: 'B00202' },
                    { label: 'B00203', value: 'B00203' },
                    { label: 'B00204', value: 'B00204' },
                    { label: 'B00205', value: 'B00205' },
                    { label: 'B00206', value: 'B00206' },
                    { label: 'B00207', value: 'B00207' },
                    { label: 'B00208', value: 'B00208' },
                    { label: 'B00209', value: 'B00209' },
                    { label: 'B00210', value: 'B00210' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'bookingPeriod',
            label: '预订时段',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入预订时段（如：08:00-18:00）',
            },
            rules: 'required',
        },
        {
            fieldName: 'timeRule',
            label: '错时规则',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择错时规则',
                options: [
                    { label: '全天可用', value: '全天可用' },
                    { label: '工作日错时，周末全天', value: '工作日错时，周末全天' },
                    { label: '节假日错时', value: '节假日错时' },
                    { label: '仅工作日可用', value: '仅工作日可用' },
                    { label: '仅周末可用', value: '仅周末可用' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'rentCycle',
            label: '出租周期',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择出租周期',
                options: [
                    { label: '1天', value: '1天' },
                    { label: '2天', value: '2天' },
                    { label: '3天', value: '3天' },
                    { label: '7天', value: '7天' },
                    { label: '1个月', value: '1个月' },
                    { label: '3个月', value: '3个月' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'payAmount',
            label: '支付金额',
            component: 'InputNumber',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入支付金额',
                precision: 2, // 保留两位小数
                min: 0        // 金额不能为负数
            },
            rules: 'required',
        },
        {
            fieldName: 'contactPerson',
            label: '联系人',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入联系人姓名',
            },
            rules: 'required',
        },
        {
            fieldName: 'contactPhone',
            label: '联系电话',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入联系电话',
            },
            rules: 'required',
        },
        {
            fieldName: 'payStatus',
            label: '支付状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择支付状态',
                options: [
                    { label: '未支付', value: '未支付' },
                    { label: '已支付', value: '已支付' },
                    { label: '已退款', value: '已退款' },
                    { label: '支付中', value: '支付中' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'effectiveStatus',
            label: '生效状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择生效状态',
                options: [
                    { label: '未生效', value: '未生效' },
                    { label: '生效中', value: '生效中' },
                    { label: '已失效', value: '已失效' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'useStatus',
            label: '使用状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择使用状态',
                options: [
                    { label: '未使用', value: '未使用' },
                    { label: '使用中', value: '使用中' },
                    { label: '空闲', value: '空闲' },
                    { label: '已取消', value: '已取消' },
                    { label: '已完成', value: '已完成' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'completeTime',
            label: '完成时间',
            component: 'DatePicker',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择完成时间',
                format: 'YYYY-MM-DD HH:mm:ss',
                valueFormat: 'YYYY-MM-DD HH:mm:ss',
                showTime: true
            },
            rules: 'required',
        }
    ];
}

/** 订单表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'orderNo',
            title: '订单编号',
            minWidth: 150,
            sortable: true,
            slots: { default: 'orderNo' },
        },
        {
            field: 'plateNo',
            title: '车牌号码',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'berthNo',
            title: '泊位编号',
            minWidth: 100,
            sortable: true,
        },
        {
            field: 'bookingPeriod',
            title: '预订时段',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'timeRule',
            title: '错时规则',
            minWidth: 150,
            sortable: true,
        },
        {
            field: 'rentCycle',
            title: '出租周期',
            minWidth: 100,
            sortable: true,
        },
        {
            field: 'payAmount',
            title: '支付金额',
            minWidth: 100,
            sortable: true, 
        },
        {
            field: 'contactPerson',
            title: '联系人',
            minWidth: 100,
            sortable: true,
        },
        {
            field: 'contactPhone',
            title: '联系电话',
            minWidth: 130,
            sortable: true,
        },
        {
            field: 'payStatus',
            title: '支付状态',
            minWidth: 100,
            sortable: true
        },
        {
            field: 'effectiveStatus',
            title: '生效状态',
            minWidth: 100,
            sortable: true
        },
        {
            field: 'useStatus',
            title: '使用状态',
            minWidth: 100,
            sortable: true
        },
        {
            field: 'completeTime',
            title: '完成时间',
            minWidth: 180,
            sortable: true,
        },
        {
            title: '操作',
            width: 80,
            fixed: 'right',
            slots: { default: 'actions' },
        },
    ];
}

/** 订单文字描述对象 */
export const textObj = {
    editText: '编辑订单',
    addText: '新增订单',
    excelName: '订单列表',
    excelAllName: '全市订单数据.xlsx',
    total: ' 总计: 订单数量215',
};