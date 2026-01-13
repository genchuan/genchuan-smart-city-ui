/** 泊位表格初始数据 */
export const dataList = () => {
    return [
        {
            "berthId": "B00201",
            "chargingPileId": "LW001",
            "deviceNo": "350603002",
            "bindCmd": "占用",
            "unbindReason": "设施维修,暂停使用",
            "bindingStatus": "已绑定", // 新增：绑定状态
            "chargingPileOnlineStatus": "离线" // 新增：计费桩在线状态
        },
        {
            "berthId": "B00202",
            "chargingPileId": "LW002",
            "deviceNo": "350603003",
            "bindCmd": "空闲",
            "unbindReason": "",
            "bindingStatus": "已绑定",
            "chargingPileOnlineStatus": "在线"
        },
        {
            "berthId": "B00203",
            "chargingPileId": "LW003",
            "deviceNo": "350603004",
            "bindCmd": "占用",
            "unbindReason": "",
            "bindingStatus": "已绑定",
            "chargingPileOnlineStatus": "在线"
        },
        {
            "berthId": "B00204",
            "chargingPileId": "LW004",
            "deviceNo": "350603005",
            "bindCmd": "禁用",
            "unbindReason": "设备故障,待更换",
            "bindingStatus": "未绑定",
            "chargingPileOnlineStatus": "离线"
        },
        {
            "berthId": "B00205",
            "chargingPileId": "LW005",
            "deviceNo": "350603006",
            "bindCmd": "空闲",
            "unbindReason": "",
            "bindingStatus": "已绑定",
            "chargingPileOnlineStatus": "在线"
        },
        {
            "berthId": "B00206",
            "chargingPileId": "LW006",
            "deviceNo": "350603007",
            "bindCmd": "占用",
            "unbindReason": "",
            "bindingStatus": "已绑定",
            "chargingPileOnlineStatus": "在线"
        },
        {
            "berthId": "B00207",
            "chargingPileId": "LW007",
            "deviceNo": "350603008",
            "bindCmd": "禁用",
            "unbindReason": "道路施工,临时停用",
            "bindingStatus": "未绑定",
            "chargingPileOnlineStatus": "离线"
        },
        {
            "berthId": "B00208",
            "chargingPileId": "LW008",
            "deviceNo": "350603009",
            "bindCmd": "空闲",
            "unbindReason": "",
            "bindingStatus": "已绑定",
            "chargingPileOnlineStatus": "在线"
        },
        {
            "berthId": "B00209",
            "chargingPileId": "LW009",
            "deviceNo": "350603010",
            "bindCmd": "占用",
            "unbindReason": "",
            "bindingStatus": "已绑定",
            "chargingPileOnlineStatus": "离线" // 占用状态但设备离线，贴合真实异常场景
        },
        {
            "berthId": "B00210",
            "chargingPileId": "LW010",
            "deviceNo": "350603011",
            "bindCmd": "禁用",
            "unbindReason": "系统升级,暂时停用",
            "bindingStatus": "未绑定",
            "chargingPileOnlineStatus": "离线"
        }
    ];;
};

/** 泊位新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
        {
            fieldName: 'berthId',
            label: '泊位ID',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入泊位ID',
            },
            rules: 'required',
        },
        {
            fieldName: 'chargingPileId',
            label: '计费桩设备ID',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入计费桩设备ID',
            },
            rules: 'required',
        },
        {
            fieldName: 'deviceNo',
            label: '设备编号',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择设备编号',
                options: [
                    { label: '芗城区东铺头街道 350602001', value: '350602001' },
                    { label: '芗城区巷口街道 350602002', value: '350602002' },
                    { label: '芗城区西桥街道 350602004', value: '350602004' },
                    { label: '龙文区碧湖街道 350603002', value: '350603002' },
                    { label: '龙文区蓝田街道 350603005', value: '350603005' },
                    { label: '龙海区石码街道 350604001', value: '350604001' },
                    { label: '龙海区海澄镇 350604002', value: '350604002' },
                    { label: '长泰区武安镇 350625001', value: '350625001' },
                    { label: '漳浦县绥安镇 350623001', value: '350623001' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'bindCmd',
            label: '绑定操作指令',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择绑定操作指令',
                options: [
                    { label: '占用', value: '占用' },
                    { label: '空闲', value: '空闲' },
                    { label: '禁用', value: '禁用' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'bindingStatus',
            label: '绑定状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择绑定状态',
                options: [
                    { label: '已绑定', value: '已绑定' },
                    { label: '未绑定', value: '未绑定' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'chargingPileOnlineStatus',
            label: '计费桩在线状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择计费桩在线状态',
                options: [
                    { label: '在线', value: '在线' },
                    { label: '离线', value: '离线' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'unbindReason',
            label: '解绑原因',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入解绑原因（未绑定状态必填）',
            }, 
        }, 
    ];
}

/** 泊位表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'berthId',
            title: '泊位ID',
            minWidth: 100,
            sortable: true,
        },
        {
            field: 'chargingPileId',
            title: '计费桩设备ID',
            minWidth: 120,
            sortable: true,
            slots: { default: 'chargingPileId' },
        },
        {
            field: 'deviceNo',
            title: '设备编号',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'bindingStatus',
            title: '绑定状态',
            minWidth: 100,
            sortable: true
        },
        {
            field: 'chargingPileOnlineStatus',
            title: '计费桩在线状态',
            minWidth: 120,
            sortable: true
        },
        {
            field: 'unbindReason',
            title: '解绑原因',
            minWidth: 200,
            sortable: true,
        },
        {
            title: '操作',
            width: 240,
            fixed: 'right',
            slots: { default: 'actions' },
        },
    ];
}

/** 泊位文字描述对象 */
export const textObj = {
    editText: '编辑计费庄',
    addText: '新增计费庄',
    excelName: '计费庄列表',
    excelAllName: '全市计费庄数据.xlsx',
    total: ' 总计: 计费庄数量215',
};