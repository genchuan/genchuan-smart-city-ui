/** 停车欠费缴费表格初始数据 */
export const dataList = () => {
    return [
        {
            "arrearsQrCode": "https://qr.pay.com/OD20260128001", // 欠费聚合支付二维码（完整链接）
            "paySyncResult": "同步成功", // 缴费状态同步结果
            "qrCode": "QR20260128001", // 二维码编号
            "amount": 68.50 // 金额
        },
        {
            "arrearsQrCode": "https://qr.pay.com/OD20260128002",
            "paySyncResult": "同步成功",
            "qrCode": "QR20260128002",
            "amount": 120.00
        },
        {
            "arrearsQrCode": "https://qr.pay.com/OD20260128003",
            "paySyncResult": "同步失败（未查询到缴费记录）",
            "qrCode": "QR20260128003",
            "amount": 45.80
        },
        {
            "arrearsQrCode": "https://qr.pay.com/OD20260128004",
            "paySyncResult": "同步中",
            "qrCode": "QR20260128004",
            "amount": 210.20
        },
        {
            "arrearsQrCode": "https://qr.pay.com/OD20260128005",
            "paySyncResult": "同步成功",
            "qrCode": "QR20260128005",
            "amount": 89.00
        }
    ];
};

/** 停车欠费缴费新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
        {
            fieldName: 'arrearsQrCode',
            label: '欠费聚合支付二维码',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入欠费聚合支付二维码（完整链接）',
            },
            rules: 'required',
        },
        {
            fieldName: 'paySyncResult',
            label: '缴费状态同步结果',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择缴费状态同步结果',
                options: [
                    { label: '同步成功', value: '同步成功' },
                    { label: '同步中', value: '同步中' },
                    { label: '同步失败（未查询到缴费记录）', value: '同步失败（未查询到缴费记录）' },
                    { label: '同步失败（二维码已过期）', value: '同步失败（二维码已过期）' },
                    { label: '同步失败（网络异常）', value: '同步失败（网络异常）' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'qrCode',
            label: '二维码',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入二维码编号（如：QR20260128001）',
            },
            rules: 'required',
        },
        {
            fieldName: 'amount',
            label: '金额',
            component: 'InputNumber',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入金额',
                precision: 2, // 保留两位小数
                min: 0        // 金额不能为负数
            },
            rules: 'required',
        }
    ];
}

/** 停车欠费缴费表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'arrearsQrCode',
            title: '欠费聚合支付二维码',
            minWidth: 280, // 加宽适配二维码链接展示
            sortable: false, // 链接无需排序
            slots: { default: 'arrearsQrCode' },
        },
        {
            field: 'paySyncResult',
            title: '缴费状态同步结果',
            minWidth: 180,
            sortable: true,
        },
        {
            field: 'qrCode',
            title: '二维码',
            minWidth: 150,
            sortable: true,
        },
        {
            field: 'amount',
            title: '金额',
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

/** 停车欠费缴费文字描述对象 */
export const textObj = {
    editText: '编辑停车欠费缴费',
    addText: '新增停车欠费缴费',
    excelName: '停车欠费缴费列表',
    excelAllName: '全市停车欠费缴费数据.xlsx',
    total: ' 总计: 停车欠费缴费记录数215',
};