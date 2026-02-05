/** 地磁设备管理表格初始数据 */
export const dataList = () => {
    return [
        {
            "geomagneticDevice": "GD2026001", // 地磁设备
            "status": "正常运行", // 状态
            "boundBerth": "B00201", // 绑定泊位
            "paramConfig": "采样频率5s、上报阈值10cm、低电告警3.0V", // 参数配置
            "faultAlarmRecord": "2026-01-20 09:15: 低电预警（已恢复）", // 故障告警记录
            "maintenanceOrder": "WO20260120001（已完成）", // 维修工单
            "totalWorkingHours": "1260小时", // 累计工作时长
            "reportingFrequency": "30秒/次" // 上报频次
        },
        {
            "geomagneticDevice": "GD2026002",
            "status": "故障待维修",
            "boundBerth": "B00202",
            "paramConfig": "采样频率10s、上报阈值8cm、低电告警3.2V",
            "faultAlarmRecord": "2026-01-27 16:30: 通信中断（未恢复）",
            "maintenanceOrder": "WO20260127001（待派单）",
            "totalWorkingHours": "980小时",
            "reportingFrequency": "60秒/次"
        },
        {
            "geomagneticDevice": "GD2026003",
            "status": "正常运行",
            "boundBerth": "B00203",
            "paramConfig": "采样频率5s、上报阈值10cm、低电告警3.0V",
            "faultAlarmRecord": "无告警记录",
            "maintenanceOrder": "无历史工单",
            "totalWorkingHours": "1580小时",
            "reportingFrequency": "30秒/次"
        },
        {
            "geomagneticDevice": "GD2026004",
            "status": "已停用",
            "boundBerth": "B00204（已解绑）",
            "paramConfig": "采样频率8s、上报阈值12cm、低电告警2.8V",
            "faultAlarmRecord": "2026-01-15 14:20: 硬件故障（已停用）",
            "maintenanceOrder": "WO20260115001（已关闭）",
            "totalWorkingHours": "750小时",
            "reportingFrequency": "已停用，无上报",
        },
        {
            "geomagneticDevice": "GD2026005",
            "status": "正常运行",
            "boundBerth": "B00205",
            "paramConfig": "采样频率5s、上报阈值10cm、低电告警3.0V",
            "faultAlarmRecord": "2026-01-25 08:40: 信号波动（已恢复）",
            "maintenanceOrder": "WO20260125001（已完成）",
            "totalWorkingHours": "1120小时",
            "reportingFrequency": "30秒/次"
        }
    ];
};

/** 地磁设备管理新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
        {
            fieldName: 'geomagneticDevice',
            label: '地磁设备',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入地磁设备编号（如：GD2026001）',
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
                    { label: '已停用', value: '已停用' },
                    { label: '维修中', value: '维修中' },
                    { label: '待激活', value: '待激活' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'boundBerth',
            label: '绑定泊位',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择绑定泊位',
                options: [
                    { label: 'B00201', value: 'B00201' },
                    { label: 'B00202', value: 'B00202' },
                    { label: 'B00203', value: 'B00203' },
                    { label: 'B00204', value: 'B00204' },
                    { label: 'B00205', value: 'B00205' },
                    { label: 'B00206', value: 'B00206' },
                    { label: 'B00207', value: 'B00207' }
                ]
            },
            rules: 'required',
        },
        {
            fieldName: 'paramConfig',
            label: '参数配置',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入参数配置（如：采样频率5s、上报阈值10cm、低电告警3.0V）',
                type: 'textarea',
                rows: 3
            },
            rules: 'required',
        },
        {
            fieldName: 'faultAlarmRecord',
            label: '故障告警记录',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入故障告警记录（如：2026-01-20 09:15: 低电预警（已恢复））',
                type: 'textarea',
                rows: 3
            },
            rules: 'required',
        },
        {
            fieldName: 'maintenanceOrder',
            label: '维修工单',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入维修工单（如：WO20260120001（已完成））',
            },
            rules: 'required',
        },
        {
            fieldName: 'totalWorkingHours',
            label: '累计工作时长',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入累计工作时长（如：1260小时）',
            },
            rules: 'required',
        },
        {
            fieldName: 'reportingFrequency',
            label: '上报频次',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择上报频次',
                options: [
                    { label: '10秒/次', value: '10秒/次' },
                    { label: '30秒/次', value: '30秒/次' },
                    { label: '60秒/次', value: '60秒/次' },
                    { label: '5分钟/次', value: '5分钟/次' },
                    { label: '已停用，无上报', value: '已停用，无上报' }
                ]
            },
            rules: 'required',
        }
    ];
}

/** 地磁设备管理表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'geomagneticDevice',
            title: '地磁设备',
            minWidth: 120,
            sortable: true,
            slots: { default: 'geomagneticDevice' },
        },
        {
            field: 'status',
            title: '状态',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'boundBerth',
            title: '绑定泊位',
            minWidth: 100,
            sortable: true,
        },
        {
            field: 'paramConfig',
            title: '参数配置',
            minWidth: 280,
            sortable: false,
        },
        {
            field: 'faultAlarmRecord',
            title: '故障告警记录',
            minWidth: 280,
            sortable: false,
        },
        {
            field: 'maintenanceOrder',
            title: '维修工单',
            minWidth: 150,
            sortable: true,
        },
        {
            field: 'totalWorkingHours',
            title: '累计工作时长',
            minWidth: 120,
            sortable: true,
        },
        {
            field: 'reportingFrequency',
            title: '上报频次',
            minWidth: 120,
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

/** 地磁设备管理文字描述对象 */
export const textObj = {
    editText: '编辑地磁设备',
    addText: '新增地磁设备',
    excelName: '地磁设备列表',
    excelAllName: '全市地磁设备数据.xlsx',
    total: ' 总计: 地磁设备数量215',
};