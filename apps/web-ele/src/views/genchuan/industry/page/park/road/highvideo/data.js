/** 高位视频设备管理表格初始数据 */
export const dataList = () => {
    return [
        {
            "highVideoDevice": "HVD2026001", // 高位视频设备
            "status": "正常运行", // 状态
            "coverBerth": "B00201、B00202、B00203", // 覆盖泊位
            "paramConfig": "识别精度99.8%、抓拍帧率25fps、夜间补光开启、存储周期7天", // 参数配置
            "realTimeImageData": "rtsp://stream.hvd.com/HVD2026001/live", // 实时画面数据（流媒体链接）
            "recognitionStatData": "今日识别286辆、有效识别282辆、识别率98.6%", // 识别统计数据
            "captureRecord": "2026-01-28 18:45: 闽E·88990（已存档）、2026-01-28 18:50: 闽E·12345（已存档）", // 抓拍记录
            "licensePlateRecogResult": "支持蓝牌、黄牌、新能源车牌，无遮挡识别率99.0%，轻微遮挡识别率95.0%" // 车牌识别结果
        },
        {
            "highVideoDevice": "HVD2026002",
            "status": "故障待维修",
            "coverBerth": "B00204、B00205、B00206、B00207",
            "paramConfig": "识别精度99.8%、抓拍帧率25fps、夜间补光开启、存储周期7天",
            "realTimeImageData": "rtsp://stream.hvd.com/HVD2026002/live（无法访问）",
            "recognitionStatData": "今日识别152辆、有效识别138辆、识别率90.8%",
            "captureRecord": "2026-01-28 16:30: 闽E·67890（存档失败）、2026-01-28 16:35: 无有效抓拍",
            "licensePlateRecogResult": "支持蓝牌、黄牌、新能源车牌，无遮挡识别率99.0%，轻微遮挡识别率95.0%（当前故障，无法识别）"
        },
        {
            "highVideoDevice": "HVD2026003",
            "status": "正常运行",
            "coverBerth": "B00208、B00209、B00210",
            "paramConfig": "识别精度99.8%、抓拍帧率25fps、夜间补光开启、存储周期7天",
            "realTimeImageData": "rtsp://stream.hvd.com/HVD2026003/live",
            "recognitionStatData": "今日识别320辆、有效识别318辆、识别率99.4%",
            "captureRecord": "2026-01-28 17:10: 闽E·56789（已存档）、2026-01-28 17:15: 闽E·98765（已存档）",
            "licensePlateRecogResult": "支持蓝牌、黄牌、新能源车牌，无遮挡识别率99.0%，轻微遮挡识别率95.0%"
        },
        {
            "highVideoDevice": "HVD2026004",
            "status": "正常运行",
            "coverBerth": "B00211、B00212、B00213",
            "paramConfig": "识别精度99.8%、抓拍帧率25fps、夜间补光开启、存储周期7天",
            "realTimeImageData": "rtsp://stream.hvd.com/HVD2026004/live",
            "recognitionStatData": "今日识别298辆、有效识别295辆、识别率98.9%",
            "captureRecord": "2026-01-28 19:00: 闽E·11111（已存档）、2026-01-28 19:05: 闽E·22222（已存档）",
            "licensePlateRecogResult": "支持蓝牌、黄牌、新能源车牌，无遮挡识别率99.0%，轻微遮挡识别率95.0%"
        },
        {
            "highVideoDevice": "HVD2026005",
            "status": "已停用",
            "coverBerth": "B00214、B00215（已解绑）",
            "paramConfig": "识别精度99.8%、抓拍帧率25fps、夜间补光开启、存储周期7天（已停用）",
            "realTimeImageData": "已停用，无实时画面",
            "recognitionStatData": "今日识别0辆、有效识别0辆、识别率0%",
            "captureRecord": "无抓拍记录（设备已停用）",
            "licensePlateRecogResult": "已停用，无法提供车牌识别服务"
        }
    ];
};

/** 高位视频设备管理新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
        {
            fieldName: 'highVideoDevice',
            label: '高位视频设备',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入高位视频设备编号（如：HVD2026001）',
            },
            rules: 'required',
        },
        {
            fieldName: 'status',
            label: '状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择设备状态',
                options: [
                    { label: '正常运行', value: '正常运行' },
                    { label: '故障待维修', value: '故障待维修' },
                    { label: '维修中', value: '维修中' },
                    { label: '已停用', value: '已停用' },
                    { label: '待激活', value: '待激活' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'coverBerth',
            label: '覆盖泊位',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入覆盖泊位（如：B00201、B00202、B00203）',
                type: 'textarea',
                rows: 2
            },
            rules: 'required',
        },
        {
            fieldName: 'paramConfig',
            label: '参数配置',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入参数配置（如：识别精度99.8%、抓拍帧率25fps、夜间补光开启、存储周期7天）',
                type: 'textarea',
                rows: 3
            },
            rules: 'required',
        },
        {
            fieldName: 'realTimeImageData',
            label: '实时画面数据',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入实时画面数据（如：rtsp://stream.hvd.com/HVD2026001/live）',
            },
            rules: 'required',
        },
        {
            fieldName: 'recognitionStatData',
            label: '识别统计数据',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入识别统计数据（如：今日识别286辆、有效识别282辆、识别率98.6%）',
                type: 'textarea',
                rows: 2
            },
            rules: 'required',
        },
        {
            fieldName: 'captureRecord',
            label: '抓拍记录',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入抓拍记录（如：2026-01-28 18:45: 闽E·88990（已存档））',
                type: 'textarea',
                rows: 3
            },
            rules: 'required',
        },
        {
            fieldName: 'licensePlateRecogResult',
            label: '车牌识别结果',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入车牌识别结果（如：支持蓝牌、黄牌、新能源车牌，无遮挡识别率99.0%）',
                type: 'textarea',
                rows: 3
            },
            rules: 'required',
        }
    ];
}

/** 高位视频设备管理表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'highVideoDevice',
            title: '高位视频设备',
            minWidth: 120,
            sortable: true,
            slots: { default: 'highVideoDevice' },
        },
        {
            field: 'status',
            title: '状态',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'coverBerth',
            title: '覆盖泊位',
            minWidth: 180,
            sortable: false,
        },
        {
            field: 'paramConfig',
            title: '参数配置',
            minWidth: 280,
            sortable: false,
        },
        {
            field: 'realTimeImageData',
            title: '实时画面数据',
            minWidth: 280,
            sortable: false,
        },
        {
            field: 'recognitionStatData',
            title: '识别统计数据',
            minWidth: 200,
            sortable: false,
        },
        {
            field: 'captureRecord',
            title: '抓拍记录',
            minWidth: 280,
            sortable: false,
        },
        {
            field: 'licensePlateRecogResult',
            title: '车牌识别结果',
            minWidth: 280,
            sortable: false,
        },
        {
            title: '操作',
            width: 80,
            fixed: 'right',
            slots: { default: 'actions' },
        },
    ];
}

/** 高位视频设备管理文字描述对象 */
export const textObj = {
    editText: '编辑高位视频设备',
    addText: '新增高位视频设备',
    excelName: '高位视频设备列表',
    excelAllName: '全市高位视频设备数据.xlsx',
    total: ' 总计: 高位视频设备数量215',
};