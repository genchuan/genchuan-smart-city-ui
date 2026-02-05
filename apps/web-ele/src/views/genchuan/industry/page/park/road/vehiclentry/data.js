export const dataList = () => {
    return [
        {
            "targetBerthNo": "B00201",
            "licensePlate": "闽E12345",
            "vehicleType": "小型汽车",
            "plateColor": "蓝色",
            "entryTime": "2026-01-28 07:45:30",
            "parkingStatus": "占用"
        },
        {
            "targetBerthNo": "B00202",
            "licensePlate": "",
            "vehicleType": "",
            "plateColor": "",
            "entryTime": "2026-01-28 00:00:00",
            "parkingStatus": "空闲"
        },
        {
            "targetBerthNo": "B00203",
            "licensePlate": "闽E67890",
            "vehicleType": "新能源汽车",
            "plateColor": "绿色",
            "entryTime": "2026-01-28 08:20:15",
            "parkingStatus": "占用"
        },
        {
            "targetBerthNo": "B00204",
            "licensePlate": "",
            "vehicleType": "",
            "plateColor": "",
            "entryTime": "2026-01-27 18:00:00",
            "parkingStatus": "禁用"
        },
        {
            "targetBerthNo": "B00205",
            "licensePlate": "闽E54321",
            "vehicleType": "大型汽车",
            "plateColor": "黄色",
            "entryTime": "2026-01-28 09:10:40",
            "parkingStatus": "占用"
        },
        {
            "targetBerthNo": "B00206",
            "licensePlate": "闽E98765",
            "vehicleType": "摩托车",
            "plateColor": "蓝色",
            "entryTime": "2026-01-28 10:05:22",
            "parkingStatus": "占用"
        }, 
        {
            "targetBerthNo": "B00208",
            "licensePlate": "闽E11223",
            "vehicleType": "其他",
            "plateColor": "白色",
            "entryTime": "2026-01-28 11:30:00",
            "parkingStatus": "占用"
        }, 
        {
            "targetBerthNo": "B00210",
            "licensePlate": "闽E33445",
            "vehicleType": "新能源汽车",
            "plateColor": "绿色",
            "entryTime": "2026-01-28 13:15:50",
            "parkingStatus": "占用"
        }
    ];
};

/** 道路泊位新增/修改的表单/搜索表单（适配新字段） */
export function useFormSchema() {
    return [
        {
            fieldName: 'targetBerthNo',
            label: '目标泊位号',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入目标泊位号（如：B00201）',
            },
            rules: 'required',
        },
        {
            fieldName: 'licensePlate',
            label: '车牌号码',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入车牌号码（如：闽E12345）',
            },
            // 非必填（空闲/禁用状态无车牌）
            rules: '',
        },
        {
            fieldName: 'vehicleType',
            label: '车辆类型',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择车辆类型',
                options: [
                    { label: '小型汽车', value: '小型汽车' },
                    { label: '大型汽车', value: '大型汽车' },
                    { label: '新能源汽车', value: '新能源汽车' },
                    { label: '摩托车', value: '摩托车' },
                    { label: '其他', value: '其他' }
                ]
            },
            // 非必填（空闲/禁用状态无车辆类型）
            rules: '',
        },
        {
            fieldName: 'plateColor',
            label: '车牌颜色',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择车牌颜色',
                options: [
                    { label: '蓝色', value: '蓝色' },
                    { label: '黄色', value: '黄色' },
                    { label: '绿色', value: '绿色' },
                    { label: '白色', value: '白色' },
                    { label: '黑色', value: '黑色' }
                ]
            },
            // 非必填（空闲/禁用状态无车牌颜色）
            rules: '',
        },
        {
            fieldName: 'entryTime',
            label: '录入时间',
            component: 'DatePicker',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择录入时间',
                format: 'YYYY-MM-DD HH:mm:ss',
                valueFormat: 'YYYY-MM-DD HH:mm:ss',
                showTime: true // 显示时分秒选择
            },
            rules: 'required',
        },
        {
            fieldName: 'parkingStatus',
            label: '停车状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择停车状态',
                options: [
                    { label: '占用', value: '占用' },
                    { label: '空闲', value: '空闲' },
                    { label: '禁用', value: '禁用' }
                ]
            },
            rules: 'required',
        }
    ];
}

/** 道路泊位表格字段（适配新字段） */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'targetBerthNo',
            title: '目标泊位号',
            minWidth: 120,
            sortable: true,
            slots: { default: 'targetBerthNo' },
        },
        {
            field: 'licensePlate',
            title: '车牌号码',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'vehicleType',
            title: '车辆类型',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'plateColor',
            title: '车牌颜色',
            minWidth: 100,
            sortable: true,
        },
        {
            field: 'entryTime',
            title: '录入时间',
            minWidth: 180,
            sortable: true,
        },
        {
            field: 'parkingStatus',
            title: '停车状态',
            minWidth: 100,
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

/** 道路泊位文字描述对象（适配新字段） */
export const textObj = {
    editText: '编辑泊位停车信息',
    addText: '新增泊位停车信息',
    excelName: '泊位停车信息列表',
    excelAllName: '全市泊位停车数据.xlsx',
    total: ' 总计: 泊位停车数据215条',
};