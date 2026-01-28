/** 停车计费表格初始数据 */
export const dataList = () => {
    return [
        {
            "targetBerthNo": "B00201", // 目标泊位号
            "currentParkingVehicle": "闽E·88990", // 当前停放车辆
            "parkingDuration": "2小时35分钟", // 停车时长
            "receivableAmount": 15.50, // 应收金额
            "endTime": "2026-01-28 18:45:00" // 结束时间
        },
        {
            "targetBerthNo": "B00202",
            "currentParkingVehicle": "闽E·12345",
            "parkingDuration": "5小时10分钟",
            "receivableAmount": 28.00,
            "endTime": "2026-01-28 21:20:00"
        },
        {
            "targetBerthNo": "B00203",
            "currentParkingVehicle": "闽E·67890",
            "parkingDuration": "1小时20分钟",
            "receivableAmount": 8.00,
            "endTime": "2026-01-28 17:10:00"
        },
        {
            "targetBerthNo": "B00204",
            "currentParkingVehicle": "闽E·56789",
            "parkingDuration": "8小时45分钟",
            "receivableAmount": 45.00,
            "endTime": "2026-01-29 00:30:00"
        },
        {
            "targetBerthNo": "B00205",
            "currentParkingVehicle": "闽E·98765",
            "parkingDuration": "3小时5分钟",
            "receivableAmount": 19.00,
            "endTime": "2026-01-28 19:15:00"
        }
    ];
};

/** 停车计费新增/修改的表单/搜索表单 */
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
            fieldName: 'currentParkingVehicle',
            label: '当前停放车辆',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入车牌号（如：闽E·88990）',
            },
            rules: 'required',
        },
        {
            fieldName: 'parkingDuration',
            label: '停车时长',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入停车时长（如：2小时35分钟）',
            },
            rules: 'required',
        },
        {
            fieldName: 'receivableAmount',
            label: '应收金额',
            component: 'InputNumber', // 金额用数字输入框，避免输入非数字
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入应收金额',
                precision: 2, // 保留2位小数
                min: 0 // 金额不能为负数
            },
            rules: 'required',
        },
        {
            fieldName: 'endTime',
            label: '结束时间',
            component: 'DatePicker', // 时间选择器，适配时间输入
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择结束时间',
                format: 'YYYY-MM-DD HH:mm:ss',
                valueFormat: 'YYYY-MM-DD HH:mm:ss',
                showTime: true // 显示时分秒选择
            },
            rules: 'required',
        }
    ];
}

/** 停车计费表格字段 */
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
            field: 'currentParkingVehicle',
            title: '当前停放车辆',
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
            field: 'receivableAmount',
            title: '应收金额',
            minWidth: 100,
            sortable: true, 
        },
        {
            field: 'endTime',
            title: '结束时间',
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

/** 停车计费文字描述对象 */
export const textObj = {
    editText: '编辑停车计费',
    addText: '新增停车计费',
    excelName: '停车计费列表',
    excelAllName: '全市停车计费数据.xlsx',
    total: ' 总计: 停车计费记录数215',
};