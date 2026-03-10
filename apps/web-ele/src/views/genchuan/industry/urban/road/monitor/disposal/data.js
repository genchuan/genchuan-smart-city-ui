/** 道路预警工单处置表单 Schema - 匹配后端数据字段 */
export function useFormSchema() {
  return [
    {
      fieldName: 'id',
      label: '工单ID',
      component: 'Input',
      componentProps: {
        placeholder: '系统自动生成，无需输入',
        disabled: true, // 主键只读
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'orderNo',
      label: '工单编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单编号',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required',
       
    },
    {
      fieldName: 'warnId',
      label: '关联预警ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联预警记录ID',
        maxLength: 20,
      },
      labelWidth: '100',
      rules: 'required',
       
    },
    {
      fieldName: 'warnNo',
      label: '关联预警编号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联的预警编号',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required',
       
    },
    {
      fieldName: 'facilityId',
      label: '关联设施ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联的设施ID',
        maxLength: 20,
      },
      labelWidth: '100',
      rules: 'required',
       
    },
    {
      fieldName: 'facilityName',
      label: '处置路段',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关联的设施名称',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required',
      isSearch: true,
    },
    {
      fieldName: 'facilityType',
      label: '处置类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '道路', value: '道路' },
          { label: '桥梁', value: '桥梁' },
          { label: '隧道', value: '隧道' },
          { label: '路灯', value: '路灯' },
          { label: '交通信号', value: '交通信号' },
        ],
        placeholder: '请选择所属设施类型',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
      isSearch: true,
    },
    {
      fieldName: 'assignStaffId',
      label: '指派运维员ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指派运维人员ID',
        maxLength: 20,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'assignStaffName',
      label: '指派运维员',
      component: 'Input',
      componentProps: {
        placeholder: '请输入指派运维人员姓名',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required',
      isSearch: true,
    },
    {
      fieldName: 'orderType',
      label: '工单类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '运维', value: 1 },
          { label: '养护', value: 2 },
          { label: '清淤', value: 3 },
          { label: '巡检', value: 4 },
          { label: '处置', value: 5 },
        ],
        placeholder: '请选择工单类型',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
       
    },
    {
      fieldName: 'biType',
      label: '业务类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入业务类型（具体值依赖工单类型）',
        maxLength: 50,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'dealLimit',
      label: '处置时限(小时)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入处置时限',
        min: 0,
        precision: 1, // 支持小数小时
        addonAfter: '小时',
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'arriveTime',
      label: '抵达现场时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择抵达现场时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
      rules: '', // 非必填，未抵达时为空
    },
    {
      fieldName: 'remindTime',
      label: '提醒时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择提醒时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'completeTime',
      label: '工单完成时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择工单完成时间',
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'areaName',
      label: '所属区域名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工单所属区域名称',
        maxLength: 100,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'areaFullCode',
      label: '所属区域12位全码',
      component: 'Input',
      componentProps: {
        placeholder: '请输入GB/T 2260到社区级的12位全码',
        maxLength: 12,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'priorityLevel',
      label: '工单优先级',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '高', value: 3 },
          { label: '中', value: 2 },
          { label: '低', value: 1 },
        ],
        placeholder: '请选择工单优先级',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'riskLevel',
      label: '安全风险等级',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '高', value: 3 },
          { label: '中', value: 2 },
          { label: '低', value: 1 },
        ],
        placeholder: '请选择安全风险等级',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'processStatus',
      label: '处置进度',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '待处置', value: '待处置' },
          { label: '处置中', value: '处置中' },
          { label: '待核查', value: '待核查' },
          { label: '已完成', value: '已完成' },
        ],
        placeholder: '请选择当前处置进度',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
      isSearch: true,
    },
    {
      fieldName: 'processDesc',
      label: '录入进度说明文本',
      component: 'Input',
      componentProps: {
        placeholder: '请输入进度说明文本',
        type: 'textarea',
        rows: 3,
        maxlength: 500,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'dealContent',
      label: '处理情况说明',
      component: 'Input',
      componentProps: {
        placeholder: '请输入处置措施、故障排查结果等',
        type: 'textarea',
        rows: 4,
        maxlength: 1000,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'superviseOpinion',
      label: '督办意见',
      component: 'Input',
      componentProps: {
        placeholder: '请输入督办意见',
        type: 'textarea',
        rows: 2,
        maxlength: 300,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'siteDataUrlListStr',
      label: '现场检测数据URL',
      component: 'Input',
      componentProps: {
        placeholder: '请输入现场检测数据URL列表字符串',
        maxlength: 500,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'fileDesc',
      label: '录入资料说明',
      component: 'Input',
      componentProps: {
        placeholder: '请输入录入资料说明',
        maxlength: 300,
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '系统自动生成，无需选择',
        disabled: true,
        type: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
      },
      labelWidth: '100',
      rules: '',
    },
    {
      fieldName: 'overTimeFlag',
      label: '超时提醒标识',
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [
          { label: '未超时', value: 0 },
          { label: '已超时', value: 1 },
        ],
        placeholder: '请选择超时提醒标识',
        showSearch: true,
      },
      labelWidth: '100',
      rules: 'required',
    },
    {
      fieldName: 'remainTime',
      label: '预警剩余时间(小时)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入预警剩余时间',
        min: 0,
        precision: 1,
        addonAfter: '小时',
      },
      labelWidth: '100',
      rules: 'required',
    }, 
  ];
}

/** 道路预警工单处置表格列配置 - 匹配后端数据字段 */
export function useGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '工单ID',
      minWidth: 80,
      sortable: true,
    },
    {
      field: 'orderNo',
      title: '工单编号',
      minWidth: 150,
      sortable: true,
      slots: { default: 'orderNo' },
    },
    {
      field: 'warnNo',
      title: '关联预警编号',
      minWidth: 150,
      sortable: true,
    },
    {
      field: 'facilityName',
      title: '处置路段',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'facilityType',
      title: '处置类型',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'assignStaffName',
      title: '指派运维员',
      minWidth: 100,
      sortable: true,
    },
    {
      field: 'orderType',
      title: '工单类型',
      minWidth: 80,
      sortable: true,
      format: (val) => {
        const map = { 1: '运维', 2: '养护', 3: '清淤', 4: '巡检', 5: '处置' };
        return map[val] || val;
      },
    },
    {
      field: 'dealLimit',
      title: '处置时限(小时)',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'remainTime',
      title: '剩余处置时间',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'overTimeFlag',
      title: '超时提醒标识',
      minWidth: 80,
      sortable: true,
      format: (val) => val === 0 ? '未超时' : '已超时',
    },
    {
      field: 'processStatus',
      title: '当前处置进度',
      minWidth: 100,
      sortable: true,
      format: (val) => {
        const map = { 1: '待处置', 2: '处置中', 3: '待核查', 4: '已完成' };
        return map[val] || val;
      },
    },
    {
      field: 'priorityLevel',
      title: '工单优先级',
      minWidth: 80,
      sortable: true,
      format: (val) => {
        const map = { 1: '低', 2: '中', 3: '高' };
        return map[val] || val;
      },
    },
    {
      field: 'riskLevel',
      title: '风险等级',
      minWidth: 80,
      sortable: true,
      format: (val) => {
        const map = { 1: '低', 2: '中', 3: '高' };
        return map[val] || val;
      },
    },
    {
      field: 'areaName',
      title: '所属区域',
      minWidth: 120,
      sortable: true,
    },
    {
      field: 'arriveTime',
      title: '抵达现场时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'completeTime',
      title: '完成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'completeTime',
      title: '完成时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'siteDataUrlListStr',
      title: '现场检测数据',
      minWidth: 180,
      sortable: true,
    },
     {
      field: 'dealContent',
      title: '已完成处置内容',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'updateTime',
      title: '处置进度更新时间',
      minWidth: 180,
      sortable: true,
    },
    {
      field: 'createTime',
      title: '工单创建时间',
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