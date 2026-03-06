/** 道路泊位表格初始数据 */
export const dataList = () => {
    return [
        {
            "roadName": "新华路", // 道路名称
            "areaName": "芗城区东铺头街道", // 所属片区
            "berthList": "B00201(占用)、B00202(空闲)、B00203(占用)", // 道路下泊位列表（字符串格式）
            "berthOccupyStatus": "部分占用" // 泊位占用状态
        },
        {
            "roadName": "胜利路",
            "areaName": "芗城区巷口街道",
            "berthList": "B00204(禁用)、B00205(空闲)、B00206(空闲)、B00207(禁用)",
            "berthOccupyStatus": "空闲（部分禁用）"
        },
        {
            "roadName": "龙江路",
            "areaName": "龙文区碧湖街道",
            "berthList": "B00208(占用)、B00209(占用)、B00210(占用)",
            "berthOccupyStatus": "全部占用"
        },
        {
            "roadName": "水仙大街",
            "areaName": "龙文区蓝田街道",
            "berthList": "B00211(空闲)、B00212(空闲)、B00213(空闲)",
            "berthOccupyStatus": "全部空闲"
        },
        {
            "roadName": "紫芝路",
            "areaName": "龙海区石码街道",
            "berthList": "B00214(禁用)、B00215(禁用)",
            "berthOccupyStatus": "全部禁用"
        }
    ];
};

/** 道路泊位新增/修改的表单/搜索表单 */
export function useFormSchema() {
    return [
        {
            fieldName: 'roadName',
            label: '道路名称',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入道路名称',
            },
            rules: 'required',
        },
        {
            fieldName: 'areaName',
            label: '所属片区',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择所属片区',
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
        },
        {
            fieldName: 'berthList',
            label: '道路下泊位列表',
            component: 'Input',
            labelWidth: '150',
            componentProps: {
                placeholder: '请输入泊位列表（格式：B00201(占用)、B00202(空闲)）',
                type: 'textarea', // 改为文本域，方便输入长字符串
                rows: 3 // 设置默认行数
            },
            rules: 'required',
        },
        {
            fieldName: 'berthOccupyStatus',
            label: '泊位占用状态',
            component: 'Select',
            labelWidth: '150',
            componentProps: {
                placeholder: '请选择泊位占用状态',
                options: [
                    { label: '全部空闲', value: '全部空闲' },
                    { label: '部分占用', value: '部分占用' },
                    { label: '全部占用', value: '全部占用' },
                    { label: '空闲（部分禁用）', value: '空闲（部分禁用）' },
                    { label: '全部禁用', value: '全部禁用' }
                ]
            },
            rules: 'required',
        }
    ];
}

/** 道路泊位表格字段 */
export function useGridColumns() {
    return [
        { type: 'checkbox', width: 40 },
        {
            field: 'roadName',
            title: '道路名称',
            minWidth: 120,
            sortable: true,
            slots: { default: 'roadName' },
        },
        {
            field: 'areaName',
            title: '所属片区',
            minWidth: 180,
            sortable: true,
        },
        {
            field: 'berthList',
            title: '道路下泊位列表',
            minWidth: 300, // 加宽适配字符串展示
            sortable: false, 
        },
        {
            field: 'berthOccupyStatus',
            title: '泊位占用状态',
            minWidth: 150,
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

/** 道路泊位文字描述对象 */
export const textObj = {
    editText: '编辑道路泊位',
    addText: '新增道路泊位',
    excelName: '道路泊位列表',
    excelAllName: '全市道路泊位数据.xlsx',
    total: ' 总计: 道路泊位数量215',
};