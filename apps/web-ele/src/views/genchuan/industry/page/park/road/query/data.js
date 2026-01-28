/** 停车记录表格初始数据（适配新字段） */
export const dataList = () => {
    return [
        {
            "licensePlate": "闽E12345", // 车牌号码
            "vehicleType": "小型汽车", // 车辆类型
            "parkingDuration": "2小时30分钟", // 停车时长
            "arrearsAmount": 15.50 // 欠费金额（元）
        },
        {
            "licensePlate": "闽E67890",
            "vehicleType": "新能源汽车",
            "parkingDuration": "4小时15分钟",
            "arrearsAmount": 28.00
        },
        {
            "licensePlate": "闽E54321",
            "vehicleType": "大型汽车",
            "parkingDuration": "1小时40分钟",
            "arrearsAmount": 0.00
        },
        {
            "licensePlate": "闽E98765",
            "vehicleType": "摩托车",
            "parkingDuration": "8小时20分钟",
            "arrearsAmount": 45.00
        },
        {
            "licensePlate": "闽E11223",
            "vehicleType": "其他",
            "parkingDuration": "0小时50分钟",
            "arrearsAmount": 0.00
        }
    ];
};

/** 停车记录新增/修改的表单/搜索表单（适配新字段） */
export function useFormSchema() {
    return [
        {
            fieldName: 'licensePlate',
            label: '车牌号码',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入车牌号码（如：闽E12345）',
            },
            rules: 'required',
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
            rules: 'required',
        },
        {
            fieldName: 'parkingDuration',
            label: '停车时长',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入停车时长（格式：X小时X分钟）',
            },
            rules: 'required',
        },
        {
            fieldName: 'arrearsAmount',
            label: '欠费金额',
            component: 'InputNumber',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入欠费金额',
                precision: 2, // 保留2位小数
                min: 0, // 欠费金额不能为负数
                step: 0.5 // 步长0.5元
            },
            rules: 'required',
        }
    ];
}

/** 停车记录表格字段（适配新字段） */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'licensePlate',
            title: '车牌号码',
            minWidth: 120,
            sortable: true,
            slots: { default: 'licensePlate' },
        },
        {
            field: 'vehicleType',
            title: '车辆类型',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'parkingDuration',
            title: '停车时长',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'arrearsAmount',
            title: '欠费金额',
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

/** 停车记录文字描述对象（适配新字段） */
export const textObj = {
    editText: '编辑停车记录',
    addText: '新增停车记录',
    excelName: '停车记录列表',
    excelAllName: '全市停车记录数据.xlsx',
    total: ' 总计: 停车记录数量215',
};