/** 停车欠费统计表格初始数据 */
export const dataList = () => {
    return [
        {
            "plateNo": "闽E88888",      // 车牌号码
            "arrearsAmount": 68.50,     // 欠费金额
            "arrearsOrderCount": 3,     // 欠费订单数
            "areaName": "芗城区东铺头街道" // 片区
        },
        {
            "plateNo": "闽E99999",
            "arrearsAmount": 120.00,
            "arrearsOrderCount": 5,
            "areaName": "芗城区巷口街道"
        },
        {
            "plateNo": "闽E77777",
            "arrearsAmount": 45.80,
            "arrearsOrderCount": 2,
            "areaName": "龙文区碧湖街道"
        },
        {
            "plateNo": "闽E66666",
            "arrearsAmount": 210.20,
            "arrearsOrderCount": 8,
            "areaName": "龙文区蓝田街道"
        },
        {
            "plateNo": "闽E55555",
            "arrearsAmount": 89.00,
            "arrearsOrderCount": 4,
            "areaName": "龙海区石码街道"
        }
    ];
};

/** 停车欠费统计新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
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
            fieldName: 'arrearsAmount',
            label: '欠费金额',
            component: 'InputNumber',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入欠费金额',
                precision: 2, // 保留两位小数
                min: 0        // 金额不能为负数
            },
            rules: 'required',
        },
        {
            fieldName: 'arrearsOrderCount',
            label: '欠费订单数',
            component: 'InputNumber',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入欠费订单数',
                min: 0,       // 订单数不能为负数
                step: 1       // 步长为1，只能输入整数
            },
            rules: 'required',
        },
        {
            fieldName: 'areaName',
            label: '片区',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择片区',
                options: [
                    { label: '芗城区东铺头街道', value: '芗城区东铺头街道' },
                    { label: '芗城区巷口街道', value: '芗城区巷口街道' },
                    { label: '龙文区碧湖街道', value: '龙文区碧湖街道' },
                    { label: '龙文区蓝田街道', value: '龙文区蓝田街道' },
                    { label: '龙海区石码街道', value: '龙海区石码街道' },
                    { label: '龙海区海澄镇', value: '龙海区海澄镇' },
                    { label: '长泰区武安镇', value: '长泰区武安镇' },
                    { label: '漳浦县绥安镇', value: '漳浦县绥安镇' }
                ]
            },
            rules: 'required',
        }
    ];
}

/** 停车欠费统计表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'plateNo',
            title: '车牌号码',
            minWidth: 120,
            sortable: true,
            slots: { default: 'plateNo' },
        },
        {
            field: 'arrearsAmount',
            title: '欠费金额',
            minWidth: 100,
            sortable: true, 
        },
        {
            field: 'arrearsOrderCount',
            title: '欠费订单数',
            minWidth: 100,
            sortable: true,
            slots: { default: 'arrearsOrderCount' },
        },
        {
            field: 'areaName',
            title: '片区',
            minWidth: 180,
            sortable: true,
        },
        {
            title: '操作',
            width: 120,
            fixed: 'right',
            slots: { default: 'actions' },
        },
    ];
}

/** 停车欠费统计文字描述对象 */
export const textObj = {
    editText: '编辑停车欠费',
    addText: '新增停车欠费',
    excelName: '停车欠费列表',
    excelAllName: '全市停车欠费数据.xlsx',
    total: ' 总计: 欠费车辆数215',
};